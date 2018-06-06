const express = require('express');
const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const {
  checkNotLogin,
} = require('../middlewares/check');
const UserModel = require('../models/users');

const router = express.Router();

router.get('/', checkNotLogin, (req, res) => {
  res.render('signup');
});

router.post('/', checkNotLogin, (req, res, next) => {
  const {
    name,
    gender,
    bio,
    password,
    repassword,
  } = req.fields;
  const {
    avatar: avatarFile,
  } = req.files;
  const avatar = avatarFile.path.split(path.sep).pop();

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符');
    }
    if (!avatarFile.name) {
      throw new Error('缺少头像');
    }
    if (password.lengh < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (error) {
    fs.unlink(avatarFile.path);
    req.flash('error', error.message);
    return res.redirect('/signup');
  }

  // 明文密码加密
  const passwordEncrypt = sha1(password);

  // 待写入数据库的用户信息
  let user = {
    name,
    password: passwordEncrypt,
    gender,
    bio,
    avatar,
  };

  // 用户信息吸入数据库
  return UserModel.create(user).then((result) => {
    ([
      user,
    ] = result.ops);
    delete user.password;
    req.session.user = user;
    req.flash('success', '注册成功');
    res.redirect('/posts');
  }).catch((e) => {
    fs.unlink(avatarFile.path);
    if (e.message.match('duplicate key')) {
      req.flash('error', '用户名已被占用');
      return res.redirect('/signup');
    }
    return next(e);
  });
});

module.exports = router;
