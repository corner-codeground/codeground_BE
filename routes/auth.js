const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const { User, Follow } = require('../models');
// const Follow = require("../models/follow");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/authMiddleware"); 
const upload = require("../middleware/upload");
const { Op } = require('sequelize');

const router = express.Router();

// 회원가입 처리 ok
router.post("/join", isNotLoggedIn, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).send('비밀번호가 일치하지 않습니다.'); // 비밀번호 일치 확인 추가
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('이미 등록된 이메일입니다.');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    res.status(500).json({ message: "회원가입 성공" });
  } catch(err) {
    console.error('회원가입 실패:', err);
    res.status(500).send('회원가입 실패');
  }
});

// 로그인 처리 ok
router.post("/login", isNotLoggedIn, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "잘못된 이메일 또는 비밀번호입니다." });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "잘못된 사용자명 또는 비밀번호입니다." });
    }
    // JWT 토큰 생성
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "로그인 성공", token, user }); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류" });
  }
});

// /profile, /profile/:id 에서 프로필 조회 공통 로직
async function renderProfile(req, res, userId) {
  try {
    const currentUser = await User.findByPk(userId, {
      attributes: ["username", "bio", "profileImage"],
    });
    
    if (!currentUser) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const followersCount = await Follow.count({ where: { following_id: userId },});
    const followingsCount = await Follow.count({ where: { follower_id: userId },});

    const isOwnProfile = req.user && req.user.id === Number(userId);

    res.json({
      user: currentUser,
      followersCount, 
      followingsCount, 
      currentUser, 
      isOwnProfile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오류" });
  }
}
// 팔로잉 목록 조회 ok
router.get('/profile/following', isLoggedIn, async (req, res) => {
  const userId = req.user.id; 
  try {
    const following = await Follow.findAll({
      where: { follower_id: userId }, // 내가 팔로우한 사용자
      include: [{ model: User, as: 'FollowingUser', attributes: ['username', 'profileImage'] }]
    });
    if (following.length === 0) { 
      return res.json({ message: "팔로우한 사용자가 없습니다." }); 
    }
    res.json({following});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 팔로워 목록 조회 ok
router.get('/profile/follower', isLoggedIn, async (req, res) => {
  const userId = req.user.id; 
  try {
    const followers = await Follow.findAll({
      where: { following_id: userId }, // 나를 팔로우한 사용자
      include: [{ model: User, as: 'FollowerUser', attributes: ['username', 'profileImage'] }]
    });
    res.json({ followers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 프로필 조회 ok
router.get("/profile", isLoggedIn, async (req, res) => {
  console.log(req.user); 
  if (!req.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." }); // 로그인 안 된 경우
  }
  await renderProfile(req, res, req.user.id);
}); 

// 프로필 조회 (다른 사용자 프로필) ok
router.get('/profile/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await renderProfile(req, res, id); // 특정 사용자 id를 전달하여 프로필 조회
});

// 계정 관리 조회 ok
router.get("/account", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ["profileImage", "email", "username", /*추가*/"password", "darkMode"] });
    if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    res.json({ user }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 계정 정보 수정 ok
router.post("/account", isLoggedIn, upload.single("profileImage")/*추가*/, async (req, res) => {
  const { /*변경*/email, username, password, darkMode } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    const profileImage = req.file ? req.file.path : user.profileImage; // 프로필 사진 업로드되면 새 파일 경로를 사용 or 기존의 프로필 이미지 경로 사용

    await user.update({ profileImage, email, username, password, darkMode });
    res.json({ message: "계정 정보 수정 완료", user }); 
  } catch (err) { 
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 계정 탈퇴 ok
router.delete("/account/delete", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

    await user.destroy();
    res.json({ message: "계정 탈퇴 완료", user });
  } catch (err) {
    console.error("계정 탈퇴 중 오류 발생", err);
    res.status(500).json({ message: "계정 탈퇴 중 오류 발생" });
  }
});

// 로그아웃 
router.post("/logout", (req, res) => {
    res.json({ message: "로그아웃 완료" });
});

module.exports = router;