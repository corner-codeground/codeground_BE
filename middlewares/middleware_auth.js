const jwt = require("jsonwebtoken");

exports.isLoggedIn = (req, res, next) => {
  // ✅ SKIP_AUTH 환경 변수가 true면 인증 건너뛰기 (개발 및 테스트용)
  if (process.env.SKIP_AUTH === "true") {
    req.user = { id: 1 }; // 기본 사용자 ID 설정 (테스트용)
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1]; // `Bearer <token>` 형식에서 토큰 추출

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ 로그인한 사용자의 ID를 req.user에 저장
    next();
  } catch (error) {
    return res.status(401).json({ message: "인증이 유효하지 않습니다." });
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(403).json({ message: "이미 로그인된 상태입니다." });
    } catch (error) {
      next();
    }
  } else {
    next();
  }
};


// const jwt = require("jsonwebtoken");

// exports.isLoggedIn = (req, res, next) => {
//   // ✅ SKIP_AUTH 환경 변수가 true면 인증 건너뛰기 (개발 및 테스트용)
// <<<<<<< HEAD
// =======
//   /*
// >>>>>>> feature/like
//   if (process.env.SKIP_AUTH === "true") {
//     req.user = { id: 1 }; // 기본 사용자 ID 설정 (테스트용)
//     return next();
//   }
// <<<<<<< HEAD
// =======
//   */
// >>>>>>> feature/like

//   const token = req.headers.authorization?.split(" ")[1]; // `Bearer <token>` 형식에서 토큰 추출

//   if (!token) {
//     return res.status(401).json({ message: "로그인이 필요합니다." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // ✅ 로그인한 사용자의 ID를 req.user에 저장
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "인증이 유효하지 않습니다." });
//   }
// };

// exports.isNotLoggedIn = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (token) {
//     try {
//       jwt.verify(token, process.env.JWT_SECRET);
//       return res.status(403).json({ message: "이미 로그인된 상태입니다." });
//     } catch (error) {
//       next();
//     }
//   } else {
//     next();
//   }
// };
