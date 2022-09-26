const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

// -> /api/1.0/order/get-order
router.get('/get-order', async (req, res, next) => {
  // console.log(req.query.member_id);
  if (req.query.order) {
    let [detailData] = await pool.execute ('SELECT user_order_detail.*, product.book_name AS p_name, product.price, product.book_img, user_order.user_id, user_order.id AS o_id, user_order.date, user_order.status, member.name AS u_name, member.member_class, member.email, member.user_name, member.birthday, member.account, marketing.coupon_name AS c_name
    FROM user_order_detail
    JOIN member ON user_order_detail.user_id = member.id
    JOIN product ON user_order_detail.product_id = product.id
    JOIN user_order ON user_order_detail.order_id = user_order.id
    JOIN marketing ON user_order_detail.coupon_id=marketing.id
    WHERE order_id= ')
    return res.json({ message: '抓詳細訂單' });
  }
  let [data] = await pool.execute('SELECT * FROM user_order WHERE user_id = ?', [req.query.member_id]);
  console.log('data in order', data);
  res.json(data);
});

module.exports = router;
