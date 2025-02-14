//수정완료 
//2차수정-완료
 
const app = require("./app"); // app.js 불러오기
const dotenv = require("dotenv");

dotenv.config(); // 환경 변수 로드

let PORT = process.env.PORT || 5000;

// 서버 실행 함수 (포트 충돌 시 자동 변경)
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✅ Server running on http://127.0.0.1:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️ 포트 ${port}가 사용 중입니다. 다른 포트로 변경합니다.`);
      server.close(() => {
        PORT += 1; // 포트 번호 증가
        startServer(PORT); // 새로운 포트에서 다시 실행
      });
    } else {
      console.error("❌ 서버 실행 중 오류 발생:", err);
    }
  });
};

// 서버 실행
startServer(PORT);
