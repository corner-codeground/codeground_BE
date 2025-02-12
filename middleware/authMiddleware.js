// 미들웨어 분리
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(403).send("로그인이 필요합니다.");
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    const message = encodeURIComponent("이미 로그인된 상태입니다.");
    res.redirect(`/?error=${message}`);
  };
  