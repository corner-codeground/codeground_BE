const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController"); // ✅ 컨트롤러 가져오기
const {isLoggedIn}=require("../middleware/authMiddleware");

// 📌 1️⃣ 게시글 생성
router.post("/", isLoggedIn, postController.createPost);

// 📌 2️⃣ 특정 게시글 조회
router.get("/:id", postController.getPostById);

// 📌 3️⃣ 전체 게시글 조회
router.get("/", postController.getAllPosts);

// 📌 4️⃣ 게시글 수정
router.put("/:id", isLoggedIn, postController.updatePost);

// 📌 5️⃣ 게시글 삭제
router.delete("/:id", isLoggedIn, postController.deletePost);

module.exports = router;
