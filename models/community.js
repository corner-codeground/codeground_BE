const { Sequelize, DataTypes } = require("sequelize");
// const { sequelize } = require("../config/config"); // {} 추가

class Community extends Sequelize.Model {
  // static init을 통해 모델을 초기화하는 방법
  static initiate(sequelize) {
    Community.init(
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
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "해시태그는 필수입니다.",
            },
          },
        },
        category: {
          // 추가된 필드
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "communities",
        timestamps: true,
      }
    );
  }
}

module.exports = Community;
