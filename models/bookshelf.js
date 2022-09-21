const pool = require('../utils/db');

async function getCustomCategories() {
  let [data] = await pool.execute('SELECT * FROM customized_book_category WHERE user_id = 1');
  return data;
}

// 抓取recent book 資料
const getRecentBook = async () => {
  let [data] = await pool.execute(
    'SELECT owned_books.*, product.* FROM owned_books JOIN product ON owned_books.product_id = product.id WHERE member_id = 1 ORDER BY update_time DESC LIMIT 1'
  );
  return data;
};

//載入後第一次抓取booklist
const getOwnedBooks = async () => {
  let [data] = await pool.execute('SELECT owned_books.*, product.* FROM owned_books JOIN product ON owned_books.product_id = product.id WHERE member_id = 1');

  return data;
};

module.exports = { getCustomCategories, getOwnedBooks, getRecentBook };
