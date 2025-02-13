const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/authMiddleware");

const router = express.Router();

// 회원가입
router.post("/join", isNotLoggedIn, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "이미 등록된 이메일입니다." });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    res.status(201).json({ message: "회원가입 성공" });
  } catch (err) {
    console.error("회원가입 실패:", err);
    res.status(500).json({ message: "회원가입 실패" });
  }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({ message: "로그인 성공", token, user });
    });
  })(req, res, next);
});

module.exports = router;
