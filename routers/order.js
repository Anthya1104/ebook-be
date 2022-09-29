const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// -> /api/1.0/order/get-order
router.get('/get-order', async (req, res, next) => {
  // console.log(req.query.member_id);
  // const req.query.member_id =30
  let [data] = await pool.execute('SELECT * FROM user_order WHERE user_id = ?', [req.query.member_id]);
  console.log('data in order', data);
  res.json(data);
});

module.exports = router;
