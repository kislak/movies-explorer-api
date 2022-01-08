const User = require('../models/user');
const STATUS_OK = 200;
const { NotFoundError } = require('../errors/not_found');
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

  return User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => sendUser(res, user))
    .catch(next);
};

module.exports = {
  getUser,
  patchUser
};
