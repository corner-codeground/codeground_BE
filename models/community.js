const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Community = sequelize.define(
  "Community",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    hashtags: {
      type: DataTypes.STRING, // 해시태그를 문자열로 저장 (예: "#example, #nodejs")
      allowNull: false,
      validate: {
        // 해시태그가 비어있지 않도록 validation 추가
        notEmpty: {
          msg: "해시태그는 필수입니다.",
        },
      },
    },
  },
  {
    tableName: "communities", // MySQL에서 사용할 테이블명
    timestamps: true, // createdAt, updatedAt 자동 추가
  }
);

module.exports = Community;
