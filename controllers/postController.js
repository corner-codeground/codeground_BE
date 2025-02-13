const db = require("../models"); // Sequelize 모델 가져오기

// 📌 게시글 생성 (POST)
exports.createPost = async (req, res) => {
    const { title, content, is_public, user_id, hashtags } = req.body;
    if (!hashtags||hashtags.length==0){
        return res.status(400).json({message:"해시태그는 필수 입력 항목입니다."});
    }
    if (!title || !content || user_id === undefined) {
        return res.status(400).json({ message: "필수 입력값이 없습니다." });
    }

    try {
        const newPost = await db.Post.create({ title, content, is_public, user_id });

    
        // 해시태그 처리
        const tagInstances = await Promise.all(
                hashtags.map(tag => db.Hashtag.findOrCreate({ where: { tag } }))
            );

        await newPost.addHashtags(tagInstances.map(t => t[0]));

        res.status(201).json({ message: "게시글이 등록되었습니다.", post: newPost });
    } catch (err) {
        console.error("게시글 생성 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 특정 게시글 조회 (GET)
exports.getPostById = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await db.Post.findByPk(id, {
            include: [{ model: db.Hashtag, attributes: ["tag"] }]
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

// 📌 전체 게시글 조회 (GET)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await db.Post.findAll({
            include: [{ model: db.Hashtag, attributes: ["tag"] }]
        });
        res.json(posts);
    } catch (err) {
        console.error("게시글 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};

// 📌 게시글 수정 (PUT)
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content, is_public, hashtags } = req.body;

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        await post.update({ title, content, is_public });

        // 해시태그 업데이트
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

// 📌 게시글 삭제 (DELETE)
exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await db.Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
        }

        await post.destroy();
        res.json({ message: "게시글이 삭제되었습니다." });
    } catch (err) {
        console.error("게시글 삭제 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
};
