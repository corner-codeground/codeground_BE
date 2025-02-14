module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define("Follow", {
      followerId: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      followingId: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
  }, {
      tableName: "follows",
      timestamps: false
  });

  Follow.associate = (db) => {
      Follow.belongsTo(db.User, { foreignKey: "followerId", as: "Follower" });
      Follow.belongsTo(db.User, { foreignKey: "followingId", as: "Following" });
  };

  return Follow;
};
