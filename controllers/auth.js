const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const STATUS_OK = 200;
const { JWT_SECRET = 'some-secret-key' } = process.env;

const { UnauthorizedError } = require('../errors/unauthorized');
const { ConflictError } = require('../errors/conflict');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((encryptedPassword) => User.create({
      name,
      email,
      password: encryptedPassword,
    }))
    .then(() => res.status(STATUS_OK).send({ message: 'Пользователь успешно зарегистрирован!' }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(err.message));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ message: 'Аутентификация прошла успешно!' });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

const signout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'аревуар!' });
};

module.exports = {
  createUser,
  login,
  signout,
};
