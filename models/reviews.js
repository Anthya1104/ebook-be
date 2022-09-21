const pool = require('../utils/db');

// getReview
const getReview = async (userId, perPage, offset) => {
  let [data] = await pool.execute(
    'SELECT comment.* , product.book_name FROM comment JOIN product ON comment.product_id = product.id WHERE comment.user_id = ? AND comment.comment_valid = 1 ORDER BY comment.create_time DESC LIMIT ? OFFSET ?',
    [userId, perPage, offset]
  );
  console.log(userId, perPage, offset);
  return data;
};

// count totalReview by userid
const countTotalReview = async (userId) => {
  let [total] = await pool.execute('SELECT COUNT(*) AS total FROM comment WHERE user_id = ?', [userId]);
  return total[0].total;
};

module.exports = { getReview, countTotalReview };
