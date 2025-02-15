const jwt = require("jsonwebtoken");

// JWT 인증 미들웨어 (로그인 필요)
exports.isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    // ✅ 토큰이 없거나, "undefined"일 경우 예외 처리
    if (!token || token === "undefined") {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // decoded에서 id 추출하여 req.user에 저장
        next();
    } catch (error) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

// JWT 미들웨어 (로그인하지 않은 상태에서만 접근 가능)
exports.isNotLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    // ✅ 토큰이 없거나, "undefined"일 경우 예외 처리
    if (!token || token === "undefined") {
        return next(); // 로그인되지 않은 상태라면 다음 미들웨어 실행
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(403).json({ message: "이미 로그인된 상태입니다." });
    } catch (error) {
        next(); // 토큰이 유효하지 않다면 로그인되지 않은 상태로 간주
    }
};

// Passport 기반 로그인 확인 (JWT와 혼합 사용 가능)
exports.passportIsLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({ message: "로그인이 필요합니다." });
};

// Passport 기반 비로그인 확인 (로그인된 사용자는 접근 불가)
exports.passportIsNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(403).json({ message: "이미 로그인된 상태입니다." });
};
