const db = require("../models");
const createPost = async (req, res) => {
    try {
        const user_id=req.user.id;
        const { title, content, is_public, hashtags } = req.body;

        if (!title || !content || !user_id || !hashtags || hashtags.length === 0) {
            return res.status(400).json({ message: "제목, 내용, 해시태그는 필수 입력 항목입니다." });
        }

        console.log("✅ [게시글 생성] 요청된 user_id:", user_id);

        // ✅ 2️⃣ 게시글 생성
        const newPost = await db.Post.create({ 
            title, 
            content, 
            is_public, 
            user_id
        });

        // ✅ 3️⃣ 해시태그 연결
        if (hashtags.length > 0) {
            const tagInstances = await Promise.all(
                hashtags.map(tag => db.Hashtag.findOrCreate({ where: { tag } }))
            );
            await newPost.addHashtags(tagInstances.map(t => t[0]));
        }

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
            ]
        });
        res.json(posts);
    } catch (err) {
        console.error("게시글 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 4️⃣ 게시글 수정
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, is_public, hashtags, user_id } = req.body;

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (String(post.user_id) !== String(user_id)) {
            return res.status(403).json({ message: "수정 권한이 없습니다." });
        }

        await post.update({ title, content, is_public });

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

// 📌 5️⃣ 게시글 삭제
const deletePost = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    console.log(`🔎 [DELETE 요청] 게시글 ID: ${id}, 요청 사용자 ID: ${user_id}`);

    if (!user_id) {
        return res.status(400).json({ message: "삭제 요청에 user_id가 포함되어야 합니다." });
    }

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        if (String(post.user_id) !== String(user_id)) {
            return res.status(403).json({ message: "삭제 권한이 없습니다." });
        }

        await post.destroy();
        console.log("✅ 게시글 삭제 완료:", id);
        res.json({ message: "게시글이 삭제되었습니다." });

    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ message: "서버 오류 발생", error: err.toString() });
    }
};

// ✅ module.exports 추가!
module.exports = {
    createPost,
    getPostById,
    getAllPosts,
    updatePost,
    deletePost
};
