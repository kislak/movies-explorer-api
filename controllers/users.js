const User = require('../models/user');

const STATUS_OK = 200;
const { NotFoundError } = require('../errors/not_found');
const { ConflictError } = require('../errors/conflict');
const { BadRequest } = require('../errors/bad_request');

const sendUser = (res, user) => {
  if (user) {
    return res.status(STATUS_OK).send(user);
  }
  throw new NotFoundError('Запрашиваемая каточка не найдена');
};

const getUser = (req, res, next) => {
  const id = req.user._id;

  return User.findById(id)
    .then((user) => sendUser(res, user))
    .catch(next);
};

const patchUser = (req, res, next) => {
  const id = req.user._id;
  const {
    name,
    email,
  } = req.body;


  if (!name && !email) {
    return next(new BadRequest('Не переданы новое имя или почтовый ящик'));
  }

  return User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => sendUser(res, user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  patchUser,
};
