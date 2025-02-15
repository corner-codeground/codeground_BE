const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const Sequelize = require('sequelize'); // Sequelize 클래스 가져오기
const config = require("../config/config")[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const basename = path.basename(__filename);
fs
  .readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회합니다.
  .filter(file => { // 숨김 파일, index.js, js 확장자가 아닌 파일을 필터링합니다.
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })

  .forEach(file => { // 해당 파일의 모델을 불러와서 init을 호출합니다.
    const model = require(path.join(__dirname, file));
    if (model.initiate) { 
      model.initiate(sequelize)
    }
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => { // associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
console.log("📌 [DEBUG] 로드된 모델 목록:", Object.keys(db));
module.exports = db;

