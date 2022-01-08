require('dotenv').config();

const {
  PORT = 3000,
  CORS_ORIGIN = '',
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
  NODE_ENV = 'development',
} = process.env;

const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error_handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

if (CORS_ORIGIN) {
  const cors = require('cors');
  const whitelist = CORS_ORIGIN.split(' ');
  const corsOptions = {
    origin(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
}

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/', (req, res) => res.send('Ответ на сигнал из далёкого космоса'));
app.use('/', authRouter);
app.use(auth);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.get('/secret', (req, res) => res.send('welcome to the club!'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('server is up and running');
});
