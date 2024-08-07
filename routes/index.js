const express = require('express');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Страница меню
router.get('/menu', (req, res) => {
    res.render('menu');
});
router.get('/checkout', (req, res) => {
    res.render('checkout', { title: 'Checkout' });
});
router.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin' });
});
module.exports = router;
