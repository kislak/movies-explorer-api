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

router.get('/movies/', getMovies);
router.post('/movies/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().messages({"any.required": "ошибка на русском"}),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator),
    trailer: Joi.string().required().custom(urlValidator),
    thumbnail: Joi.string().required().custom(urlValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:id', idValidator, deleteMovie);

module.exports = router;
