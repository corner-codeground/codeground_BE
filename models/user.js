const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      username: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      profileImage: {
        type: Sequelize.STRING, // 이미지 url 저장
        allowNull: true, 
        defaultValue: 'defaultprofileImage.png',
      },
      bio: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: '한 줄 소개가 없습니다.',
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'user',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  // static associate(db) {
  //   db.User.hasMany(db.Post);
  //   db.User.belongsToMany(db.User, {
  //     foreignKey: 'followingId',
  //     as: 'Followers',
  //     through: 'Follow',
  //   });
  //   db.User.belongsToMany(db.User, {
  //     foreignKey: 'followerId',
  //     as: 'Followings',
  //     through: 'Follow',
  //   });
  // }
};

// 비밀번호 확인
User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = User;