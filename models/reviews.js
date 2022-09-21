const pool = require('../utils/db');

const getReview = async () => {
  let [data] = await pool.execute(
    'SELECT comment.* , product.book_name FROM comment JOIN product ON comment.product_id = product.id WHERE comment.user_id = 1 AND comment.comment_valid = 1 ORDER BY comment.create_time DESC'
  );
  return data;
};

module.exports = { getReview };
