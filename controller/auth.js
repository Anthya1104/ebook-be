const LogoutHandler = async (req, res, next) => {
  req.session.member = null;
  res.json({ message: '登出成功' });
};
module.exports = { LogoutHandler };
