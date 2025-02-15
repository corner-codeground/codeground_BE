const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        image_url: {
          type: Sequelize.STRING, // 📌 이미지 경로를 저장하는 필드 추가
          allowNull: true,
        },
        is_public: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        timestamps: true, // ✅ created_at, updated_at 자동 추가
        underscored: true, // ✅ createdAt → created_at 스타일 적용
        modelName: "Post",
        tableName: "post",
        paranoid: true, // ✅ soft delete 지원 (deleted_at 사용)
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User, {
      foreignKey: "user_id",
      targetKey: "id",
      onDelete: "CASCADE",
    });

    if (db.Hashtag) {
      db.Post.belongsToMany(db.Hashtag, {
        through: "PostHashtag",
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
    } else {
      console.error("⚠️ Hashtag 모델이 존재하지 않습니다.");
    }
  }
}

module.exports = Post;


// <<<<<<< HEAD
// =======
// //2차 수정 필요 

// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
// const Sequelize = require("sequelize");

// class Post extends Sequelize.Model {
//   static initiate(sequelize) {
//     Post.init(
//       {
// <<<<<<< HEAD
//         id: {
//           type: Sequelize.INTEGER,
//           autoIncrement: true,
//           primaryKey: true,
//         },
// =======
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//         title: {
//           type: Sequelize.STRING(100),
//           allowNull: false,
//         },
//         content: {
//           type: Sequelize.TEXT,
//           allowNull: false,
//         },
// <<<<<<< HEAD
// =======
//         image_url: {
//           type: Sequelize.STRING, // 📌 이미지 경로를 저장하는 필드 추가
//           allowNull: true,
//         },
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//         is_public: {
//           type: Sequelize.BOOLEAN,
//           allowNull: false,
//           defaultValue: true,
//         },
// <<<<<<< HEAD
//       },
//       {
//         sequelize,
//         timestamps: true, // ✅ Sequelize가 자동으로 createdAt, updatedAt 생성
//         underscored: true, // ✅ 필드명을 스네이크 케이스(`created_at`, `updated_at`)로 변환
//         modelName: "Post",
//         tableName: "post",
//         paranoid: true, // ✅ soft delete 지원 (`deleted_at` 사용)
// =======
//         /*created_at: {
//           type: Sequelize.DATE,
//           allowNull: false,
//           defaultValue: Sequelize.NOW,
//         },
//         updated_at: {
//           type: Sequelize.DATE,
//           allowNull: false,
//           defaultValue: Sequelize.NOW,
//         },*/
//       },
//       {
//         sequelize,
//         timestamps: true, //자동으로 createAt과 updateAt 추가
//         underscored: true, //createAt->created_at으로 변경
//         modelName: "Post",
//         tableName: "post",
//         paranoid: true,
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//         charset: "utf8",
//         collate: "utf8_general_ci",
//       }
//     );
//   }

//   static associate(db) {
//     db.Post.belongsTo(db.User, {
//       foreignKey: "user_id",
//       targetKey: "id",
//       onDelete: "CASCADE",
//     });

// <<<<<<< HEAD
//     if (db.Hashtag) {
//       db.Post.belongsToMany(db.Hashtag, {
//         through: "PostHashtag",
//         foreignKey: "post_id",
//         onDelete: "CASCADE",
//       });
//     } else {
//       console.error("⚠️ Hashtag 모델이 존재하지 않습니다.");
// =======
//     if(db.Hashtag){
//         db.Post.belongsToMany(db.Hashtag, {
//             through:"PostHashtag",
//             foreignKey:"post_id",
//             onDelete:"CASCADE",
//         });
//     } else {
//         console.error("Hashtag 모델이 존재하지 않습니다.");
// >>>>>>> 5f6792775f68fc44c4cfe5a5bf85fe5992975f66
//     }
//   }
// }

// module.exports = Post;
