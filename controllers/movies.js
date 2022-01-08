const Movie = require('../models/movie');

const STATUS_OK = 200;

const { NotFoundError } = require('../errors/not_found');
const { ForbiddenError } = require('../errors/forbidden');

const sendMovie = (res, movie) => {
  if (movie) {
    return res.status(STATUS_OK).send(movie);
  }
  throw new NotFoundError('Запрашиваемая каточка не найдена');
};

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(STATUS_OK).send(movies))
  .catch(next);

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id
  }).then((result) => sendMovie(res, result))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findOne({ _id: id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Пользоватьель не авторизован'));
      }

      return movie.delete().then((result) => sendMovie(res, result));
    }).catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
