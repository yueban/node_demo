const {
  Post,
} = require('../lib/mongo');
const CommentModel = require('./comments');
const marked = require('marked');

Post.plugin('contentToHtml', {
  afterFind: posts => posts.map((post) => {
    post.content = marked(post.content);
    return post;
  }),
  afterFindOne: (post) => {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  },
});

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: posts =>
    Promise.all(posts.map(post => CommentModel.getCommentsCount(post._id).then((count) => {
      post.commentsCount = count;
      return post;
    }))),
  afterFindOne: (post) => {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then((count) => {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  },
});

/**
 * 创建一篇文章
 * @param {string} post
 */
function create(post) {
  return Post.create(post).exec();
}

/**
 * 通过文章 id 获取一篇文章，文章内容 markdown 转换为 html
 * @param {string} postId
 */
function getPostById(postId) {
  return Post
    .findOne({
      _id: postId,
    })
    .populate({
      path: 'author',
      model: 'User',
    })
    .addCreatedAt()
    .addCommentsCount()
    .contentToHtml()
    .exec();
}

/**
 * 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
 * @param {string} author
 * @param {string} tag 标签
 * @param {int} page 页码
 * @param {int} pageSize 每页数量
 */
function getPosts(author, tag, page, pageSize) {
  const query = {};
  if (author) {
    query.author = author;
  }
  if (tag) {
    query.tags = {
      $in: [tag],
    };
  }
  return Post
    .find(query)
    .populate({
      path: 'author',
      model: 'User',
    })
    .sort({
      _id: -1,
    })
    .addCreatedAt()
    .addCommentsCount()
    .contentToHtml()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .exec();
}

/**
 * 通过文章 id 给 pv 加 1
 * @param {string} postId
 */
function incPv(postId) {
  return Post
    .update({
      _id: postId,
    }, {
      $inc: {
        pv: 1,
      },
    })
    .exec();
}

/**
 * 通过文章 id 获取一篇原生文章的原始数据（编辑文章）
 * @param {string} postId
 */
function getRawPostById(postId) {
  return Post
    .findOne({
      _id: postId,
    })
    .populate({
      path: 'author',
      model: 'User',
    })
    .exec();
}

/**
 * 通过文章 id 更新一篇文章
 * @param {string} postId
 * @param {object} data
 */
function updatePostById(postId, data) {
  return Post
    .update({
      _id: postId,
    }, {
      $set: data,
    })
    .exec();
}

/**
 * 通过文章 id 删除一篇文章
 * @param {string} postId
 */
function delPostById(postId) {
  return Post
    .deleteOne({
      _id: postId,
    })
    .exec()
    .then(result =>
      result.result.ok &&
      result.result.n > 0 &&
      CommentModel.delCommentsByPostId(postId));
}

/**
 * 获取作者创建的文章数量
 * @param {string} author
 * @param {string} tag 标签
 */
function getPostCount(author, tag) {
  const query = {};
  if (author) {
    query.author = author;
  }
  if (tag) {
    query.tags = {
      $in: [tag],
    };
  }
  return Post.count(query).exec();
}

module.exports = {
  create,
  getPostById,
  getPosts,
  incPv,
  getRawPostById,
  updatePostById,
  delPostById,
  getPostCount,
};
