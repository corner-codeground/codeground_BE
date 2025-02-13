const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
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
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
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

    if(db.Hashtag){
        db.Post.belongsToMany(db.Hashtag, {
            through:"PostHashtag",
            foreignKey:"post_id",
            onDelete:"CASCADE",
        });
    } else {
        console.error("Hashtag 모델이 존재하지 않습니다.");
    }
  }
}

module.exports = Post;
