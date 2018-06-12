const path = require('path');
const assert = require('assert');
const request = require('supertest');
const app = require('../index');
const {
  User,
} = require('../lib/mongo');

const testName1 = 'testName1';
const testName2 = 'nswbmw';
describe('signup', () => {
  describe('POST /signup', () => {
    const agent = request.agent(app); // persist cookie when redirect

    beforeEach((done) => {
      // 创建测试用户
      User.create({
        name: testName1,
        password: '123456',
        avatar: '',
        gender: 'x',
        bio: '',
      }).exec().then(() => {
        done();
      }).catch(done);
    });

    afterEach((done) => {
      // 删除测试用户
      User.deleteMany({
        name: {
          $in: [testName1, testName2],
        },
      }).exec().then(() => {
        done();
      }).catch(done);
    });

    after((done) => {
      // 测试结束后结束进程
      process.exit();
    });

    // 用户名错误的情况
    it('wrong name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({
          name: '',
        })
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/姓名请限制在 1-10 个字符/));
          return done();
        });
    });

    // 性别错误的情况
    it('wrong gender', (done) => {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .field({
          name: testName2,
          gender: 'a',
        })
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/性别只能是 m、f 或 x/));
          return done();
        });
    });

    // TODO 其余的参数测试自行补充

    // 用户名被占用的情况
    it('duplicate name', (done) => {
      agent
        .post('/signup')
        .type('form')
        .field({
          name: testName1,
          gender: 'm',
          bio: 'noder',
          password: '123456',
          repassword: '123456',
        })
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          // console.log(res.text);

          assert(res.text.match(/用户名已被占用/));
          return done();
        });
    });

    // 注册成功的情况
    it('success', (done) => {
      agent
        .post('/signup')
        .type('form')
        .field({
          name: testName2,
          gender: 'm',
          bio: 'noder',
          password: '123456',
          repassword: '123456',
        })
        .attach('avatar', path.join(__dirname, 'avatar.png'))
        .redirects()
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          assert(res.text.match(/注册成功/));
          return done();
        });
    });
  });
});
