const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const memberController = require('../controller/member');

// 確認登入
router.get('/', memberController.loginChecker);

module.exports = router;
