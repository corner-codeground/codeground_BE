const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 게시글 생성 (로그인 필요)
router.post("/", isLoggedIn, postController.createPost);

// 특정 게시글 조회
router.get("/:id", postController.getPostById);

// 전체 게시글 조회
router.get("/", postController.getAllPosts);

// 게시글 수정 (로그인 필요)
router.put("/:id", isLoggedIn, postController.updatePost);

// 게시글 삭제 (로그인 필요)
router.delete("/:id", isLoggedIn, postController.deletePost);

// 게시글 검색 API
router.get("/search", postController.searchPosts);

module.exports = router;