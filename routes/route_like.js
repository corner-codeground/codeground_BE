const express = require('express');
const { Like, Post, User } = require('../models');
const { isLoggedIn } = require('../middlewares/middleware_auth'); // 로그인 체크 미들웨어

const router = express.Router();

/**
 * ✅ 1. 좋아요 추가 (POST /likes)
 * 요청 데이터: { post_id }
 * - 로그인한 사용자가 특정 게시글에 좋아요 추가
 */
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id;

    console.log("📌 좋아요 추가 요청 - user_id:", user_id, "post_id:", post_id);

    if (!post_id) {
      return res.status(400).json({ message: "post_id가 없습니다." });
    }

    // ✅ `findOrCreate()`를 사용하여 중복 `INSERT` 방지
    const [like, created] = await Like.findOrCreate({
      where: { user_id, post_id },
      defaults: { user_id, post_id }
    });

    if (!created) {
      console.log("⚠️ 이미 좋아요를 눌렀습니다. DELETE 요청을 자동 실행합니다.");
      await Like.destroy({ where: { user_id, post_id } });
      return res.status(200).json({ message: "좋아요 취소 완료" });
    }

    console.log("✅ 좋아요 추가 완료 - user_id:", user_id, "post_id:", post_id);
    res.status(201).json({ message: "좋아요 추가 완료" });

  } catch (err) {
    console.error("좋아요 추가 오류:", err);
    next(err);
  }
});


router.delete('/', isLoggedIn, async (req, res, next) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id;

    console.log("📌 좋아요 취소 요청 - user_id:", user_id, "post_id:", post_id);

    // ✅ 데이터를 완전히 삭제 (Soft Delete가 아닌 Hard Delete)
    const deleted = await Like.destroy({ where: { user_id, post_id }, force: true });

    if (!deleted) {
      return res.status(400).json({ message: "좋아요가 존재하지 않습니다." });
    }

    console.log("✅ 좋아요 완전 삭제 완료 - user_id:", user_id, "post_id:", post_id);
    res.json({ message: "좋아요 취소 완료" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


/*
 * ✅ 2. 좋아요 취소 (DELETE /likes)
 * 요청 데이터: { post_id }
 * - 로그인한 사용자가 특정 게시글의 좋아요를 취소
 
router.delete('/', isLoggedIn, async (req, res, next) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id;

    console.log("📌 좋아요 취소 요청 - user_id:", user_id);
    console.log("📌 좋아요 취소 요청 - post_id:", post_id);

    const deleted = await Like.destroy({ where: { user_id, post_id } });
    if (!deleted) {
      return res.status(400).json({ message: "좋아요가 존재하지 않습니다." });
    }

    console.log("✅ 좋아요 취소 완료 - user_id:", user_id, "post_id:", post_id);
    res.json({ message: "좋아요 취소 완료" });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
;
*/
/**
 * ✅ 3. 특정 게시글의 좋아요 수 조회 (GET /likes/:post_id/count)
 * - 특정 게시글에 대한 좋아요 수 반환
 */
router.get('/:post_id/count', async (req, res, next) => {
  try {
    const { post_id } = req.params;
    console.log(`📌 요청된 post_id: ${post_id}`); // ✅ post_id 값 확인

    if (!post_id) {
      return res.status(400).json({ message: "post_id가 없습니다." });
    }

    const likeCount = await Like.count({ where: { post_id } });

    console.log(`📌 post_id ${post_id}의 좋아요 개수: ${likeCount}`); // ✅ 디버깅 로그 추가

    res.json({ post_id, likeCount });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/**
 * ✅ 4. 특정 사용자가 특정 게시글에 좋아요 눌렀는지 확인 (GET /likes/check?post_id=1)
 * - 사용자가 특정 게시글을 좋아요했는지 확인
 */
router.get('/check', isLoggedIn, async (req, res, next) => {
  try {
    const { post_id } = req.query;
    const user_id = req.user.id;

    const likeExists = await Like.findOne({ where: { user_id, post_id } });

    res.json({ liked: !!likeExists });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
