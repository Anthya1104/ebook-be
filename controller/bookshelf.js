const bookshelfModel = require('../models/bookshelf');
const pool = require('../utils/db');

async function getCustomCategories(req, res, next) {
  let data = await bookshelfModel.getCustomCategories();
  res.json(data);
}

const getOnCategory = async (req, res, next) => {
  console.log('category-info', req.body);
  console.log(req.body[1].id);

  // let data = await bookshelfModel.getFilteredBooks();
  let [data] = await pool.execute(
    'SELECT owned_books.*, customized_book_category.*, product.* FROM owned_books JOIN customized_book_category ON owned_books.category_id = customized_book_category.id JOIN product ON owned_books.product_id = product.id WHERE owned_books.category_id = ?',
    [req.body[1].id]
  );
  // let onCategoryId = 'abc';
  res.json(data);
  // next();
};

const getOwnedBooks = async (req, res, next) => {
  console.log('getOwnedBooks', req.onCategoryId);
  let data = await bookshelfModel.getOwnedBooks();
  // console.log(onCategoryId);
  res.json(data);
};

module.exports = { getCustomCategories, getOwnedBooks, getOnCategory };
