const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/get-coupon', async (req, res, next) => {
  // let getProducts = await pool.execute('SELECT * from product');
  console.log('coupon');
  res.json('connected');
});
module.exports = router;
