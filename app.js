require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
  CORS_ORIGIN = "http://localhost:3000",
  NODE_ENV = 'development',
} = process.env;

const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error_handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const whitelist = CORS_ORIGIN.split(' ');
const corsOptions = {
  origin(origin, callback) {
    if(!origin) return callback(null, true);

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

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/api/', (req, res) => res.send({ message: 'Ответ на сигнал из далёкого космоса' }));
app.use('/api/', authRouter);
app.use(auth);
app.use('/api/', usersRouter);
app.use('/api/', moviesRouter);
app.get('/api/secret', (req, res) => res.send({ message: 'welcome to the club!' }));

app.use((req, res) => {
  res.status(404).send({ message: 'запрошенный ресурс не найден' });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('server is up and running');
});
