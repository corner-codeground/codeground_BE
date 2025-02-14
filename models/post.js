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
        is_public: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        timestamps: true, // ✅ Sequelize가 자동으로 createdAt, updatedAt 생성
        underscored: true, // ✅ 필드명을 스네이크 케이스(`created_at`, `updated_at`)로 변환
        modelName: "Post",
        tableName: "post",
        paranoid: true, // ✅ soft delete 지원 (`deleted_at` 사용)
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
