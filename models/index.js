const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

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
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (model.initiate) { 
      model.initiate(sequelize);
      db[model.name] = model;
      console.log(`로드된 모델: ${model.name}`); // 모델 로드 확인
    }
  });

// 연관 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log(`모델 목록:`, Object.keys(db)); // 로드된 모델 확인

module.exports = db;
