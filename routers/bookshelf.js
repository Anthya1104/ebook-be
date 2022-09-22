// customized categories
const express = require('express');
const router = express.Router();

const bookshelfController = require('../controller/bookshelf');

// 送分類資料給前端
router.get('/custom-categories', bookshelfController.getCustomCategories);

// 送最近閱讀資料給前端
router.get('/recent-book', bookshelfController.getRecentBook);

// 抓取前端送來的變數
// category filter
router.post('/on-filter', bookshelfController.getOnCategory);
// TODO: isRead filter

// TODO: searched filter

// TODO: sorted

// 抓出更新後的頁面資料
router.get('/owned-books', bookshelfController.getOwnedBooks);

// 更新最後閱讀
router.post('/update-recent-book', bookshelfController.updateRecentBook);

module.exports = router;
