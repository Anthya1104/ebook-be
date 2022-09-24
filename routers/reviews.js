const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');

// validator
const { body } = require('express-validator');
const reviewRules = [
  // getOwnedBooks { member_id: 1, book_id: 1, review_score: 4, review_comments: '12345' }
  body('req.member_id').isEmpty().withMessage('沒有會員id'),
  body('req.book_id').isEmpty().withMessage('沒有書本id'),
  body('review_score')
    .custom((value) => {
      return value >= 1 && value <= 5;
    })
    .withMessage('評論分數有誤'),
  body('req.review_comments').isEmpty().withMessage('沒有評論內容'),
];

// controller
const reviewsController = require('../controller/reviews');

// 前端 post review
router.post('/post-review', reviewRules, reviewsController.reViewValueChecker, reviewsController.postReviews);

// 前端 get review
router.get('/get-reviews', authMiddleware.checkLogin, reviewsController.getReviews);

module.exports = router;
