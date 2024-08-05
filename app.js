const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');
const fetch = require('node-fetch'); // Используем fetch для запросов к Telegram API
const axios = require('axios'); // Добавляем axios для запросов к Google Maps API
const TELEGRAM_BOT_TOKEN = '6481416670:AAEAqVPq6cd2CsrZDkePAM-nQA_d-8NCaOQ';
const CHAT_IDS = ['-1002207814534', '600274145'];
// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', indexRouter)
app.use(bodyParser.json());
// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));
// Функция для получения адресов из Google Maps
async function getAddresses() {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: 'addresses in Amsterdam',
                key: 'AIzaSyDeuo2rrHzxhKITRd7TGDaQcvpywGFxvzc' // Замените на ваш API-ключ
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching addresses from Google Maps:', error);
        throw error;
    }
}
// Маршрут для обработки данных заказа
app.post('/place-order', async (req, res) => {
    const orderData = req.body;

    console.log('Received order data:', orderData);

    // Формирование читаемого сообщения для корзины
    const formattedCartItems = Object.entries(orderData.cart).map(([id, item]) => {
        return `${item.name} - $${item.price} x ${item.quantity}`;
    }).join('\n');

    // Формирование сообщения для отправки в Telegram
    const message = `
*Новый заказ:*
Имя: ${orderData.name}
Адрес: ${orderData.address}
Email: ${orderData.email}
Корзина:
${formattedCartItems}
`;

    try {
        // Отправка сообщения каждому чату
        const sendMessagePromises = CHAT_IDS.map(chatId => {
            console.log(`Sending message to chat ID: ${chatId}`);
            return fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'Markdown' // Или 'HTML', в зависимости от того, какой формат вы предпочитаете
                })
            });
        });

        // Ожидание выполнения всех запросов
        const responses = await Promise.all(sendMessagePromises);

        // Проверка результатов всех запросов
        const results = await Promise.all(responses.map(response => response.json()));

        const allSuccess = results.every(result => result.ok);

        if (allSuccess) {
            console.log('All messages sent successfully');
            res.json({ success: true, message: 'Order placed successfully and sent to Telegram!' });
        } else {
            console.log('Failed to send some messages');
            res.json({ success: false, message: 'Failed to send order to some Telegram chats.' });
        }
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.json({ success: false, message: 'Error placing order.' });
    }
});

module.exports = app;
