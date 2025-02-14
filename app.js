//수정완료료

const express = require("express");
const passport = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const { sequelize } = require("./models");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/postRoutes");

dotenv.config();
const app = express();

// CORS 설정 추가
app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Preflight Request 처리
app.options("*", cors());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// 템플릿 엔진 설정 (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: { httpOnly: true, secure: false },
}));

app.use(passport.initialize());
app.use(passport.session());

// JWT 인증 미들웨어
const authenticateJWT = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    console.log("📌 [DEBUG] Received token:", token);

    if (!token) {
        return res.status(401).json({ message: "인증이 필요합니다." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
        }
        req.user = user;
        next();
    });
};

// 라우터 연결
app.use("/auth", authRouter);
app.use("/posts", postRouter);

// 홈 화면
app.get("/", (req, res) => {
    res.render("home", { user: req.user });
});

// DB 연결 후 확인
sequelize.sync()
    .then(() => console.log("✅ 데이터베이스 연결 성공"))
    .catch(err => console.error("❌ 데이터베이스 연결 오류", err));

module.exports = app; // `server.js`에서 사용하기 위해 `app` 내보내기
