const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init({
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      modelName: 'Like',
      tableName: 'likes', // 테이블명은 복수형
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // ✅ `db.User`와 `db.Post`가 undefined가 아닌지 확인
    if (db.User && db.Post) {
      db.Like.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
      db.Like.belongsTo(db.Post, { foreignKey: 'post_id', targetKey: 'id' });
    } else {
      console.error('⚠️ Like.associate: db.User 또는 db.Post가 정의되지 않았습니다.');
    }
  }
}

module.exports = Like;
