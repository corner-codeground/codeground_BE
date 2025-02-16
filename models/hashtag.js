const Sequelize = require("sequelize");

class Hashtag extends Sequelize.Model {
  static initiate(sequelize) {
    Hashtag.init(
      {
        tag: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Hashtag",
        tableName: "hashtag",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Hashtag.belongsToMany(db.Post, {
      through: "PostHashtag",
      foreignKey: "hashtag_id",
      onDelete: "CASCADE",
    });
  }
}

module.exports = Hashtag;