const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // 업로드된 파일이 저장될 경로
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // 파일 확장자 추출
    cb(null, Date.now() + ext); // 파일명: 현재 시간 + 확장자명
  }
});

// 파일 필터 설정 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // 허용된 파일 형식
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false); // 허용되지 않는 파일 형식
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;