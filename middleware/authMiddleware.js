//수정 완료
//2차 수정 필요-완료 

/*
middleware/authMiddleware.js : JWT 미들웨어 개선
1. 문제 원인
현재 isLoggedIn() 미들웨어에서 token이 없으면 바로 401을 반환하는데,
클라이언트가 Bearer undefined를 보낼 경우 예외가 발생할 가능성이 있음.
즉, token 값이 "undefined", null, 또는 잘못된 형식일 경우 서버가 비정상적으로 동작할 수도 있어.

2. 수정 방법
token 값이 "undefined" 또는 null일 경우도 체크하여 안전하게 예외 처리
try-catch를 사용해 JWT 검증 과정에서 발생할 수 있는 오류를 방지
*/
const jwt = require("jsonwebtoken");

//JWT 인증 미들웨어 (로그인 필요)
exports.isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    // ✅ 토큰이 없거나, "undefined"일 경우 예외 처리
    if (!token || token === "undefined") {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

//JWT 미들웨어 (로그인하지 않은 상태에서만 접근 가능)
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

//Passport 기반 로그인 확인 (JWT와 혼합 사용 가능)
exports.passportIsLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({ message: "로그인이 필요합니다." });
};

//Passport 기반 비로그인 확인 (로그인된 사용자는 접근 불가)
exports.passportIsNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    return res.status(403).json({ message: "이미 로그인된 상태입니다." });
};
