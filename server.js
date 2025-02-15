const app = require("./app");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();

const DEFAULT_PORT = process.env.PORT || 5000;

const startServer = (port) => {
  const server = app.listen(port, async () => {
    console.log(`Server running on http://127.0.0.1:${port}`);

    try {
      await sequelize.authenticate();
      console.log("DB 연결 성공!");
      await sequelize.sync({ alter: true });
      console.log("데이터베이스 동기화 완료!");
    } catch (err) {
      console.error("DB 작업 중 오류 발생:", err);
    }
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`포트 ${port}가 사용 중입니다. 다른 포트(${port + 1})로 변경합니다.`);
      startServer(port + 1); // 포트 번호 증가 후 다시 실행
    } else {
      console.error("서버 실행 중 오류 발생:", err);
    }
  });
};

startServer(DEFAULT_PORT);

