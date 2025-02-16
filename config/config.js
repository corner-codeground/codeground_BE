require("dotenv").config(); // .env 파일 불러오기

const config = {
  development: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
  production: {
    database: process.env.DB_NAME || "production_db",
    username: process.env.DB_USER || "production_user",
    password: process.env.DB_PASS || "production_pass",
    host: process.env.DB_HOST || "production_host",
    dialect: "mysql",
  },
  test: {
    database: process.env.DB_NAME || "test_db",
    username: process.env.DB_USER || "test_user",
    password: process.env.DB_PASS || "test_pass",
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
};

module.exports = config;
