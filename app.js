const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутизатора
app.use('/', indexRouter);

module.exports = app;
