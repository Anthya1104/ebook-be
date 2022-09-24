let checkLogin = function (req, res, next) {
  if (!req.session.member) {
    // 尚未登入
    return res.status(401).json({ message: '尚未登入' });
  }
  // console.log('in auth', req.session.member);
  next();
};

module.exports = { checkLogin };
