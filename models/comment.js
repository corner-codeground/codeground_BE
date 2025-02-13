const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({
      post_id: { 
        type: Sequelize.INTEGER, // 글 ID
        allowNull: false,
      },
      user_id: { 
        type: Sequelize.INTEGER, // 사용자 ID
        allowNull: false,
      },
      comment: { 
        type: Sequelize.TEXT, // 댓글 내용
        allowNull: false,
      },
      parent_comment_id: { 
        type: Sequelize.INTEGER, // 부모 댓글 ID (NULL이면 일반 댓글, 값이 있으면 대댓글)
        allowNull: true,
        defaultValue: null,
      },
    }, {
      sequelize,
      timestamps: true, // createdAt, updatedAt 자동 생성
      underscored: false,
      modelName: 'Comment',
      tableName: 'comment',
      paranoid: true, // 소프트 삭제 활성화 (deletedAt)
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // ✅ 댓글과 대댓글의 Self-referencing 관계 설정
    db.Comment.hasMany(db.Comment, { 
      foreignKey: 'parent_comment_id', 
      as: 'Replies',  // ✅ 대댓글을 가져올 때 `Replies`로 조회 가능
      onDelete: 'CASCADE'
    });
    db.Comment.belongsTo(db.Comment, { 
      foreignKey: 'parent_comment_id', 
      as: 'ParentComment'  // ✅ 부모 댓글을 가져올 때 `ParentComment`로 조회 가능
    });

    // ✅ Comment - User 관계 설정 (댓글 작성자)
    db.Comment.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id' });
  }
}

module.exports = Comment;
