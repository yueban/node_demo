const express = require('express');
const {
  checkLogin,
} = require('../middlewares/check');
const PostModel = require('../models/posts');
const CommentModel = require('../models/comments');

const router = express.Router();
const pageSize = 10;

router.get('/', (req, res, next) => {
  const {
    author,
    page: pageStr = '1',
    tag,
  } = req.query;
  const page = Number(pageStr);

  Promise.all([PostModel.getPosts(author, tag, page, pageSize),
    PostModel.getPostCount(author, tag),
  ]).then((result) => {
    const [posts, count] = result;
    const pageCount = Math.ceil(count / pageSize);
    const isFirstPage = page === 1;
    const isLastPage = page === pageCount;

    res.render('posts.pug', {
      posts,
      page,
      isFirstPage,
      isLastPage,
      pageCount,
    });
  }).catch(next);
});

router.post('/create', checkLogin, (req, res, next) => {
  const {
    _id: author,
  } = req.session.user;
  const {
    title,
    content,
    tags: tagsStr,
  } = req.fields;
  let tags = [];
  if (tagsStr && tagsStr.trim() !== '') {
    tags = tagsStr.trim().split(',').map(tag => tag.trim()).filter(((value, index, self) => value !== '' && self.indexOf(value) === index));
  }
  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  let post = {
    author,
    title,
    content,
    tags,
  };

  return PostModel.create(post).then((result) => {
    [post] = result.ops;
    req.flash('success', '发表成功');
    res.redirect(`/posts/${post._id}`);
  }).catch(next);
});

router.get('/create', checkLogin, (req, res) => {
  res.render('create.pug');
});

router.get('/:postId', (req, res, next) => {
  const {
    postId,
  } = req.params;
  const {
    page: pageStr = '1',
  } = req.query;
  const page = Number(pageStr);

  Promise.all([
    PostModel.getPostById(postId), // 获取文章信息
    CommentModel.getComments(postId, page, pageSize), // 获取文章留言
    PostModel.incPv(postId), // 阅读数+1
  ]).then((result) => {
    const [post, comments] = result;
    const pageCount = Math.ceil(post.commentsCount / pageSize);
    const isFirstPage = page === 1;
    const isLastPage = page === pageCount;

    if (!post) {
      throw new Error('该文章不存在');
    }

    // 将二级评论结构拍平为一级列表
    const allComments = [];
    comments.forEach((comment) => {
      allComments.push(comment);
      if (comment.childComments) {
        comment.childComments.forEach((childComment) => {
          allComments.push(childComment);
        });
      }
    });

    console.log(allComments);

    res.render('post.pug', {
      post,
      comments: allComments,
      page,
      isFirstPage,
      isLastPage,
      pageCount,
    });
  }).catch(next);
});

router.post('/:postId/edit', checkLogin, (req, res, next) => {
  const {
    postId,
  } = req.params;
  const {
    _id: author,
  } = req.session.user;
  const {
    title,
    content,
    tags: tagsStr,
  } = req.fields;
  let tags = [];
  if (tagsStr && tagsStr.trim() !== '') {
    tags = tagsStr.trim().split(',').map(tag => tag.trim()).filter((value, index, self) => value !== '' && self.indexOf(value) === index);
  }
  // 校验参数
  try {
    if (!title.length) {
      throw new Error('请填写标题');
    }
    if (!content.length) {
      throw new Error('请填写内容');
    }
  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }

  return PostModel.getRawPostById(postId).then((post) => {
    if (!post) {
      throw new Error('文章不存在');
    }
    if (author.toString() !== post.author._id.toString()) {
      throw new Error('权限不足');
    }
    PostModel.updatePostById(postId, {
      title,
      content,
      tags,
    }).then(() => {
      req.flash('success', '编辑文章成功');
      // 跳转到文章详情页
      res.redirect(`/posts/${postId}`);
    }).catch(next);
  }).catch(next);
});

router.get('/:postId/edit', checkLogin, (req, res, next) => {
  const {
    postId,
  } = req.params;
  const {
    _id: author,
  } = req.session.user;

  PostModel.getRawPostById(postId).then((post) => {
    if (!post) {
      throw new Error('文章不存在');
    }
    if (author.toString() !== post.author._id.toString()) {
      throw new Error('权限不足');
    }
    res.render('edit.pug', {
      post,
    });
  }).catch(next);
});

router.get('/:postId/remove', checkLogin, (req, res, next) => {
  const {
    postId,
  } = req.params;
  const {
    _id: author,
  } = req.session.user;

  PostModel.getRawPostById(postId)
    .then((post) => {
      if (!post) {
        throw new Error('文章不存在');
      }
      if (author.toString() !== post.author._id.toString()) {
        throw new Error('权限不足');
      }

      PostModel.delPostById(postId).then(() => {
        req.flash('success', '删除文章成功');
        // 跳转回主页
        res.redirect('/posts');
      }).catch(next);
    }).catch(next);
});

module.exports = router;
