const fs = require('fs');
const path = require('path');

/**
 * 이미지 파일 삭제 함수
 * @param {string} imagePath - 삭제할 이미지의 경로
 */
const removeImage = (imagePath) => {
    if (!imagePath) {
        console.log('삭제할 이미지 경로가 제공되지 않았습니다.');
        return;
    }

    const absolutePath = path.resolve(__dirname, '..', imagePath);

    // 파일 존재 여부 확인 후 삭제
    if (fs.existsSync(absolutePath)) {
        fs.unlink(absolutePath, (err) => {
            if (err) {
                console.error(`이미지 삭제 오류: ${err.message}`);
            } else {
                console.log(`이미지 삭제 완료: ${absolutePath}`);
            }
        });
    } else {
        console.log(`이미지 파일이 존재하지 않음: ${absolutePath}`);
    }
};

module.exports = { removeImage };
