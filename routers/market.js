const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// -> /api/1.0/product-list
router.get('/product-list', async (req, res, next) => {
  let getProducts = await pool.execute('SELECT * from product');
  res.json(getProducts[0]);
});
module.exports = router;
