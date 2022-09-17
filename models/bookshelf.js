const pool = require('../utils/db');

async function getCustomCategories() {
  let [data] = await pool.execute('SELECT * FROM customized_book_category');
  return data;
}

const getOwnedBooks = async () => {
  let [data] = await pool.execute('SELECT owned_books.*, product.* FROM owned_books JOIN product ON owned_books.product_id = product.id');

  return data;
};

module.exports = { getCustomCategories, getOwnedBooks };
