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
        board_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "boards",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        image_url: {
          type: Sequelize.STRING, // 이미지 경로 저장
          allowNull: true,
        },
        is_public: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        view_count: {
          type: Sequelize.INTEGER, // ✅ 조회수 컬럼 추가
          allowNull: false,
          defaultValue: 0, // 기본값 0
        },
      }, {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Post",
        tableName: "posts",
        paranoid: true, // soft delete 지원 (deleted_at 사용)
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

    db.Post.belongsTo(db.Board, {
      foreignKey: "board_id",
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
      console.error("Hashtag 모델이 존재하지 않습니다.");
    }
  }
}

module.exports = Post;
