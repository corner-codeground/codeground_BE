const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return next(); // 로그인되지 않은 상태라면 다음 미들웨어 실행
    }

    return res.status(403).json({ message: "이미 로그인된 상태입니다." });
};
