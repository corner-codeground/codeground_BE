const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); 

// 게시글 생성 (로그인 필요, 이미지 포함)
router.post("/", isLoggedIn, upload.single("image"), postController.createPost);

// 게시글 검색 API
router.get("/search", postController.searchPost);

// 전체 게시글 조회
router.get("/", postController.getAllPosts);

// 🔹 특정 게시글 조회 (기존 `getPostById` → `getPostDetail`로 변경)
router.get("/:id", postController.getPostDetail);

// 게시글 수정 (로그인 필요)
router.put("/:id", isLoggedIn, upload.single("image"), postController.updatePost);

// 게시글 삭제 (로그인 필요)
router.delete("/:id", isLoggedIn, postController.deletePost);

module.exports = router;
