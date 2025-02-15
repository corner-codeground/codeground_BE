const express = require('express');
const { Follow, User } = require('../models');
const { isLoggedIn } = require('../middleware/authMiddleware');

const router = express.Router();

// 팔로우 기능
router.post('/:userId', isLoggedIn, async (req, res) => {
  try {
      const { userId } = req.params;
      const followerId = req.user?.id; // req.user가 undefined일 경우 대비

      console.log(`팔로우 요청 - follower_id: ${followerId}, following_id: ${userId}`);

      if (!followerId) {
        // 로그인 오류 처리
          console.error("오류: req.user가 없습니다. (로그인이 필요합니다.)");
          return res.status(401).json({ message: '로그인이 필요합니다.' }); 
      }

      if (parseInt(userId, 10) === followerId) {
          console.error("오류: 자기 자신을 팔로우할 수 없습니다.");
          return res.status(400).json({ message: '자기 자신을 팔로우할 수 없습니다.' });
      }

      const followExists = await Follow.findOne({
          where: { follower_id: followerId, following_id: userId },
      });

      if (followExists) {
          console.error("오류: 이미 팔로우 중입니다.");
          return res.status(400).json({ message: '이미 팔로우 중입니다.' });
      }

      await Follow.create({ follower_id: followerId, following_id: userId });
      console.log("팔로우 성공!");
      res.status(201).json({ message: '팔로우 성공' });

  } catch (error) {
      console.error('서버 오류:', error);
      res.status(500).json({ message: '서버 오류' });
  }
});


// 언팔로우 기능
router.delete('/unfollow/:userId', isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.params;
        const followerId = req.user.id;

        const follow = await Follow.findOne({
            where: { follower_id: followerId, following_id: userId },
        });

        if (!follow) {
            return res.status(400).json({ message: '팔로우하고 있지 않습니다.' });
        }

        await follow.destroy();
        res.status(200).json({ message: '언팔로우 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 내 팔로잉 목록 조회
router.get('/following', isLoggedIn, async (req, res) => {
    try {
        const following = await Follow.findAll({
            where: { follower_id: req.user.id },
            include: [{ model: User, as: 'FollowingUser', attributes: ['id', 'username'] }],
        });
        res.status(200).json(following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 내 팔로워 목록 조회
router.get('/followers', isLoggedIn, async (req, res) => {
    try {
        const followers = await Follow.findAll({
            where: { following_id: req.user.id },
            include: [{ model: User, as: 'FollowerUser', attributes: ['id', 'username'] }],
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

// 나를 팔로우한 사람 차단 (삭제)
router.delete('/remove-follower/:userId', isLoggedIn, async (req, res) => {
    try {
        const { userId } = req.params;
        const followingId = req.user.id;

        const follow = await Follow.findOne({
            where: { follower_id: userId, following_id: followingId },
        });

        if (!follow) {
            return res.status(400).json({ message: '해당 사용자는 당신을 팔로우하고 있지 않습니다.' });
        }

        await follow.destroy();
        res.status(200).json({ message: '팔로워 삭제 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
});

module.exports = router;
