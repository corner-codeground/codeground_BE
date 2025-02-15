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

// ✅ 모델 불러오기
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (model.initiate) { 
      model.initiate(sequelize);
      db[model.name] = model;
      console.log(`🔗 Loaded Model: ${model.name}`); // ✅ 모델 로드 확인
    }
  });

// ✅ 연관 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log(`📌 모델 목록:`, Object.keys(db)); // ✅ 로드된 모델 확인

module.exports = db;


// <<<<<<< HEAD
// const Sequelize = require('sequelize');
// const fs = require('fs');
// const path = require('path');
// const env = process.env.NODE_ENV || 'development';
// const config = require('../config/config')[env];

// const db = {};
// const sequelize = new Sequelize(
//   config.database, config.username, config.password, config, {
//     logging: console.log 
//   }
// );

// db.sequelize = sequelize;

// // ✅ 모델 불러오기
// const basename = path.basename(__filename);
// fs.readdirSync(__dirname)
//   .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
//   .forEach(file => {
//     const model = require(path.join(__dirname, file));
//     model.initiate(sequelize);
//     db[model.name] = model;
    
//     console.log(`🔗 Loaded Model: ${model.name}`); // ✅ 모델 로드 확인
//   });

// // ✅ 연관 관계 설정
// Object.keys(db).forEach(modelName => {
// =======
// const fs = require('fs');
// const path = require('path');
// const env = process.env.NODE_ENV || 'development';
// const Sequelize = require('sequelize'); // Sequelize 클래스 가져오기
// const config = require("../config/config")[env];

// const db = {};

// const sequelize = new Sequelize(config.database, config.username, config.password, {
//   host: config.host,
//   dialect: config.dialect,
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// const basename = path.basename(__filename);
// fs
//   .readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회합니다.
//   .filter(file => { // 숨김 파일, index.js, js 확장자가 아닌 파일을 필터링합니다.
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })

//   .forEach(file => { // 해당 파일의 모델을 불러와서 init을 호출합니다.
//     const model = require(path.join(__dirname, file));
//     if (model.initiate) { 
//       model.initiate(sequelize)
//     }
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => { // associate 호출
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
// <<<<<<< HEAD

// console.log(`📌 모델 목록:`, Object.keys(db)); // ✅ 로드된 모델 확인

// module.exports = db;
// =======
// console.log("📌 [DEBUG] 로드된 모델 목록:", Object.keys(db));
// module.exports = db;

// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
