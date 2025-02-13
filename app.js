const express = require('express');
const passport = require('./config/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const { sequelize } = require('./models');

const authRouter = require('./routes/auth');
const postRouter = require("./routes/postRoutes");

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ CORS 설정 추가
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Preflight Request 처리
app.options("*", cors());

app.use(express.json());

// 미들웨어 설정
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

// 라우터 연결
app.use('/auth', authRouter);
app.use("/posts", postRouter);

// 홈 화면
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// DB 연결 후 서버 실행
sequelize.sync()
  .then(() => console.log('데이터베이스 연결 성공'))
  .catch(err => console.error("데이터베이스 연결 오류", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`));
