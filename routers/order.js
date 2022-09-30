const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

const authMiddleware = require('../middlewares/auth');

// -> /api/1.0/order/get-order
router.get('/get-order', authMiddleware.checkLogin, async (req, res, next) => {
  // console.log(req.query.member_id);
  if (req.query.order) {
    let [detailData] = await pool.execute(
      'SELECT user_order_detail.*, product.*, user_order.* FROM user_order_detail JOIN product ON user_order_detail.product_id = product.id JOIN user_order ON user_order_detail.order_id = user_order.id WHERE user_order_detail.order_id= ? AND user_order_detail.user_id =?',
      [req.query.order, req.query.member_id]
    );
    // console.log('query-order', detailData.length);
    let totalItems = detailData.length;
    let itemsPrice = detailData.map((value) => value.price).reduce((a, b) => a + b);
    // console.log('itemPrice', itemsPrice);
    return res.json({
      priceDetail: {
        totalItems,
        itemsPrice,
      },
      detailData,
    });
  }
  let [data] = await pool.execute('SELECT * FROM user_order WHERE user_id = ?', [req.query.member_id]);
  // console.log('data in order', data);
  res.json(data);
});

module.exports = router;
