const {
  User,
} = require('../lib/mongo');

function create(user) {
  return User.create(user).exec();
}

function getUserByName(name) {
  return User.findOne({
    name,
  }).addCreatedAt().exec();
}

module.exports = {
  create,
  getUserByName,
};
