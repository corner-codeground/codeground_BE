const { Sequelize, DataTypes } = require("sequelize");

class Board extends Sequelize.Model {
  static initiate(sequelize) {
    Board.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "boards",
        timestamps: false,
        modelName: "Board", // 👈 추가
      }
    );
  }
}

module.exports = Board;
