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
          type: DataTypes.STRING, // 해시태그를 문자열로 저장 (예: "#example, #nodejs")
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "해시태그는 필수입니다.",
            },
          },
        },
      },
      {
        sequelize, // 모델에 sequelize 인스턴스를 연결
        tableName: "communities", // MySQL에서 사용할 테이블명
        timestamps: true, // createdAt, updatedAt 자동 추가
      }
    );
  }
}

module.exports = Community;
