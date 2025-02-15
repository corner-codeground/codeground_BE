const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); 

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' }, 
  async (email, password, done) => {
    try {
      const user = await User.findOne({ 
        where: { 
          email,
          deletedAt: null,  // 삭제되지 않은 계정만 검색
        },
      });
      if (!user) {
        console.error('User not found');
        return done(null, false, { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
      }
      const isMatch = await user.validPassword(password);
      if (!isMatch) {
        return done(null, false, { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
      }
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }
));

// 세션에 저장
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);  
    done(null, user);  
  } catch (err) {
    done(err);  
  }
});

module.exports = passport;


// <<<<<<< HEAD
// =======
// //해원이 코드로 변경경

// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user'); 

// passport.use(new LocalStrategy(
//   { usernameField: 'email', passwordField: 'password' }, 
//   async (email, password, done) => {
//     try {
//       const user = await User.findOne({ 
//         where: { 
//           email,
//           deletedAt: null,  // 삭제되지 않은 계정만 검색
//         },
//       });
//       if (!user) {
//         console.error('User not found');
//         return done(null, false, { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
//       }
//       const isMatch = await user.validPassword(password);
//       if (!isMatch) {
//         return done(null, false, { message: '이메일 또는 비밀번호가 잘못되었습니다.' });
//       }
//       return done(null, user);
//     } catch (err) {
//       console.error(err);
//       return done(err);
//     }
//   }
// ));

// // 세션에 저장
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findByPk(id);  
//     done(null, user);  
//   } catch (err) {
//     done(err);  
//   }
// });

// <<<<<<< HEAD
// module.exports = passport;
// =======
// module.exports = passport;
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
