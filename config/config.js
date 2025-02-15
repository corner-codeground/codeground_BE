require("dotenv").config(); // .env 파일 불러오기
// const { config } = require("dotenv");
// const { Sequelize } = require('sequelize');

const config = {
  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mysql', // MySQL 사용
  },
  production: {
    database: process.env.DB_NAME || 'production_db',
    username: process.env.DB_USER || 'production_user',
    password: process.env.DB_PASS || 'production_pass',
    host: process.env.DB_HOST || 'production_host',
    dialect: 'mysql', // MySQL 사용
  },
  test: {
    database: process.env.DB_NAME || 'test_db',
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASS || 'test_pass',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // MySQL 사용
  },
};

// models/index.js에서 초기화로 변경
// // Sequelize 인스턴스를 초기화 (이제는 config에서 호출)
// const config = require('./config');
// const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
//   host: config.development.host,
//   dialect: config.development.dialect,
// });

module.exports = config;
// module.exports = { sequelize, config };
