// models/post.js
const Sequelize = require("sequelize");
const { DataTypes, Model } = require("sequelize");

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
        board_id: { // ✅ category 대신 board_id 사용
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "boards", // ✅ boards 테이블 참조
            key: "id",
          },
        },
        image_url: {
          type: Sequelize.STRING,
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
        timestamps: true,
        underscored: true,
        modelName: "Post",
        tableName: "post",
        paranoid: true,
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
      console.error("Hashtag 모델이 존재하지 않습니다.");
    }
  }
}

module.exports = Post;
