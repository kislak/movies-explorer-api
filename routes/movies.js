const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { urlValidator } = require('./joi_custom_validators');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const idValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
});

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:id', idValidator, deleteMovie);

module.exports = router;
