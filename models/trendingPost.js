const { Sequelize, DataTypes } = require("sequelize");

class TrendingPost extends Sequelize.Model {
  static initiate(sequelize) {
    TrendingPost.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        view_count: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        likes: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        board_id: { // ✅ 특정 게시판과 연결
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "boards",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        user_id: { // ✅ 작성자 정보 추가
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "user",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        modelName: "TrendingPost",
        tableName: "trendingPosts", // ✅ 테이블명 변경
        timestamps: true,
        //underscored: false, // ✅ Snake Case 변환 방지
      }
    );
  }

  static associate(db) {
    db.TrendingPost.belongsTo(db.Board, { foreignKey: "board_id", targetKey: "id", onDelete: "CASCADE" });
    db.TrendingPost.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id", onDelete: "CASCADE" });

    if (db.Hashtag) {
      db.TrendingPost.belongsToMany(db.Hashtag, {
        through: "TrendingPostHashtag",
        foreignKey: "trending_post_id",
        onDelete: "CASCADE",
      });
    }
  }
}

module.exports = TrendingPost;
