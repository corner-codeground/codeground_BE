const Sequelize = require('sequelize');

class Follow extends Sequelize.Model {
  static initiate(sequelize) {
    Follow.init({
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.User, // Sequelize 모델 직접 참조
          key: 'id',
        },
      },
      following_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: sequelize.models.User, // Sequelize 모델 직접 참조
          key: 'id',
        },
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Follow',
      tableName: 'follow',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // Follow 모델과 User 모델 관계 정의
    Follow.belongsTo(db.User, {
      foreignKey: 'following_id',
      targetKey: 'id',
      as: 'FollowingUser', // 팔로우하는 사람
    });

    Follow.belongsTo(db.User, {
      foreignKey: 'follower_id',
      targetKey: 'id',
      as: 'FollowerUser', // 팔로우 당하는 사람
    });
  }
}

module.exports = Follow;