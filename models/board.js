const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Board = sequelize.define(
  "Board",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100), // 게시판 이름
      allowNull: false,
    },
  },
  {
    tableName: "boards",
    timestamps: false,
  }
);

module.exports = Board;
