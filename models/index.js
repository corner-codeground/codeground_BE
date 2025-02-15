const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';

const Sequelize = require('sequelize'); // Sequelize 클래스 가져오기
const { sequelize } = require("../config/config"); // 환경에 맞는 sequelize 인스턴스 가져오기

const db = {};
db.sequelize = sequelize; // 이미 sequelize 인스턴스가 있기 때문에 재선언할 필요 없습니다.

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
console.log(Object.keys(db)); 
module.exports = db;