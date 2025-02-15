const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const { User, Follow } = require('../models'); // 
const { isLoggedIn, isNotLoggedIn } = require("../middleware/authMiddleware"); 
const { Op } = require("sequelize");
// const User = require("../models/user"); //
// const Follow = require("../models/follow"); //
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// 회원가입 처리 (JWT 기반)
router.post("/join", isNotLoggedIn, async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "이미 등록된 이메일입니다." });
        }
        const hash = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hash });

        res.status(201).json({ message: "회원가입 성공" });
    } catch (err) {
        console.error("❌ 회원가입 실패:", err);
        res.status(500).json({ message: "회원가입 실패" });
    }
});

// 로그인 처리 (JWT 기반)
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
        console.error("❌ 로그인 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 공통 프로필 조회 함수
async function renderProfile(req, res, userId) {
    try {
        const currentUser = await User.findByPk(userId, {
            attributes: ["username", "bio", "profileImage"],
        });

        if (!currentUser) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const followersCount = await Follow.count({ where: { following_id: userId } });
        const followingsCount = await Follow.count({ where: { follower_id: userId } });

        const isOwnProfile = req.user && req.user.id === Number(userId);

        res.json({
            user: currentUser,
            followersCount,
            followingsCount,
            currentUser,
            isOwnProfile,
        });
    } catch (err) {
        console.error("❌ 프로필 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
}

// 팔로잉 목록 조회
router.get("/profile/following", isLoggedIn, async (req, res) => {
    try {
        const following = await Follow.findAll({
            where: { follower_id: req.user.id },
            include: [{ model: User, as: "FollowingUser", attributes: ["username", "profileImage"] }],
        });

        res.json(following.length ? { following } : { message: "팔로우한 사용자가 없습니다." });
    } catch (err) {
        console.error("❌ 팔로잉 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 팔로워 목록 조회
router.get("/profile/follower", isLoggedIn, async (req, res) => {
    try {
        const followers = await Follow.findAll({
            where: { following_id: req.user.id },
            include: [{ model: User, as: "FollowerUser", attributes: ["username", "profileImage"] }],
        });

        res.json({ followers });
    } catch (err) {
        console.error("❌ 팔로워 목록 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 프로필 조회 (자신)
router.get("/profile", isLoggedIn, async (req, res) => {
    await renderProfile(req, res, req.user.id);
});

// 프로필 조회 (다른 사용자)
router.get("/profile/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await renderProfile(req, res, id);
});

// 계정 정보 조회
router.get("/account", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["profileImage", "email", "username", "password", "darkMode"],
        });
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

        res.json({ user });
    } catch (err) {
        console.error("❌ 계정 조회 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 계정 정보 수정
router.post("/account", isLoggedIn, upload.single("profileImage"), async (req, res) => {
    try {
        const { email, username, password, darkMode } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

        const profileImage = req.file ? req.file.path : user.profileImage;

        await user.update({ profileImage, email, username, password, darkMode });
        res.json({ message: "계정 정보 수정 완료", user });
    } catch (err) {
        console.error("❌ 계정 수정 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 계정 탈퇴
router.delete("/account/delete", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });

        await user.destroy();
        res.json({ message: "계정 탈퇴 완료" });
    } catch (err) {
        console.error("❌ 계정 탈퇴 오류:", err);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 로그아웃
router.post("/logout", (req, res) => {
    res.json({ message: "로그아웃 완료" });
});

module.exports = router;
