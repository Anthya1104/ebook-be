const express = require('express');
const router = express.Router();

// 登入 -> /api/1.0/auth/login
router.post('/login', async (req, res, next) => {
  console.log(req.body);
  res.json('登入有接到喔');
});

module.exports = router;
