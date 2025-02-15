const app = require("./app"); // app.js 불러오기
const dotenv = require("dotenv");
const { sequelize } = require("./models"); // DB 연결
const Community = require("./models/community"); // 테스트 데이터 삽입용

dotenv.config(); // 환경 변수 로드

let PORT = process.env.PORT || 5000;

// 서버 실행 함수 (포트 충돌 시 자동 변경)
const startServer = (port) => {
  const server = app.listen(port, async () => {
    console.log(`✅ Server running on http://127.0.0.1:${port}`);

    try {
      await sequelize.authenticate();
      console.log("✅ DB 연결 성공!");

      await sequelize.sync({ alter: true }); // 기존 데이터 유지하면서 변경된 부분만 수정
      console.log("✅ 데이터베이스 동기화 완료!");

      // 테스트 데이터 삽입 (이미 존재하는 경우 추가 X)
      const existingPost = await Community.findOne({ where: { title: "테스트 게시글" } });
      if (!existingPost) {
        const testPost = await Community.create({
          title: "테스트 게시글",
          content: "이건 테스트 데이터입니다.",
          viewCount: 0,
          likes: 0,
          hashtags: "#테스트, #nodejs",
        });

        console.log("🔥 삽입된 데이터:", testPost.dataValues);
      }
    } catch (err) {
      console.error("❌ DB 작업 중 오류 발생:", err);
    }
  });

  // 포트 충돌 시 자동 변경
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