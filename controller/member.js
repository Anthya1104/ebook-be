// member checkLogin
const loginChecker = async (req, res, next) => {
  // console.log(req.data);
  console.log(req.session.member);
  res.json(req.session.member);
};

module.exports = { loginChecker };
