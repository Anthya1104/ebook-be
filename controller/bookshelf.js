const bookshelfModel = require('../models/bookshelf');
const pool = require('../utils/db');

// 傳送全部分類資料給前端
async function getCustomCategories(req, res, next) {
  // console.log('bookshelf', req.session.member.id);
  let data = await bookshelfModel.getCustomCategories(req.session.member.id);
  res.json(data);
}
// 傳送最近閱讀資料給前端
const getRecentBook = async (req, res, next) => {
  // console.log('recent-book request received');

  let data = await bookshelfModel.getRecentBook(req.session.member.id);
  // console.log(data);

  res.json(data);
};

// 更新目前在的分類篩出來的bookList
const getOnCategory = async (req, res, next) => {
  console.log('category-info', req.body.bookFilterParams.category);
  let sql =
    'SELECT owned_books.*, customized_book_category.*, product.* FROM owned_books JOIN customized_book_category ON owned_books.category_id = customized_book_category.id JOIN product ON owned_books.product_id = product.id WHERE owned_books.member_id = ?';

  // 假設分類 1 -> all : 抓全部
  if (req.body.bookFilterParams.category === 1) {
    let paramCondition = [req.session.member.id];
    if (req.body.bookFilterParams.is_read) {
      sql = sql + ' AND owned_books.reading_progress <> ?';
      paramCondition.push(0);
    } else {
      sql = sql + ' AND owned_books.reading_progress = ?';
      paramCondition.push(0);
    }
    if (!req.body.bookFilterParams.date_sort_toggled) {
      sql = sql + ' ORDER BY owned_books.update_time DESC';
    } else {
      sql = sql + ' ORDER BY owned_books.update_time';
    }
    // TODO:最後分頁
    const perPage = 4;
    let page = req.body.bookFilterParams.on_page || 1;
    let [total] = await pool.execute('SELECT COUNT(*) AS total FROM owned_books WHERE member_id = ?', [req.session.member.id]);
    // console.log(total[0].total);
    let totalItem = total[0].total;
    let lastPage = Math.ceil(totalItem / perPage);
    const offset = perPage * (page - 1);
    console.log(totalItem, lastPage, offset);
    sql = sql + ' LIMIT ? OFFSET ?';
    paramCondition.push(perPage, offset);
    let [data] = await pool.execute(sql, paramCondition);

    return res.json(data);
  }
  // 繼續接 WHERE
  // 如果已讀
  let paramCondition = [req.session.member.id];
  sql = sql + ' AND owned_books.category_id = ?';
  paramCondition.push(req.body.bookFilterParams.category);
  if (req.body.bookFilterParams.is_read) {
    sql = sql + ' AND owned_books.reading_progress <> ?';
    paramCondition.push(0);
  } else {
    sql = sql + ' AND owned_books.reading_progress = ?';
    paramCondition.push(0);
  }
  if (!req.body.bookFilterParams.date_sort_toggled) {
    sql = sql + ' ORDER BY owned_books.update_time DESC';
  } else {
    sql = sql + ' ORDER BY owned_books.update_time';
  }
  console.log(sql);
  console.log(paramCondition);

  // let [data] = await pool.execute(
  //   'SELECT owned_books.*, customized_book_category.*, product.* FROM owned_books JOIN customized_book_category ON owned_books.category_id = customized_book_category.id JOIN product ON owned_books.product_id = product.id WHERE owned_books.category_id = ? AND owned_books.member_id = ?',
  //   [req.body.bookFilterParams.category, req.session.member.id]
  // );
  let [data] = await pool.execute(sql, paramCondition);
  // // let onCategoryId = 'abc';
  // // console.log(data.length);

  res.json(data);

  // next();
};

const getOwnedBooks = async (req, res, next) => {
  // console.log('getOwnedBooks', req.onCategoryId);
  let data = await bookshelfModel.getOwnedBooks();
  // console.log(onCategoryId);
  res.json(data);
};

// 更新最後閱讀
const updateRecentBook = async (req, res, next) => {
  // 寫入資料庫的話不用轉換
  // let currentTime = new Date().toISOString().split('T').shift();
  let currentTime = new Date();
  console.log('update', req.session);
  let memberId = req.session.member.id;
  let bookId = req.query.id;
  let result = await bookshelfModel.updateRecentBook(memberId, bookId, currentTime);
  // console.log('postbookShelf', result);
  res.json(`更新成功`);
};

module.exports = { getCustomCategories, getOwnedBooks, getOnCategory, getRecentBook, updateRecentBook };
