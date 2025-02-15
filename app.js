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
const runCodeRouter = require('./routes/route_runCode')

dotenv.config();
const app = express();

// ✅ 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));

// ✅ 템플릿 엔진 설정 (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ CORS 설정 추가
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // 프론트엔드 실행 주소 (Live Server)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors()); // ✅ Preflight Request 처리 (OPTIONS 요청 허용)

// ✅ 미들웨어 설정
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

// ✅ JWT 인증 미들웨어
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

// ✅ 라우터 설정
app.use("/auth", authRouter);
app.use("/comment", commentRouter);
app.use("/likes", likeRouter);
app.use("/scraps", scrapRouter);
app.use("/follow", followRouter);
app.use("/posts", postRouter);
app.use("/runCodes", runCodeRouter);

// ✅ 홈 화면
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// ✅ MySQL 연결 후 서버 실행
sequelize
  .sync()
  .then(() => {
    console.log("✅ 데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error("❌ 데이터베이스 연결 오류", err);
  });

// ✅ 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중입니다.`);
});


// const express = require('express');
// <<<<<<< HEAD
// const passport = require('./config/passport');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { sequelize } = require('./models'); // Sequelize 인스턴스 불러오기

// const authRouter = require('./routes/auth');
// const commentRouter = require("./routes/route_comment");
// const likeRouter = require("./routes/route_like");
// const scrapRouter = require('./routes/route_scrap');
// const followRouter = require('./routes/route_follow');

// dotenv.config(); // 추가
// const app = express();

// app.use(express.static(path.join(__dirname, 'public')));

// // 템플릿 엔진 -> 실행 확인용
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // ✅ CORS 설정 추가
// app.use(cors({
//   origin: "http://127.0.0.1:5500", // 프론트엔드 실행 주소 (Live Server)
//   credentials: true, // 쿠키 및 인증 포함 허용
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용할 HTTP 메서드
//   allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
// }));


// // ✅ Preflight Request 처리 (OPTIONS 요청 허용)
// app.options("*", cors());

// app.use(express.json());
// // express 미들웨어 설정
// app.use(express.urlencoded({ extended: true }));  // POST 요청에서 데이터를 파싱할 수 있게 설정
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// // 라우터
// app.use('/auth', authRouter);
// app.use('/comment', commentRouter);
// app.use('/likes', likeRouter);
// app.use('/scraps', scrapRouter);
// app.use('/follow', followRouter);


// // 홈 화면
// app.get('/', (req, res) => {
//   res.render('home', { user: req.user });
// });

// // mysql 연결 후 서버 실행
// sequelize.sync()
//   .then(() => {
//     console.log('데이터베이스 연결 성공');
//   })
//   .catch (err => {
//     console.error("데이터베이스 연결 오류", err);
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
// =======
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const dotenv = require('dotenv');
// const authRouter = require('./routes/auth');
// const cors = require("cors");
// const { sequelize } = require("./models");
// const postRouter = require("./routes/postRoutes");

// dotenv.config();
// const app = express();

// // CORS 설정 추가
// app.use(cors({
//     origin: "http://127.0.0.1:5500",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

// // Preflight Request 처리
// app.options("*", cors());

// app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static("uploads"));

// // 템플릿 엔진 설정 (EJS)
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // 미들웨어 설정
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser(process.env.COOKIE_SECRET));

// // JWT 인증 미들웨어
// const authenticateJWT = (req, res, next) => {
//     const token = req.headers["authorization"]?.split(" ")[1];

//     console.log("📌 [DEBUG] Received token:", token);

//     if (!token) {
//         return res.status(401).json({ message: "인증이 필요합니다." });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
//         }
//         req.user = user;
//         next();
//     });
// };

// // 라우터 연결
// app.use("/auth", authRouter);
// app.use("/posts", postRouter);

// // 홈 화면
// app.get("/", (req, res) => {
//     res.render("home", { user: req.user });
// });

// // DB 연결 후 확인
// sequelize.sync()
//     .then(() => console.log("✅ 데이터베이스 연결 성공"))
//     .catch(err => console.error("❌ 데이터베이스 연결 오류", err));

// module.exports = app; // `server.js`에서 사용하기 위해 `app` 내보내기

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
// });