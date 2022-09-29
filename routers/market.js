const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// -> /api/1.0/market/product-list
// 所有商品的API
router.get('/product-list', async (req, res, next) => {
  let getProducts = await pool.execute('SELECT * from product');
  res.json(getProducts[0]);
});

// -> /api/1.0/market/cart-list
// 購物商品post
router.post('/cart-list', async (req, res, next) => {
  console.log(req.body);
  // const req.body.product_id =1

  // let getProducts =
  await pool.execute(`INSERT INTO user_order_detail ( order_id, product_id, coupon_id, user_id, amount, valid) VALUES ('30', '30', '1', '30', '1', '1')`);
  res.send({ message: '已成功加入購物車' });
});

module.exports = router;
