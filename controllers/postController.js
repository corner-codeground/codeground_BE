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

// 📌 2️⃣ 특정 게시글 조회
const getPostById = async (req, res) => {
    const { id } = req.params;

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

        res.json(post);
    } catch (err) {
        console.error("게시글 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 3️⃣ 전체 게시글 조회
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
            return res.status(404).json({ message: "게시글이 없습니다." });
        }

        res.json(posts);
    } catch (err) {
        console.error("게시글 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 4️⃣ 게시글 검색 (부분 일치 검색)
const searchPosts = async (req, res) => {
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

// 📌 5️⃣ 게시글 수정 (로그인 필요)
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, is_public, hashtags, removeImage } = req.body;
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

        // ✅ 기존 이미지 삭제 (removeImage 값이 true이면 삭제)
        if (removeImage === "true" && post.image_url) {
            deleteImage(`.${post.image_url}`);
            newImageUrl = null;
        }

        // ✅ 새로운 이미지 업로드 시 기존 이미지 삭제 후 새 이미지 저장
        if (req.file) {
            if (post.image_url) {
                deleteImage(`.${post.image_url}`);
            }
            newImageUrl = `/uploads/${req.file.filename}`;
        }

        await post.update({ title, content, is_public, image_url: newImageUrl });

        if (hashtags && hashtags.length > 0) {
            const tagInstances = await Promise.all(
                hashtags.map(tag => db.Hashtag.findOrCreate({ where: { tag } }))
            );
            await post.setHashtags(tagInstances.map(t => t[0]));
        }

        res.json({ message: "게시글이 수정되었습니다.", post });
    } catch (err) {
        console.error("게시글 수정 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 6️⃣ 게시글 삭제 (로그인 필요)
const deletePost = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    console.log(`[DELETE 요청] 게시글 ID: ${id}, 요청 사용자 ID: ${user_id}`);

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (String(post.user_id) !== String(user_id)) {
            return res.status(403).json({ message: "삭제 권한이 없습니다." });
        }

        // ✅ 게시글 삭제 시 이미지 파일도 삭제
        if (post.image_url) {
            deleteImage(`.${post.image_url}`);
        }

        await post.destroy();
        console.log("✅ 게시글 삭제 완료:", id);
        res.json({ message: "게시글이 삭제되었습니다." });

    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ message: "서버 오류 발생", error: err.toString() });
    }
};

module.exports = {
    upload,
    createPost,
    getPostById,
    getAllPosts,
    searchPosts,
    updatePost,
    deletePost
};
