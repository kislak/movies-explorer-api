const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  patchUser,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), patchUser);

module.exports = router;
