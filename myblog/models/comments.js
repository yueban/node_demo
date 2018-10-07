const marked = require('marked');
const {
  Comment,
} = require('../lib/mongo');

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
  return Comment
    .findOne({
      _id: commentId,
    })
    .populate({
      path: 'author',
      model: 'User',
    })
    .exec();
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
 * @param {int} page 页码
 * @param {int} pageSize 每页数量
 */
function getComments(postId, page, pageSize) {
  const query = {};
  query.postId = postId;
  query.parentId = null;
  return Comment
    .find(query)
    .populate({
      path: 'author',
      model: 'User',
    })
    .sort({
      _id: 1,
    })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .addCreatedAt()
    .contentToHtml()
    .addChildComments()
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

/**
 * 获取一条评论下的所有子评论
 * @param {string} parentId 父评论 id
 */
function getCommentsByParentId(parentId) {
  return Comment
    .find({
      parentId,
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
    .addReplyComment()
    .exec();
}

Comment.plugin('contentToHtml', {
  afterFind: comments => comments.map((comment) => {
    comment.content = marked(comment.content);
    return comment;
  }),
});
Comment.plugin('addReplyComment', {
  afterFind: comments => Promise
    .all(comments.map((comment) => {
      if (comment.replyId) {
        return getCommentById(comment.replyId).then((replyComment) => {
          comment.replyComment = replyComment;
          return comment;
        });
      }
      return comment;
    })),
  afterFindOne: (comment) => {
    if (comment && comment.replyId) {
      return getCommentById(comment.replyId).then((replyComment) => {
        comment.replyComment = replyComment;
        return comment;
      });
    }
    return comment;
  },
});
Comment.plugin('addChildComments', {
  afterFind: comments => Promise
    .all(comments.map(comment => getCommentsByParentId(comment._id).then((childComments) => {
      comment.childComments = childComments;
      return comment;
    }))),
  afterFindOne: (comment) => {
    if (comment) {
      return getCommentsByParentId(comment._id).then((childComments) => {
        comment.childComments = childComments;
        return comment;
      });
    }
    return comment;
  },
});

module.exports = {
  create,
  getCommentById,
  delCommentById,
  delCommentsByPostId,
  getComments,
  getCommentsCount,
};
