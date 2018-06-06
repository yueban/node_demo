const marked = require('marked');
const {
  Comment,
} = require('../lib/mongo');

Comment.plugin('contentToHtml', {
  afterFind: comments => comments.map((comment) => {
    comment.content = marked(comment.content);
    return comment;
  }),
});

/**
 * 创建一个留言
 * @param {object} comment
 */
function create(comment) {
  return Comment.create(comment).exec();
}

/**
 * 通过留言 id 获取一个留言
 * @param {string} commentId
 */
function getCommentById(commentId) {
  return Comment.findOne({
    _id: commentId,
  }).exec();
}

/**
 * 通过留言 id 删除一个留言
 * @param {string} commentId
 */
function delCommentById(commentId) {
  return Comment.deleteOne({
    _id: commentId,
  }).exec();
}

/**
 * 删除一个文章下的所有留言
 * @param {string} postId
 */
function delCommentsByPostId(postId) {
  return Comment.deleteMany({
    postId,
  }).exec();
}

/**
 * 获取一篇文章下所有留言
 * @param {string} postId
 */
function getComments(postId) {
  return Comment
    .find({
      postId,
    })
    .populate({
      path: 'author',
      model: 'User',
    })
    .sort({
      _id: 1,
    })
    .addCreatedAt()
    .contentToHtml()
    .exec();
}

/**
 * 获取一篇文章下的评论数
 * @param {string} postId
 */
function getCommentsCount(postId) {
  return Comment.count({
    postId,
  }).exec();
}

module.exports = {
  create,
  getCommentById,
  delCommentById,
  delCommentsByPostId,
  getComments,
  getCommentsCount,
};
