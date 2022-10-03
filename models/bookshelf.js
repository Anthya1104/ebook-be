const pool = require('../utils/db');

async function getCustomCategories(userId) {
  let [data] = await pool.execute('SELECT * FROM customized_book_category WHERE user_id = ?', [userId]);
  return data;
}

// 抓取recent book 資料
const getRecentBook = async (bookId) => {
  let [data] = await pool.execute(
    'SELECT owned_books.*, product.* FROM owned_books JOIN product ON owned_books.product_id = product.id WHERE member_id = ? AND update_time IS NOT NULL ORDER BY update_time DESC LIMIT 1',
    [bookId]
  );
  return data;
};

//載入後第一次抓取booklist
const getOwnedBooks = async () => {
  let [data] = await pool.execute('SELECT owned_books.*, product.* FROM owned_books JOIN product ON owned_books.product_id = product.id WHERE member_id = 1');

  return data;
};

// 更新最後閱讀
const updateRecentBook = async (memberId, bookId, currentTime) => {
  try {
    let [data] = await pool.execute('UPDATE owned_books SET update_time = ? WHERE member_id = ? AND product_id = ?', [currentTime, memberId, bookId]);
    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getCustomCategories, getOwnedBooks, getRecentBook, updateRecentBook };
