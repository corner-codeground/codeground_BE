const { Op } = require("sequelize");
const db = require("../models");

// ✅ 조회수 증가 API
const increaseViewCount = async (req, res) => {
  try {
      const { postId } = req.params;

      const post = await db.TrendingPost.findByPk(postId);
      if (!post) {
          return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
      }

      post.view_count += 1;
      await post.save();

      res.json({ message: "조회수가 증가되었습니다.", view_count: post.view_count });
  } catch (error) {
      console.error("조회수 증가 오류:", error);
      res.status(500).json({ message: "서버 오류 발생" });
  } // ✅ `try` 블록을 올바르게 닫음
}; // ✅ 함수 전체 닫힘 확인!



// ✅ 전체 트렌딩 게시글 조회
const getTrendingPosts = async (req, res) => {
    try {
      const posts = await db.Post.findAll({
        where: {
            view_count: { [Op.gt]: 0 } // ✅ 좋아요가 아닌 조회수만 필터링
        },
        attributes: {
            include: [
                // ✅ Like 테이블에서 좋아요 수 계산
                [db.Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes.post_id = Post.id)`), "likes"]
            ]
        },
        include: [{ model: db.Board, attributes: ["id", "name"] }],
        order: [[db.Sequelize.literal("likes"), "DESC"], ["view_count", "DESC"]], // ✅ 좋아요 많은 순 정렬
        limit: 10,
      });
    

        res.json(posts);
    } catch (error) {
        console.error("트렌딩 게시글 조회 오류:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

// ✅ 특정 게시판의 트렌딩 게시글 조회
const getTrendingPostsByBoard = async (req, res) => {
    try {
        const { boardId } = req.params;

        const posts = await db.TrendingPost.findAll({
            where: { board_id: boardId },
            order: [["likes", "DESC"], ["view_count", "DESC"]],
            limit: 10,
        });

        res.json(posts);
    } catch (error) {
        console.error("게시판별 트렌딩 게시글 조회 오류:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

// ✅ 특정 카테고리(게시판)의 트렌딩 게시글 조회
const getTrendingPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const board = await db.Board.findOne({ where: { name: category } });
        if (!board) {
            return res.status(404).json({ message: "해당 카테고리(게시판)를 찾을 수 없습니다." });
        }

        const posts = await db.TrendingPost.findAll({
            where: { board_id: board.id },
            order: [["likes", "DESC"], ["view_count", "DESC"]],
            limit: 10,
        });

        res.json(posts);
    } catch (error) {
        console.error("카테고리별 트렌딩 게시글 조회 오류:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
};

module.exports = { increaseViewCount, getTrendingPosts, getTrendingPostsByBoard, getTrendingPostsByCategory };
