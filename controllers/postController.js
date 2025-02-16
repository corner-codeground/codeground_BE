const { Op } = require("sequelize");
const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 이미지 업로드 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage });

// 기존 이미지 삭제 함수
const deleteImage = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

// ✅ 1️⃣ 게시글 생성 (게시판별 글쓰기)
const createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "로그인이 필요합니다." });
        }
        const user_id = req.user.id;
        const { title, content, is_public, hashtags, board_id } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content || !board_id) {
            return res.status(400).json({ message: "제목, 내용, 게시판 ID는 필수 입력 항목입니다." });
        }

        // ✅ 존재하는 게시판인지 확인
        const board = await db.Board.findByPk(board_id);
        if (!board) {
            return res.status(400).json({ message: "존재하지 않는 게시판입니다." });
        }

        // ✅ 게시글 생성
        const newPost = await db.Post.create({ 
            title, 
            content, 
            is_public, 
            user_id, 
            image_url, 
            board_id 
        });

        // ✅ 해시태그 연결
        if (hashtags && hashtags.length > 0) {
            const tagInstances = await Promise.all(
                hashtags.map(tag => db.Hashtag.findOrCreate({ where: { tag } }))
            );
            await newPost.addHashtags(tagInstances.map(t => t[0]));
        }

        res.status(201).json({ message: "게시글이 등록되었습니다.", post: newPost });
    } catch (err) {
        console.error("게시글 생성 오류:", err);
        res.status(500).json({ message: "서버 내부 오류 발생" });
    }
};

// ✅ 2️⃣ 전체 게시글 조회 (게시판별 필터 추가)
const getAllPosts = async (req, res) => {
    try {
        const { board_id } = req.query; // 특정 게시판 필터링 옵션

        const filter = board_id ? { board_id } : {}; 

        const posts = await db.Post.findAll({
            where: filter,
            include: [
                { model: db.User, attributes: ["id", "username"] },
                { model: db.Board, attributes: ["id", "name"] },
                { model: db.Hashtag, attributes: ["tag"] }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.json(posts);
    } catch (err) {
        console.error("게시글 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// ✅ 3️⃣ 게시글 상세 조회 (게시판 정보 포함)
const getPostDetail = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user ? req.user.id : null;

    try {
        const post = await db.Post.findByPk(id, {
            include: [
                { model: db.User, attributes: ["id", "username"] },
                { model: db.Board, attributes: ["id", "name"] },
                { model: db.Hashtag, attributes: ["tag"] }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        const isOwner = user_id && String(post.user_id) === String(user_id);

        res.json({
            id: post.id,
            title: post.title,
            content: post.content,
            user: post.User.username,
            board: post.Board.name,
            image_url: post.image_url,
            createdAt: post.createdAt,
            isOwner,
        });
    } catch (err) {
        console.error("게시글 검색 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// ✅ 4️⃣ 게시글 검색 (게시판 필터 추가)
const searchPost = async (req, res) => {
    try {
        const { keyword, board_id } = req.query;

        if (!keyword || keyword.length < 2) {
            return res.status(400).json({ message: "최소 2글자 이상의 검색어를 입력해야 합니다." });
        }

        const filter = {
            [Op.or]: [
                { title: { [Op.like]: `%${keyword}%` } },
                { content: { [Op.like]: `%${keyword}%` } },
            ]
        };

        if (board_id) {
            filter.board_id = board_id; 
        }

        const posts = await db.Post.findAll({
            where: filter,
            include: [
                { model: db.User, attributes: ["id", "username"] },
                { model: db.Board, attributes: ["id", "name"] }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.json(posts);
    } catch (err) {
        console.error("게시글 검색 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// ✅ 5️⃣ 게시글 수정
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, removeImage } = req.body;
    const user_id = req.user.id;

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (String(post.user_id) !== String(user_id)) {
            return res.status(403).json({ message: "수정 권한이 없습니다." });
        }

        let newImageUrl = post.image_url;

        if (removeImage === "true" && post.image_url) {
            deleteImage(`.${post.image_url}`);
            newImageUrl = null;
        }

        if (req.file) {
            if (post.image_url) {
                deleteImage(`.${post.image_url}`);
            }
            newImageUrl = `/uploads/${req.file.filename}`;
        }

        await post.update({ title, content, image_url: newImageUrl });

        res.json({ message: "게시글이 수정되었습니다.", post });
    } catch (err) {
        console.error("게시글 수정 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// ✅ 6️⃣ 게시글 삭제
const deletePost = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (String(post.user_id) !== String(user_id)) {
            return res.status(403).json({ message: "삭제 권한이 없습니다." });
        }

        await post.destroy();
        res.json({ message: "게시글이 삭제되었습니다." });

    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

// ✅ 특정 게시판에 게시글 추가
const createPostInBoard = async ({ title, content, boardId, user_id }) => {
    try {
        const board = await db.Board.findByPk(boardId);
        if (!board) {
            throw new Error("존재하지 않는 게시판입니다.");
        }

        const newPost = await db.Post.create({
            title,
            content,
            board_id: boardId,
            user_id,
        });

        return newPost;
    } catch (error) {
        console.error("❌ 게시글 추가 오류:", error);
        throw error;
    }
};

// ✅ 조회수 증가 API
const increaseViewCount = async (req, res) => {
    try {
        const { postId } = req.params;

        // 게시글 찾기
        const post = await db.Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        // 조회수 증가
        post.view_count = (post.view_count || 0) + 1;
        await post.save();

        res.json({ message: "조회수가 증가되었습니다.", viewCount: post.view_count });
    } catch (err) {
        console.error("조회수 증가 오류:", err);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

module.exports = {
    upload, //제거해도될듯
    createPost,
    createPostInBoard, // ⬅️ 이 부분 추가
    getAllPosts,
    getPostDetail,
    searchPost,
    updatePost,
    deletePost,
    increaseViewCount, 
};