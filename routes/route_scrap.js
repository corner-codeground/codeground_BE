const express = require("express");
const { Scrap, Post, User } = require("../models");
const { isLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

/* 
스크랩 추가/취소 (POST /scraps) 
요청 데이터 { post_id }
사용자가 특정 게시글을 스크랩했으면 취소, 안 했으면 추가
 */
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { post_id } = req.body;
    const user_id = req.user.id;

    // 기존 스크랩 여부 확인
    const existingScrap = await Scrap.findOne({ where: { user_id, post_id } });

    if (existingScrap) {
      // 이미 스크랩한 경우 -> 스크랩 취소 
      await existingScrap.destroy();
      return res.json({ message: "스크랩이 취소되었습니다." });
    }

    // 스크랩 추가
    await Scrap.create({ user_id, post_id });
    res.status(201).json({ message: "스크랩이 추가되었습니다." });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/*
마이페이지 스크랩 목록 조회 
(GET /scraps/mypage)
로그인한 사용자가 스크랩한 게시글 목록 최신순으로 
*/
router.get("/mypage", isLoggedIn, async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const scrapList = await Scrap.findAll({
      where: { user_id },
      include: [{ model: Post, attributes: ["id", "title", "content"] }], // 게시글 정보 포함
      order: [["createdAt", "DESC"]], // 최신순으로로 정렬
    });

    res.json(scrapList);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

/* 
특정 스크랩 취소 
(DELETE /scraps/:scrap_id)
사용자가 선택한 특정 스크랩 취소
*/
router.delete("/:scrap_id", isLoggedIn, async (req, res, next) => {
  try {
    const { scrap_id } = req.params;
    const user_id = req.user.id;

    const scrap = await Scrap.findOne({ where: { id: scrap_id, user_id } });
    if (!scrap) {
      return res.status(404).json({ message: "스크랩이 존재하지 않습니다." });
    }

    await scrap.destroy();
    res.json({ message: "스크랩이 취소되었습니다." });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;