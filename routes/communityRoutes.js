const express = require("express");
const { getPopularPosts, increaseViewCount } = require("../controllers/communityController");

const router = express.Router();

// 인기글 조회 API
router.get("/popular", getPopularPosts);

// 조회수 증가 API
router.put("/view/:postId", increaseViewCount);

router.get("/category/:category", getPostsByCategory);

module.exports = router;
