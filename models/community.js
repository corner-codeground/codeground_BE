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
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        boardId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Board, // Board 테이블과 연결
            key: "id",
          },
          onDelete: "CASCADE", // 게시판 삭제 시 해당 게시글도 삭제
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
        community
        sequelize,
        tableName: "communities",
        timestamps: true,

      }
    );
  }
}
// Board와 Community 모델 연결 (1:N 관계)
Board.hasMany(Community, { foreignKey: "boardId" });
Community.belongsTo(Board, { foreignKey: "boardId" });

module.exports = Community;
