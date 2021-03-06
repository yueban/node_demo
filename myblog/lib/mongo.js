const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const mongolass = new Mongolass();

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: (results) => {
    results.forEach((item) => {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: (result) => {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  },
});

mongolass.connect(config.mongodb, {
  useNewUrlParser: true,
});

// 用户表
const User = mongolass.model('User', {
  name: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  avatar: {
    type: 'string',
    required: true,
  },
  gender: {
    type: 'string',
    enum: ['m', 'f', 'x'],
    default: 'x',
  },
  bio: {
    type: 'string',
    required: true,
  },
});

User.index({
  name: 1,
}, {
  unique: true,
}).exec();


// 文章表
const Post = mongolass.model('Post', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true,
  },
  title: {
    type: 'string',
    required: true,
  },
  content: {
    type: 'string',
    required: true,
  },
  pv: {
    type: 'number',
    default: 0,
  },
  tags: [{
    type: 'string',
  }],
});

Post.index({
  author: 1,
  _id: -1,
}).exec();

// 评论表
const Comment = mongolass.model('Comment', {
  author: {
    type: Mongolass.Types.ObjectId,
    required: true,
  },
  content: {
    type: 'string',
    required: true,
  },
  postId: {
    type: Mongolass.Types.ObjectId,
    required: true,
  },
  parentId: {
    type: Mongolass.Types.ObjectId,
    required: false,
  },
  replyId: {
    type: Mongolass.Types.ObjectId,
    required: false,
  },
});
// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
Comment.index({
  postId: 1,
  _id: 1,
}).exec();

module.exports = {
  User,
  Post,
  Comment,
};
