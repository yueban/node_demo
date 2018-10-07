const express = require('express');
const {
  checkLogin,
} = require('../middlewares/check');
const CommentModel = require('../models/comments');

const router = express.Router();

router.post('/', checkLogin, (req, res, next) => {
  const {
    _id: author,
  } = req.session.user;
  const {
    postId,
    content,
    parentId,
    replyId,
  } = req.fields;

  // 校验参数
  try {
    if (!content.length) {
      throw new Error('请填写留言内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  const comment = {
    author,
    postId,
    content,
    parentId,
    replyId,
  };
  return CommentModel.create(comment).then(() => {
    req.flash('success', '留言成功');
    res.redirect('back');
  }).catch(next);
});

router.get('/:commentId/remove', checkLogin, (req, res, next) => {
  const {
    commentId,
  } = req.params;
  const {
    _id: author,
  } = req.session.user;
  CommentModel.getCommentById(commentId).then((comment) => {
    if (!comment) {
      throw new Error('留言不存在');
    }
    if (author.toString() !== comment.author._id.toString()) {
      throw new Error('权限不足');
    }
    CommentModel.delCommentById(comment._id).then(() => {
      req.flash('success', '删除留言成功');
      res.redirect('back');
    }).catch(next);
  }).catch(next);
});

module.exports = router;
