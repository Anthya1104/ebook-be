// customized categories
const express = require('express');
const router = express.Router();

const bookshelfController = require('../controller/bookshelf');

router.get('/custom-categories', bookshelfController.getCustomCategories);

// 抓取前端送來的變數
// category filter
router.post('/on-filter', bookshelfController.getOnCategory);
// TODO: isRead filter

// TODO: searched filter

// TODO: sorted

// 抓出更新後的頁面資料
router.get('/owned-books', bookshelfController.getOwnedBooks);

module.exports = router;
