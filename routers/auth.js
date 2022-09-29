// TODO:拆成MVC
const express = require('express');
const router = express.Router();
const pool = require('../utils/db');
const authController = require('../controller/auth');

const bcrypt = require('bcrypt');

const { body, validationResult } = require('express-validator');

// register rules
const regiRules = [
  body('password').isLength({ min: 8 }).withMessage('密碼長度不足'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('密碼驗證不一致'),
];

// 註冊 -> /api/1.0/auth/register
router.post('/register', regiRules, async (req, res, next) => {
  // console.log(req.body);

  // validation
  const validateResult = validationResult(req);
  // console.log('validateRewult', validateResult);
  if (!validateResult.isEmpty()) {
    return res.status(400).json({ errors: validateResult.array() });
  }

  // 檢查帳號是否重複
  try {
    let [members] = await pool.execute('SELECT * FROM member WHERE account = ?', [req.body.account]);
    // console.log('member checking', members);
    if (members.length > 0) {
      return res.status(400).json({ message: '這個帳號已經存在了喔' });
    }
  } catch (e) {
    console.error(e);
  }

  // 跳到這邊代表帳號沒有重複
  // hashed password
  try {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    let result = await pool.execute('INSERT INTO member (account, password, name) VALUES (?,?,?)', [req.body.account, hashedPassword, req.body.name]);
    // console.log('insert new member', result);

    // create default customized_book_category
    let [memberIdRes] = await pool.execute('SELECT * from member WHERE account = ?', [req.body.account]);
    // console.log(memberIdRes[0].id);
    let currentTime = new Date();
    let [newMemberCatRes] = await pool.execute('INSERT INTO customized_book_category (local_id, user_id, category_name, create_time) VALUES (?, ?, ?, ?)', [
      1,
      memberIdRes[0].id,
      '所有藏書',
      currentTime,
    ]);

    res.json({ message: '註冊成功' });
  } catch (e) {
    console.error(e);
  }
});

// 登入 -> /api/1.0/auth/login
router.post('/login', async (req, res, next) => {
  // console.log(req.body);
  // 是否註冊過 -> 資料庫是否有資料
  try {
    let [members] = await pool.execute('SELECT * FROM member WHERE account = ?', [req.body.account]);
    // console.log(members);
    if (members.length === 0) {
      // 如果不存在
      return res.status(401).json({ message: '帳號或密碼錯誤' });
    }

    // 如果存在 -> 有註冊過
    let member = members[0];
    let comparePassword = await bcrypt.compare(req.body.password, member.password);
    if (!comparePassword) {
      // 如果比對不正確
      return res.status(401).json({ message: '帳號或密碼錯誤' });
    }
    // 比對正確 -> 存進 session
    let saveMember = {
      id: member.id,
      name: member.name,
      password: member.password,
      loginDt: new Date().toISOString(),
    };
    req.session.member = saveMember;

    res.json(saveMember);
  } catch (e) {
    console.error(e);
  }
});

// 登出 -> /api/1.0/auth/logout
router.get('/logout', authController.LogoutHandler);

module.exports = router;
