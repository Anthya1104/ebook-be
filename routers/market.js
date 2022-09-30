const { response } = require('express');
const express = require('express');
const { format } = require('mysql2');
const router = express.Router();
const pool = require('../utils/db');

const authMiddleware = require('../middlewares/auth');

// -> /api/1.0/market/product-list
// 所有商品的API
router.get('/product-list', async (req, res, next) => {
  let getProducts = await pool.execute('SELECT * from product');
  res.json(getProducts[0]);
});

// -> /api/1.0/market/get-product
router.get('/get-product', async (req, res, next) => {
  console.log(req.query);
  try {
    let [result] = await pool.execute('SELECT * from product WHERE id = ?', [req.query.id]);
    // console.log(result);
    res.json(result);
  } catch (e) {
    console.error(e);
  }
});

// -> /api/1.0/market/cart-list
// 購物商品post
router.post('/cart-list', authMiddleware.checkLogin, async (req, res, next) => {
  console.log(req.body);
  // const req.body.product_id =1

  //  抓到目前最後一筆訂單
  const lastOrder = await pool.execute('SELECT * from user_order_detail ORDER BY order_id DESC LIMIT 1 ');

  let lastOrderId = lastOrder[0][0].order_id;
  let newOrderId = lastOrderId + 1;
  // insert user_order
  // 抓到 total amount
  let totalAmount = 0;
  for (let i = 0; i < req.body.items.length; i++) {
    let itemPrice = parseInt(req.body.items[i].price);
    totalAmount += itemPrice;
  }
  console.log(totalAmount);
  let currentTime = new Date();

  let userOrderRes = await pool.execute('INSERT INTO user_order (user_id, date, total) VALUES (?, ?, ?)', [req.body.memberId, currentTime, totalAmount]);

  // insert user_order_detail
  console.log('order-number', req.body.items[0].id * req.body.items[0].price);
  for (let i = 0; i < req.body.items.length; i++) {
    const result = await pool.execute(`INSERT INTO user_order_detail ( order_id, product_id, coupon_id, user_id, amount, valid) VALUES ( ?, ?, ?, ?, ?, ?)`, [
      newOrderId,
      req.body.items[i].id,
      1,
      req.body.memberId,
      1,
      1,
    ]);
  }

  // insert owned_books
  for (let i = 0; i < req.body.items.length; i++) {
    let ownedBooksRes = await pool.execute('INSERT INTO owned_books (product_id, member_id, update_time) VALUES (?,?,?)', [req.body.items[i].id, req.body.memberId, currentTime]);
  }

  res.send('訂單成立');
});

module.exports = router;
