//수정 완료
//3차 수정 

const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config, {
    logging: console.log
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ✅ 모델을 직접 가져와서 초기화하는 방식으로 변경
const User = require("./user");
const Post = require("./post");
const Follow = require("./follow");
const Hashtag = require("./hashtag");

// ✅ 모델 초기화 (`initiate()` 메서드 호출)
User.initiate(sequelize);
Post.initiate(sequelize);
Follow.initiate(sequelize);
Hashtag.initiate(sequelize);

// ✅ 모델 간의 관계 설정 (`associate()` 호출)
db.User = User;
db.Post = Post;
db.Follow = Follow;
db.Hashtag = Hashtag;

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// ✅ 데이터베이스 연결 확인
sequelize.authenticate()
    .then(() => console.log("✅ 데이터베이스 연결 성공"))
    .catch(err => console.error("❌ 데이터베이스 연결 실패:", err));

console.log("📌 [DEBUG] 로드된 모델 목록:", Object.keys(db));

module.exports = db;
