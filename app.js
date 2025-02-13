/* 토큰 사용 */
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');

dotenv.config();
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// 템플릿 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// // JWT 인증 미들웨어
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

//   console.log('Received token:', token);  // 토큰을 확인하기 위한 로그

//   if (!token) {
//     return res.status(401).json({ message: '인증이 필요합니다.' });
//   }

//   jwt.verify(token, 'your-secret-key', (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: '토큰이 유효하지 않습니다.' });
//     }

//     req.user = user;
//     next();
//   });
// };

// module.exports = { authenticateJWT }; ///


// 인증 관련 라우터
app.use('/auth', authRouter);

// 홈 화면
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

// 데이터베이스 연결 및 서버 실행
sequelize.sync()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch(err => {
    console.error('데이터베이스 연결 오류', err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});









/* 세션으로 관리 */
// const express = require('express');
// // const passport = require('./config/passport');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const jwt = require("jsonwebtoken");  // JWT 추가

// const path = require('path');
// const dotenv = require('dotenv');
// const authRouter = require('./routes/auth');
// const { sequelize } = require('./models'); // Sequelize 인스턴스 불러오기

// dotenv.config(); // 추가
// const app = express();

// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));

// // 템플릿 엔진 -> 실행 확인용
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

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

// // 인증 관련 라우터
// app.use('/auth', authRouter);

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
// })