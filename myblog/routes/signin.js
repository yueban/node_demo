const express = require('express');
const sha1 = require('sha1');
const {
  checkNotLogin,
} = require('../middlewares/check');
const UserModel = require('../models/users');

const router = express.Router();

router.get('/', checkNotLogin, (req, res) => {
  res.render('signin.pug');
});

router.post('/', checkNotLogin, (req, res, next) => {
  const {
    name,
    password,
  } = req.fields;

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写用户名');
    }
    if (!password.length) {
      throw new Error('请填写密码');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  return UserModel.getUserByName(name).then((user) => {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('back');
    }
    if (sha1(password) !== user.password) {
      req.flash('error', '用户名或密码错误');
      return res.redirect('back');
    }
    req.flash('success', '登录成功');
    // 用户信息写入 session
    delete user.password;
    req.session.user = user;
    // 跳转主页
    return res.redirect('/posts');
  }).catch(next);
});

module.exports = router;
