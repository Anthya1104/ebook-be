const express = require('express');
const router = express.Router();

// controller
const reviewsController = require('../controller/reviews');

// 前端 post review
router.post('/post-review', reviewsController.postReviews);


module.exports = router;
