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
      },
      {
        tableName: "communities",
        timestamps: true,
        paranoid: true,
      }
    );
  }
}
// Board와 Community 모델 연결 (1:N 관계)
Board.hasMany(Community, { foreignKey: "boardId" });
Community.belongsTo(Board, { foreignKey: "boardId" });

module.exports = Community;
