const Community = require("../models/community");

exports.getPopularPosts = async (req, res) => {
  try {
    const popularPosts = await Community.findAll({
      order: [
        ["likes", "DESC"], // 좋아요 순 정렬
        ["viewCount", "DESC"], // 조회수 순 정렬
      ],
      limit: 10, // 상위 10개 인기글만 반환
    });

    res.status(200).json({ success: true, data: popularPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.increaseViewCount = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Community.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "게시글이 없습니다." });
    }

    // 조회수 증가
    post.viewCount += 1;
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};

exports.getPostsByCategory = async (req, res) => {
  const { category } = req.params; // URL에서 게시판 카테고리 가져오기

  try {
    const posts = await Community.findAll({
      where: { category },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: "서버 오류" });
  }
};
