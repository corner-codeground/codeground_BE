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
        type: Sequelize.STRING, // 이미지 URL 저장
        allowNull: true, 
        defaultValue: 'defaultprofileImage.png',
      },
      bio: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: '한 줄 소개가 없습니다.',
      },
      darkmode: { // 다크모드 추가
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'user',
      paranoid: true, // soft delete 지원 (deleted_at 사용)
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // User 모델 간의 팔로우 관계 설정
    User.belongsToMany(User, {
      through: 'Follow',
      foreignKey: 'follower_id',
      otherKey: 'following_id',
      as: 'Followings', // 사용자가 팔로우하는 사람들
    });

    User.belongsToMany(User, {
      through: 'Follow',
      foreignKey: 'following_id',
      otherKey: 'follower_id',
      as: 'Followers', // 사용자를 팔로우하는 사람들
    });
  }

  // 비밀번호 확인
  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = User;