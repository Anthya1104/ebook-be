const pool = require('../utils/db');
const reviewModel = require('../models/reviews');
// validator
const { validationResult } = require('express-validator');

const reViewValueChecker = async (req, res, next) => {
  // 檢查資料類別是否符合 reviewRules
  // console.log('inValidatoinChecker', req.body);
  const validateResult = validationResult(req);
  // console.log('validateResult', validateResult);
  if (!validateResult.isEmpty()) {
    return res.status(400).json({ errors: validateResult.array() });
  }

  // console.log('SQLparam', req.body.member_id);

  // 檢查 book_id, member_id 是否存在
  let reqData;
  try {
    let [ownedBookData] = await pool.execute('SELECT * FROM owned_books WHERE member_id = ? AND product_id = ?', [req.body.member_id, req.body.book_id]);
    reqData = [...ownedBookData];
  } catch (e) {
    console.error(e);
  }
  // console.log(reqData);
  // 如果 === 0 -> 不存在 沒抓到
  if (reqData.length === 0) {
    return res.status(400).json({ message: '會員或書本不存在' });
  }
  next();
};

const postReviews = async (req, res, next) => {
  // 來到這裡就代表檢查通過 可以開始 INSERT 新 comment
  // 檢查是否已存在相關評論?
  let data;
  try {
    let [dataResult] = await pool.execute('SELECT * FROM comment WHERE user_id = ? AND product_id = ?', [req.body.member_id, req.body.book_id]);
    data = [...dataResult];
  } catch (e) {
    console.error(e);
  }
  // console.log('data', data);
  if (data.length > 0) {
    // 已經存在對同筆書的評論
    try {
      let result = await pool.execute('UPDATE comment SET star_rating = ?, content = ? WHERE user_id = ? AND product_id = ?', [
        req.body.review_score,
        req.body.review_comments,
        req.body.member_id,
        req.body.book_id,
      ]);
      console.log('update result', result);
    } catch (e) {
      console.error(e);
    }
    return res.json({ message: '成功修改評論' });
  }
  // 跑到這邊代表還沒評論過
  try {
    let result = await pool.execute('INSERT INTO comment (product_id, user_id, star_rating, content) VALUES (?, ?, ?, ?)', [
      req.body.book_id,
      req.body.member_id,
      req.body.review_score,
      req.body.review_comments,
    ]);
    console.log('INSERT result', result);
  } catch (e) {
    console.error(e);
  }
  // console.log('getOwnedBooksReview', req.body);
  res.json('成功寫入評論');
};

const getReviews = async (req, res, next) => {
  let data = await reviewModel.getReview();
  res.json(data);
};

module.exports = { postReviews, reViewValueChecker, getReviews };
