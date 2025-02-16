const Sequelize = require("sequelize");

class Follow extends Sequelize.Model {
  static initiate(sequelize) {
    Follow.init(
      {
        follower_id: {
          type: Sequelize.INTEGER,
          allowNull: false, // 필요하면 true로 변경 가능
          references: {
            model: "Users", // 테이블명을 문자열로 지정 (sequelize.models.User 대신)
            key: "id",
          },
          onDelete: "CASCADE", // "SET NULL" 대신 "CASCADE" 적용
          onUpdate: "CASCADE",
        },
        following_id: {
          type: Sequelize.INTEGER,
          allowNull: false, // 필요하면 true로 변경 가능
          references: {
            model: "Users", // 테이블명을 문자열로 지정
            key: "id",
          },
          onDelete: "CASCADE", // "SET NULL" 대신 "CASCADE" 적용
          onUpdate: "CASCADE",
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Follow",
        tableName: "Follows", // 테이블명 대소문자 일관성 유지
        paranoid: false, // `paranoid: true`가 필요 없다면 false로 설정
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    Follow.belongsTo(db.User, {
      foreignKey: "following_id",
      targetKey: "id",
      as: "FollowingUser",
    });

    Follow.belongsTo(db.User, {
      foreignKey: "follower_id",
      targetKey: "id",
      as: "FollowerUser",
    });
  }
}

module.exports = Follow;
