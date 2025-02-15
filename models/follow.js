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


// <<<<<<< HEAD
// const Sequelize = require('sequelize');
// const bcrypt = require('bcryptjs');
// const User = require('./user.js');
// =======
// //해원이 코드 추가
// //2차수정필요-완료

// /*
// [models/follow.js : foreignKey 설정 오류 가능성]
// 1. 문제 원인
// 현재 models/follow.js에서 follower_id와 following_id가 User 모델을 참조하는데,
// model: 'User'로 되어 있어서 Sequelize에서 올바르게 관계를 설정하지 못할 가능성이 있음.
// 또한, associate()에서 db.User를 직접 참조하지 않고 있어 의도한 관계가 제대로 적용되지 않을 수도 있음.

// 2. 수정 방법
// model: 'User' → model: db.User로 변경
// associate()에서 db.User를 직접 참조하도록 수정
// */

// const Sequelize = require('sequelize');
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66

// class Follow extends Sequelize.Model {
//   static initiate(sequelize) {
//     Follow.init({
//       follower_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
// <<<<<<< HEAD
//             model: 'User', // 'User' 테이블 참조
// =======
//             model: sequelize.models.User, // 'User' 대신 Sequelize 모델 직접 참조
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//             key: 'id'
//           },  
//     },
//       following_id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         references: {
// <<<<<<< HEAD
//             model: 'User', // 'User' 테이블 참조
// =======
//             model: sequelize.models.User, // 'User' 대신 Sequelize 모델 직접 참조
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//             key: 'id'
//           },
//       },
//     }, {
//       sequelize,
//       timestamps: true,
//       underscored: false,
//       modelName: 'Follow',
//       tableName: 'follow',
//       paranoid: true,
//       charset: 'utf8',
//       collate: 'utf8_general_ci',
//     });
// }
//   static associate(db) {
//     // Follow 모델과 User 모델 관계 정의
//     Follow.belongsTo(db.User, {
//       foreignKey: 'following_id',
//       targetKey: 'id',
// <<<<<<< HEAD
//       as: 'FollowingUser', // 팔로우하는 사람 -> 관계 이름 다르게 설정해야 됨
// =======
//       as: 'FollowingUser', 
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//     });
//     Follow.belongsTo(db.User, {
//       foreignKey: 'follower_id',
//       targetKey: 'id',
// <<<<<<< HEAD
//       as: 'FollowerUser', // 팔로우 당하는 사람
//     });
//     }
// }

// module.exports = Follow;
// =======
//       as: 'FollowerUser',
//     });
//   }
// }

// module.exports = Follow;
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
