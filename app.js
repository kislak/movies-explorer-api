require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

const express = require('express');
const mongoose = require('mongoose');


const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const authRouter = require('./routes/auth');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error_handler');


const app = express();

mongoose.connect(MONGO_URL, { useNewUrlParser: true });


app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => res.send('Ответ на сигнал из далёкого космоса'));
app.use('/', authRouter);
app.use(auth);
app.post('/secret', (req, res) => res.send('welcome to the club!'));


app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('server is up and running');
});
