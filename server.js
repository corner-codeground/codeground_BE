const sequelize = require("./config/config");
const Community = require("./models/community");

async function initDB() {
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
}
Community.initiate(sequelize); // 추가
initDB();

