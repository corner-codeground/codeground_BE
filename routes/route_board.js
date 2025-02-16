const express = require("express");
const { Board, Post } = require("../models");
const router = express.Router();

// 게시판 목록 조회
router.get("/", async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시판 목록 조회 중 오류 발생" });
  }
});

// 특정 게시판의 게시글 조회
router.get("/:boardId/posts", async (req, res) => {
  try {
    const { boardId } = req.params;
    const posts = await Post.findAll({ where: { board_id: boardId } });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시판 내 게시글 조회 중 오류 발생" });
  }
});

module.exports = router;
