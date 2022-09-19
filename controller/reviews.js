const pool = require('../utils/db');

const postReviews = async (req, res, next) => {
  console.log('getOwnedBooks', req.body);
  res.json(req.body);
};

module.exports = { postReviews };
