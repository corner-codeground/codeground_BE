const Sequelize = require("sequelize");

class Scrap extends Sequelize.Model {
  static initiate(sequelize) {
    Scrap.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        post_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 자동 생성
        modelName: "Scrap",
        tableName: "scraps", // 테이블명은 복수형
        paranoid: true, // 소프트 삭제 (스크랩 취소 가능)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    if (db.User) {
      db.Scrap.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id', onDelete: "CASCADE" });
    } else {
      console.error('Scrap.associate: db.User가 정의되지 않았습니다.');
    }
  
    if (db.Post) {  // Post 모델이 존재할 때만 연관 관계 추가
      db.Scrap.belongsTo(db.Post, { foreignKey: 'post_id', targetKey: 'id', onDelete: "CASCADE" });
    } else {
      console.warn('Scrap.associate: db.Post가 아직 정의되지 않았음 (임시로 연관 관계 제외)');
    }
  }
}  

module.exports = Scrap;
