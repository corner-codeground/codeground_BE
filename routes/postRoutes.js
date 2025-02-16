const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { isLoggedIn } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 디버깅: 라우트 실행 확인
console.log("[DEBUG] postRoutes.js 라우트 실행됨");

// 게시글 목록 조회 (게시판 ID 필터링 가능)
router.get("/", postController.getAllPosts);

// 특정 게시글 조회
router.get("/:id", postController.getPostDetail);

// 게시글 검색 (게시판 ID 필터링 가능)
router.get("/search", postController.searchPost);

// 게시글 생성 (로그인 필요, 이미지 업로드 포함)
router.post("/", isLoggedIn, upload.single("image"), postController.createPost);

// 특정 게시판에 게시글 추가 (경로 명확하게 수정: `/posts/board/:boardId`)
router.post("/board/:boardId", isLoggedIn, async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, content } = req.body;
    const user_id = req.user.id; // 로그인한 사용자 ID

    // 게시글 생성 요청을 컨트롤러로 전달
    const newPost = await postController.createPostInBoard({ title, content, boardId, user_id });

    res.status(201).json({ message: "게시글이 추가되었습니다.", post: newPost });
  } catch (error) {
    console.error("게시글 추가 오류:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

// 게시글 수정 (로그인 필요, 본인 게시글만 수정 가능)
router.put("/:id", isLoggedIn, upload.single("image"), postController.updatePost);

// 게시글 삭제 (로그인 필요, 본인 게시글만 삭제 가능)
router.delete("/:id", isLoggedIn, postController.deletePost);

module.exports = router;
