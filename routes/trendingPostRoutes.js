const express = require("express");
const { getTrendingPosts, getTrendingPostsByBoard, getTrendingPostsByCategory } = require("../controllers/trendingPostController");

const router = express.Router();

// ✅ 전체 트렌딩 게시글 조회
router.get("//", getTrendingPosts);

// ✅ 특정 게시판의 트렌딩 게시글 조회
router.get("/board/:boardId", getTrendingPostsByBoard);

// ✅ 특정 카테고리(게시판)의 트렌딩 게시글 조회
router.get("/category/:category", getTrendingPostsByCategory);

module.exports = router;
