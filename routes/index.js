const express = require('express');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
    res.render('index');
});

// Страница меню
router.get('/menu', (req, res) => {
    res.render('menu');
});
router.get('/checkout', (req, res) => {
    res.render('checkout');
});
module.exports = router;
