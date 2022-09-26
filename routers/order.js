const express = require('express');
const router = express.Router();

// -> /api/1.0/order/get-order
router.get('/get-order', async (req, res, next) => {
  res.json('連接到get-order');
});

module.exports = router;
