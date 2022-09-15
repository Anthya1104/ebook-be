const memberModel = require('../models/dbtest');

const getMemberList = async (req, res, next) => {
  console.log('DB_connection');
  let data = await memberModel.getMember();
  // console.log('result', data);
  res.json(data);
};

module.exports = { getMemberList };
