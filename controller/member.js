// member checkLogin
const loginChecker = async (req, res, next) => {
  // console.log(req.data);
  res.json('member session 這裡有接到');
};

module.exports = { loginChecker };
