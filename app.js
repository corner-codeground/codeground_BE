const express = require("express");
const passport = require("./config/passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { sequelize } = require("./models");

const authRouter = require("./routes/auth");
const commentRouter = require("./routes/route_comment");
const likeRouter = require("./routes/route_like");
const scrapRouter = require("./routes/route_scrap");
const followRouter = require("./routes/route_follow");
const postRouter = require("./routes/postRoutes");
const runCodeRouter = require("./routes/route_runCode");

dotenv.config();
const app = express();

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// 템플릿 엔진 설정 (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// CORS 설정 추가
app.use(
  cors({
    origin: "http://localhost:3000/", // 프론트엔드 실행 주소 (Live Server)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors()); // Preflight Request 처리 (OPTIONS 요청 허용)

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// JWT 인증 미들웨어
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log("[DEBUG] Received token:", token);

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

// 라우터 설정
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/likes", likeRouter);
app.use("/scraps", scrapRouter);
app.use("/follow", followRouter);
app.use("/posts", postRouter);
app.use("/runCodes", runCodeRouter);

// 홈 화면
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// MySQL 연결 후 서버 실행
sequelize
  .sync()
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 오류", err);
  });

app.post("/auth/join", (req, res) => {
  res.send("회원가입 성공");
});

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
