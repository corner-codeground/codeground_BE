const express = require("express");
const { Comment } = require("../models");
const { isLoggedIn } = require("../middlewares/middleware_auth"); // ✅ 로그인 미들웨어 추가

const router = express.Router();

/**
 * ✅ 댓글 작성 (POST /comment)
 * - 로그인한 사용자만 댓글 작성 가능
 */
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { post_id, comment } = req.body;

    if (!post_id || !comment) {
      return res.status(400).json({ message: "게시글 ID와 댓글 내용을 입력해주세요." });
    }

    const newComment = await Comment.create({
      post_id,
      user_id: req.user.id, // ✅ 로그인한 사용자의 ID 사용
      comment,
    });

    res.status(201).json({ message: "댓글 작성 완료!", comment: newComment });
  } catch (err) {
    console.error("댓글 작성 오류:", err);
    next(err);
  }
});

/**
 * ✅ 댓글 수정 및 삭제 (PATCH, DELETE /comment/:id)
 * - 로그인한 사용자만 댓글 수정 및 삭제 가능
 */
router
  .route("/:id")
  .patch(isLoggedIn, async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
      }

      // ✅ 본인 댓글만 수정 가능
      if (comment.user_id !== req.user.id) {
        return res.status(403).json({ message: "본인의 댓글만 수정할 수 있습니다." });
      }

      await comment.update({ comment: req.body.comment });
      res.json({ message: "댓글이 수정되었습니다.", comment });
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .delete(isLoggedIn, async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) {
        return res.status(404).json({ message: "삭제할 댓글을 찾을 수 없습니다." });
      }

      // ✅ 본인 댓글만 삭제 가능
      if (comment.user_id !== req.user.id) {
        return res.status(403).json({ message: "본인의 댓글만 삭제할 수 있습니다." });
      }

      await comment.destroy();
      res.json({ message: "댓글이 삭제되었습니다." });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

module.exports = router;
