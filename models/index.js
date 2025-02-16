const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 모델 불러오기
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file));

    // 클래스 기반 모델이면 initiate() 실행
    if (model.prototype instanceof Sequelize.Model) {
      model.initiate(sequelize);
      db[model.name] = model;
    }
    // 기존 함수형 모델이면 실행 후 저장
    else if (typeof model === "function") {
      const initializedModel = model(sequelize, Sequelize.DataTypes);
      db[initializedModel.name] = initializedModel;
    }

    console.log(`로드된 모델: ${file}`);
  });

// 연관 관계 설정
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log(`모델 목록:`, Object.keys(db)); // 로드된 모델 확인

module.exports = db;
