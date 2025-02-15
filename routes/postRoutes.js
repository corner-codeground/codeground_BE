
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // 올바르게 불러오는지 확인
const { isLoggedIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 디버깅: 라우트가 실행되는지 확인
console.log("postRoutes.js 라우트 실행됨");

// 게시글 목록 조회
router.get("/", postController.getAllPosts);

// 게시글 생성 (로그인 필요, 이미지 업로드 포함)
router.post("/", isLoggedIn, upload.single("image"), postController.createPost);

// 게시글 검색 API (검색어 기반 게시글 조회)
router.get("/search", postController.searchPost);

// 특정 게시글 조회 (게시글 상세보기)
router.get("/:id", postController.getPostDetail);

// 게시글 수정 (로그인 필요, 본인 게시글만 수정 가능)
router.put("/:id", isLoggedIn, upload.single("image"), postController.updatePost);

// 게시글 삭제 (로그인 필요, 본인 게시글만 삭제 가능)
router.delete("/:id", isLoggedIn, postController.deletePost);

module.exports = router;
