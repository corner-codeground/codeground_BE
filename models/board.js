const Sequelize = require("sequelize");

class Board extends Sequelize.Model {
  static initiate(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: true,
        modelName: "Board",
        tableName: "boards",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Board.hasMany(db.Post, { foreignKey: "board_id", sourceKey: "id", onDelete: "CASCADE" });
    db.Post.belongsTo(db.Board, { foreignKey: "board_id", targetKey: "id", onDelete: "CASCADE" }); // ✅ 추가
  }

  static async seedDefaultBoards() {
    const defaultBoards = [
      "Frontend",
      "Backend",
      "Security",
      "Media & Game",
      "AI & Data Science",
      "Embedded & IoT",
      "Blockchain & Web3",
      "Big Data",
      "Career & Dev Culture",
    ];

    for (const name of defaultBoards) {
      await Board.findOrCreate({ where: { name } });
    }
  }
}

module.exports = Board;
