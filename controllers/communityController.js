const Post = require("../models/post");

// 인기 게시글 조회 (좋아요 & 조회수 순 정렬, 상위 10개)
exports.getPopularPosts = async (req, res) => {
  try {
    const popularPosts = await Post.findAll({
      order: [
        ["likes", "DESC"],     // 좋아요 순 정렬
        ["viewCount", "DESC"], // 조회수 순 정렬
      ],
      limit: 10, // 상위 10개 인기글만 반환
    });

    res.status(200).json({ success: true, data: popularPosts });
  } catch (error) {
    console.error("인기 게시글 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 특정 게시글 조회수 증가 (`postId` 기준)
exports.increaseViewCount = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "게시글이 없습니다." });
    }

    // 조회수 증가
    post.viewCount += 1;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("조회수 증가 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 특정 카테고리에서 인기 게시글 조회 (`GET /community/popular?category=프론트엔드`)
exports.getPopularPostsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ success: false, message: "카테고리를 입력하세요." });
    }

    const popularPosts = await Post.findAll({
      where: { category },
      order: [
        ["likes", "DESC"],     // 좋아요 순 정렬
        ["viewCount", "DESC"], // 조회수 순 정렬
      ],
      limit: 10, // 상위 10개 인기글만 반환
    });

    res.status(200).json({ success: true, data: popularPosts });
  } catch (error) {
    console.error("카테고리별 인기 게시글 조회 오류:", error);
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};
