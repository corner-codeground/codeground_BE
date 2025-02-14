const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 이메일 및 비밀번호 검증 함수 추가
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isValidPassword = (password) => password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password);

// ✅ 회원가입 (POST /auth/join)
router.post("/join", isNotLoggedIn, async (req, res) => {
    let { username, email, password } = req.body;

    // 🔹 입력 값 검증
    if (!username || !email || !password) {
        return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "올바른 이메일 형식이 아닙니다." });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ message: "비밀번호는 최소 6자 이상이며, 숫자 및 특수문자를 포함해야 합니다." });
    }

    try {
        email = email.toLowerCase(); // 🔹 이메일을 소문자로 변환하여 중복 방지

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "이미 등록된 이메일입니다." });
        }

        // 🔹 비밀번호 해싱 및 사용자 저장 (bcrypt 강도 12로 증가)
        const hash = await bcrypt.hash(password, 12);
        const newUser = await User.create({ username, email, password: hash });

        res.status(201).json({ message: "회원가입 성공", user: { id: newUser.id, username, email } });
    } catch (err) {
        console.error("회원가입 실패:", err);
        res.status(500).json({ message: "회원가입 실패", error: err.toString() });
    }
});

// ✅ 로그인 (POST /auth/login)
router.post("/login", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message || "로그인 실패" });

        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);

            // 🔹 JWT 토큰 생성
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // 🔹 httpOnly 쿠키로 토큰 저장 (선택 사항)
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict"
            });

            return res.json({ message: "로그인 성공", token, user: { id: user.id, username: user.username, email: user.email } });
        });
    })(req, res, next);
});

// ✅ 로그아웃 (POST /auth/logout)
router.post("/logout", isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: "로그아웃 실패", error: err.toString() });

        // 🔹 JWT 쿠키 삭제
        res.clearCookie("token");
        res.json({ message: "로그아웃 성공" });
    });
});

module.exports = router;
