const app=require("./src/app");
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");

// ✅ 디버깅: postRoutes가 올바르게 로드되는지 확인
console.log("📌 [DEBUG] postRoutes.js 불러오기 시도");
try{
const postRoutes = require("./routes/postRoutes");
console.log("✅ [DEBUG] postRoutes.js 불러오기 완료");
const app = express();

app.use(cors({
  origin: "*", // ✅ 모든 출처 허용 (보안이 중요한 경우 특정 도메인만 허용)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());
//app.use(cors()); // ✅ CORS 활성화


app.use("/auth", authRoutes);
console.log("DEBUG: api/posts 라우트 등록 시도");
app.use("/api/posts", (req, res, next) => {
  console.log("📌 [DEBUG] /api/posts 요청 수신 - server.js");
  next();
});
app.use("/api/posts", postRoutes);
console.log("DEBUG: api/posts 라우트 등록 완료")

// ✅ 정적 파일을 먼저 제공하도록 수정
app.use(express.static(path.join(__dirname, "public"))); 

// ✅ "/" 요청이 왔을 때 index.html 제공 (이제 express.static() 이후에 배치)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://127.0.0.1:${PORT}`));
}catch(error){
  console.log("❌ [ERROR] postRoutes.js 불러오기 실패:", error);
}