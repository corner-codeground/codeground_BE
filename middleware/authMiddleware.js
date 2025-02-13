const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next();
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(403).json({ message: "이미 로그인된 상태입니다." });
    } catch (err) {
        next();
    }
};
