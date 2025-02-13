const Sequelize = require("sequelize");

class RunCode extends Sequelize.Model {
  static initiate(sequelize) {
    RunCode.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true, // 로그인 안 한 유저도 실행 가능하도록 NULL 허용
        },
        language_detected: {  // ✅ 감지된 언어 저장 필드 추가
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "unknown",
        },
        code: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        output: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        executed_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        modelName: "RunCode",
        tableName: "runCodes",
        timestamps: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    if (db.User) {
      // 실행한 코드와 사용자 관계 설정
      db.RunCode.belongsTo(db.User, { foreignKey: "user_id", targetKey: "id" });
    } else {
      console.error("⚠️ RunCode.associate: db.User가 정의되지 않았습니다.");
    }
  }
}

module.exports = RunCode;
