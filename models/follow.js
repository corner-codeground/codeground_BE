const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('./user.js');

class Follow extends Sequelize.Model {
  static initiate(sequelize) {
    Follow.init({
      follower_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // 'User' 테이블 참조
            key: 'id'
          },  
    },
      following_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'User', // 'User' 테이블 참조
            key: 'id'
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
      as: 'FollowingUser', 
    });
    Follow.belongsTo(db.User, {
      foreignKey: 'follower_id',
      targetKey: 'id',
      as: 'FollowerUser',
    });
    }
}

module.exports = Follow;