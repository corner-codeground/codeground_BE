module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
      username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false
      }
  }, {
      tableName: "users",
      timestamps: true
  });

  User.associate = (db) => {
      User.hasMany(db.Post, { foreignKey: "user_id", as: "Posts" });

      User.belongsToMany(db.User, {
          through: db.Follow,
          as: "Followers",
          foreignKey: "followingId"
      });

      User.belongsToMany(db.User, {
          through: db.Follow,
          as: "Following",
          foreignKey: "followerId"
      });
  };

  return User;
};
