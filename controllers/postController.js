const { Op } = require("sequelize");
const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📌 이미지 업로드 설정 (multer 사용)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({ storage });

// ✅ 기존 이미지 삭제 함수
const deleteImage = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

// 📌 1️⃣ 게시글 생성 (로그인 필요)
const createPost = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "로그인이 필요합니다." });
        }
        const user_id = req.user.id;
        const { title, content, is_public, hashtags } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null; // 이미지 URL 저장
        
        if (!title || !content || !hashtags || hashtags.length === 0) {
            return res.status(400).json({ message: "제목, 내용, 해시태그는 필수 입력 항목입니다." });
        }

        console.log("✅ [게시글 생성] 요청된 user_id:", user_id);

        const newPost = await db.Post.create({ title, content, is_public, user_id, image_url });

        // 해시태그 연결
        const tagInstances = await Promise.all(
            hashtags.map(tag => db.Hashtag.findOrCreate({ where: { tag } }))
        );
        await newPost.addHashtags(tagInstances.map(t => t[0]));

        res.status(201).json({ message: "게시글이 등록되었습니다.", post: newPost });
    } catch (err) {
        console.error("게시글 생성 오류:", err);
        res.status(500).json({ message: "서버 내부 오류 발생", error: err.toString() });
    }
};

// 📌 2️⃣ 전체 게시글 조회 (목록)
const getAllPosts = async (req, res) => {
    try {
        const posts = await db.Post.findAll({
            include: [
                { model: db.User, attributes: ["id", "username"] },
                { model: db.Hashtag, attributes: ["tag"] }
            ],
            order: [["createdAt", "DESC"]]
        });

        if (!posts || posts.length === 0) {
            return res.json([]); // ✅ 404 대신 빈 배열 반환
        }
        

        // ✅ 프론트엔드에서 제목 클릭 후 상세 페이지 이동 가능하도록 ID 포함
        const formattedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            user: post.User.username,
            createdAt: post.createdAt,
        }));

        res.json(formattedPosts);
    } catch (err) {
        console.error("게시글 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 3️⃣ 게시글 상세 조회 (제목 클릭 시 내용 표시)
const getPostDetail = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user ? req.user.id : null; // 로그인한 사용자 정보

    try {
        const post = await db.Post.findByPk(id, {
            include: [
                { model: db.User, attributes: ["id", "username"] },
                { model: db.Hashtag, attributes: ["tag"] }
            ]
        });

        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        // ✅ 본인 게시글 여부 확인 (버튼 표시 여부 결정)
        const isOwner = user_id && String(post.user_id) === String(user_id);

        res.json({
            id: post.id,
            title: post.title,
            content: post.content,
            user: post.User.username,
            image_url: post.image_url,
            createdAt: post.createdAt,
            isOwner, // 프론트에서 이 값으로 수정/삭제 버튼을 표시할지 결정
        });
    } catch (err) {
        console.error("게시글 검색 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 4️⃣ 게시글 수정 (본인만 가능)
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

// 📌 5️⃣ 게시글 삭제 (본인만 가능)
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

        if (post.image_url) {
            deleteImage(`.${post.image_url}`);
        }

        await post.destroy();
        res.json({ message: "게시글이 삭제되었습니다." });

    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};
// 📌 6️⃣ 게시글 검색 (부분 일치 검색)
const searchPost = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.length < 2) {
            return res.status(400).json({ message: "검색어는 최소 2글자 이상 입력해야 합니다." });
        }

        console.log("🔍 [검색 요청] 키워드:", keyword);

        const posts = await db.Post.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${keyword}%` } },
                    { content: { [Op.like]: `%${keyword}%` } },
                ]
            },
            include: [
                { model: db.User, attributes: ["id", "username"] },
                {
                    model: db.Hashtag,
                    where: { tag: { [Op.like]: `%${keyword}%` } },
                    required: false
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        return res.json(posts);
    } catch (err) {
        console.error("게시글 검색 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// ✅ 올바르게 `module.exports` 설정 (누락된 함수 포함)
module.exports = {
    upload,
    createPost,
    getAllPosts,
    getPostDetail,
    updatePost,
    deletePost,
    searchPost,
};
