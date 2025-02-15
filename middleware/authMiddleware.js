// 미들웨어 분리

const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰만 추출

  if (!token) {
    return res.status(401).json({ message: '로그인 필요' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // decoded.token에서 id 추출하여 req.user에 저장
    next(); // 인증 성공, 다음 미들웨어로 진행
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰' });
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(403).json({ message: "이미 로그인된 상태입니다." });
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};









// exports.isLoggedIn = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(403).send("로그인이 필요합니다.");
//   };
  
//   exports.isNotLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//       return next();
//     }
//     const message = encodeURIComponent("이미 로그인된 상태입니다.");
//     res.redirect(`/?error=${message}`);
//   };
  