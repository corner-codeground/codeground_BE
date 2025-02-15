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
        type: Sequelize.STRING, // 📌 이미지 URL 저장
        allowNull: true, 
        defaultValue: 'defaultprofileImage.png',
      },
      bio: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: '한 줄 소개가 없습니다.',
      },
      darkmode: { // 📌 다크모드 기능 추가
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
      paranoid: true, // ✅ soft delete 지원 (`deleted_at` 사용)
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // ✅ User 모델 간의 팔로우 관계 설정
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

  // ✅ 비밀번호 확인
  validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = User;


// <<<<<<< HEAD
// =======
// //해원이 코드 추가
 
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
// const Sequelize = require('sequelize');
// const bcrypt = require('bcryptjs');
// const Follow = require('./follow.js');

// class User extends Sequelize.Model {
//   static initiate(sequelize) {
//     User.init({
//       email: {
//         type: Sequelize.STRING(40),
//         allowNull: true,
//         unique: true,
//       },
//       username: {
//         type: Sequelize.STRING(15),
//         allowNull: false,
//       },
//       password: {
//         type: Sequelize.STRING(100),
//         allowNull: true,
//       },
//       profileImage: {
//         type: Sequelize.STRING, // 이미지 url 저장
//         allowNull: true, 
//         defaultValue: 'defaultprofileImage.png',
//       },
//       bio: {
//         type: Sequelize.STRING(100),
//         allowNull: true,
//         defaultValue: '한 줄 소개가 없습니다.',
//       },
// <<<<<<< HEAD
// =======
//       darkmode: { // 추가
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//       }
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//     }, {
//       sequelize,
//       timestamps: true,
//       underscored: false,
//       modelName: 'User',
//       tableName: 'user',
//       paranoid: true,
//       charset: 'utf8',
//       collate: 'utf8_general_ci',
//     });
//   }

//   static associate(db) {
//     // Follow 모델과 User 모델 간의 관계 정의
// <<<<<<< HEAD
//     Follow.belongsTo(db.User, {
//       foreignKey: 'followingId',
//       targetKey: 'id',
//       as: 'Following', // 팔로우하는 사람
//     });

//     Follow.belongsTo(db.User, {
//       foreignKey: 'followerId',
//       targetKey: 'id',
//       as: 'Follower', // 팔로우 당하는 사람
//     });
//   }
//   // static associate(db) {
//   //   db.User.hasMany(db.Post);
//   //   db.User.belongsToMany(db.User, {
//   //     foreignKey: 'followingId',
//   //     as: 'Followers',
//   //     through: 'Follow',
//   //   });
//   //   db.User.belongsToMany(db.User, {
//   //     foreignKey: 'followerId',
//   //     as: 'Followings',
//   //     through: 'Follow',
//   //   });
//   // }
// =======
//     User.belongsToMany(User, {
//       through: 'Follow',
//       foreignKey: 'follower_id',
//       otherKey: 'following_id',
//       as: 'Followings', // 사용자가 팔로우하는 사람들
//     });
    
//     User.belongsToMany(User, {
//       through: 'Follow',
//       foreignKey: 'following_id',
//       otherKey: 'follower_id',
//       as: 'Followers', // 사용자를 팔로우하는 사람들
//     });
    
//   }

// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
// };

// // 비밀번호 확인
// User.prototype.validPassword = function (password) {
//   return bcrypt.compareSync(password, this.password);
// };

// module.exports = User;