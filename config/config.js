const { Sequelize } = require("sequelize");
require("dotenv").config(); // .env 파일 불러오기

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql", // MySQL 사용
  logging: console.log, // 실행된 SQL 쿼리를 로그로 출력
});

module.exports = sequelize;
