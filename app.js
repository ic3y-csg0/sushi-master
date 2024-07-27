const express = require('express');
const path = require('path');
const app = express();
const indexRouter = require('./routes/index');
const port = 3000;
// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Подключение маршрутизатора
app.use('/', indexRouter);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on http://0.0.0.0:3000');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

