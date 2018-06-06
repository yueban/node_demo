const signUp = require('./signup');
const signIn = require('./signin');
const signOut = require('./signout');
const posts = require('./posts');
const comments = require('./comments');

module.exports = function getApp(app) {
  app.get('/', (req, res) => {
    res.redirect('/posts');
  });
  app.use('/signup', signUp);
  app.use('/signin', signIn);
  app.use('/signout', signOut);
  app.use('/posts', posts);
  app.use('/comments', comments);
  app.use((req, res) => {
    if (!res.headersSent) {
      res.status(404).render('404');
    }
  });
};
