const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Follow = require("../models/follow");
const { isLoggedIn, isNotLoggedIn } = require('../middleware/authMiddleware'); // auth 미들웨어 분리 추가

const router = express.Router();

// 로그인 페이지
router.get("/login", isNotLoggedIn/*추가*/, (req, res) => {
  res.render("login");
});
// 로그인 처리
router.post("/login", isNotLoggedIn/*추가*/, passport.authenticate("local", {
  successRedirect: "/auth/profile", 
  failureRedirect: "/auth/login", // 오류 띄워줘야 할 듯
}), (req, res) => {
  console.log(req.user); /////////
}
);

// 회원가입 페이지
router.get("/join", isNotLoggedIn/*추가*/, (req, res) => {
  res.render("join");
});
// 회원가입 처리
router.post("/join", isNotLoggedIn/*추가*/, async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).send('비밀번호가 일치하지 않습니다.'); // 비밀번호 일치 확인 추가

  try {
    //추가
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('이미 등록된 이메일입니다.');
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    res.redirect("/auth/login");
  } catch(err) {
    console.error('회원가입 실패:', err);
    res.status(500).send('회원가입 실패');
  }
});

// 프로필 페이지 (마이 페이지)
router.get('/profile', isLoggedIn/*추가*/, async (req, res) => {
  console.log(req.user); 
  if (!req.user) {
    return res.redirect('/auth/login'); // 로그인 안 된 경우
  }
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["username", "bio", "profileImage"],
    });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });    
    }
    // 팔로잉, 팔로워 수 조회 추가
    const followersCount = await Follow.count({
      where: { following_id: req.user.id },
    });
    const followingsCount = await Follow.count({
      where: { follower_id: req.user.id },
    });

    res.render('profile', { user, followersCount, followingsCount }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오류" });
  }
  });

// 프로필 수정 페이지
router.get('/profile/edit', isLoggedIn/*추가*/, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["username", "bio", "profileImage"], 
    });
    
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.render('editProfile', { user }); // 프로필 수정 페이지로 전달할 사용자 정보
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// 프로필 페이지에 프로필 수정
router.post("/profile/edit", isLoggedIn/*추가*/, async (req, res) => {
  const { bio, profileImage } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    // 정보 수정
    const updateData = {};
    if (bio) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;
    await user.update(updateData);
    res.redirect('/auth/profile');
  } catch (err) {
    res.status(500).json({ message: "오류" });
  }
});

// 계정 관리 페이지
router.get('/account', isLoggedIn/*추가*/, async (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login'); // 로그인 안 된 경우
  }
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["email", "username"],
    });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });    
    }
    res.render('account', { user }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오류" });
  }
})


// 계정 관리 (수정)
router.post('/account', isLoggedIn/*추가*/, async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 정보 업데이트
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    await user.update(updateData);
    res.redirect('/auth/account');  // 수정 후 다시 리다이렉트
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "수정 중 오류 발생" });
  }
})

// 계정 탈퇴 처리
router.delete("/account/delete", isLoggedIn/*추가*/, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    await user.destroy();
    res.redirect("/");

  } catch (err) {
    console.error("계정 삭제 중 오류 발생", err);
    res.status(500).json({ message: "계정 삭제 중 오류 발생" });
  }
});

// 로그아웃 처리
router.get('/logout', isLoggedIn/*추가*/, (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');  // 로그아웃 후 홈 화면으로 리다이렉트
  });
});

module.exports = router;
