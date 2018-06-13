const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const formidable = require('express-formidable');
const routes = require('./routes');
const pkg = require('./package.json');
const winston = require('winston');
const expressWinston = require('express-winston');

const app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));

// 模板引擎
app.set('view engine', 'ejs');
app.set('view engine', 'pug');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge,
  },
  store: new MongoStore({
    url: config.mongodb,
  }),
}));
// flash 中间件，用来显示通知
app.use(flash());
// 处理表单及文件上传的中间件
app.use(formidable({
  uploadDir: path.join(__dirname, 'public/img'), // 上传文件目录
  keepExtensions: true,
}));

// 设置模板全局变量
app.locals.blog = {
  title: pkg.name,
  description: pkg.description,
};

// 添加模板必须的三个变量
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

// 正常请求的日志
// 被 require，则不输出日志
if (!module.parent) {
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        filename: path.join(__dirname, 'logs/success.log'),
      }),
    ],
  }));
}

// 路由
routes(app);

// 错误日志
// 被 require，则不输出日志
if (!module.parent) {
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        filename: path.join(__dirname, 'logs/error.log'),
      }),
    ],
  }));
}

// 错误处理
app.use((err, req, res, next) => {
  req.flash('error', err.message);
  res.redirect('/posts');
});

if (module.parent) {
  // 被 require，则导出 app
  module.exports = app;
} else {
  app.listen(config.port, () => {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
