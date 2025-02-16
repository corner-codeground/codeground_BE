const express = require("express");
const { Board, Post } = require("../models");
const router = express.Router();

// ✅ 게시판 목록 조회 (게시글 포함)
router.get("/", async (req, res) => {
  try {
    const boards = await Board.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // ✅ Board에서 createdAt, updatedAt 제거
      include: [
        {
          model: Post,
          separate: true, // ✅ 이걸 추가해야 order와 limit이 정상 동작함
          order: [["createdAt", "DESC"]], // 최신 게시글 순 정렬
          limit: 30, // ✅ 각 게시판에서 최대 5개의 게시글만 조회
        },
      ],
      order: [["id", "ASC"]], // ✅ 게시판 ID 순 정렬
    });

    res.json(boards);
  } catch (error) {
    console.error("게시판 조회 오류:", error);
    res.status(500).json({ error: "게시판 목록 조회 중 오류 발생" });
  }
});

// ✅ 특정 게시판의 게시글 조회
router.get("/:boardId/posts", async (req, res) => {
  try {
    const { boardId } = req.params;
    const posts = await Post.findAll({ where: { board_id: boardId } });
    res.json(posts);
  } catch (error) {
    console.error("게시판 내 게시글 조회 오류:", error);
    res.status(500).json({ error: "게시판 내 게시글 조회 중 오류 발생" });
  }
});

module.exports = router;
