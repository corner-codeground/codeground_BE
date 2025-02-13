const express = require('express');
const passport = require('./config/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors'); //cors추가

const { sequelize } = require('./models'); // Sequelize 인스턴스 불러오기

const authRouter = require('./routes/auth');
const postRouter = require("./routes/postRoutes"); 

dotenv.config(); // 추가
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// 템플릿 엔진 -> 실행 확인용
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ✅ CORS 설정 추가
app.use(cors({
  origin: "http://127.0.0.1:5500", // 프론트엔드 실행 주소 (Live Server)
  credentials: true, // 쿠키 및 인증 포함 허용
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용할 HTTP 메서드
  allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더
}));


// ✅ Preflight Request 처리 (OPTIONS 요청 허용)
app.options("*", cors());

app.use(express.json());

// express 미들웨어 설정
app.use(express.urlencoded({ extended: true }));  // POST 요청에서 데이터를 파싱할 수 있게 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,//||"fallback_secret",
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(passport.initialize());
app.use(passport.session());

//라우터
app.use('/auth', authRouter);
app.use("/posts", postRouter);

// 홈 화면
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// mysql 연결 후 서버 실행
sequelize.sync()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch (err => {
    console.error("데이터베이스 연결 오류", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});