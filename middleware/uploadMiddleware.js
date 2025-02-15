//수정 완료
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads/ 폴더가 없을 경우 자동 생성
const uploadDir="uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir,{recursive:true}); //폴더가 없을 경우 생성
}

// 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); //업로드된 파일 저장 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // 파일명: 현재시간+랜덤값+확장자
  },
});

// 파일 필터링 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  }
};

// multer 설정 적용
const upload = multer({ 
  storage, 
  fileFilter,
  limits:{fileSize: 5*1024*1024},
});

module.exports = upload;
