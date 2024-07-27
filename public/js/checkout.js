// public/checkout.js

document.addEventListener('DOMContentLoaded', () => {
    // Функция для получения данных корзины из localStorage
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || {};
    }

    // Функция для обновления отображения корзины на странице
    function updateCartDisplay() {
        const cart = getCart();
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        cartItems.innerHTML = '';
        let total = 0;

        for (const [id, item] of Object.entries(cart)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            cartItems.appendChild(listItem);
            total += item.price * item.quantity;
        }

        cartTotal.textContent = total.toFixed(2);
    }

    // Функция для инициализации автозаполнения адреса
    function initAutocomplete() {
        const addressInput = document.getElementById('address');
        if (!addressInput) {
            console.error('Address input element not found');
            return;
        }

        if (!window.google || !window.google.maps) {
            console.error('Google Maps API not loaded');
            return;
        }

        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
            types: ['address'],
            componentRestrictions: { country: 'nl' } // Ограниечение поиска по стране (например, Нидерланды)
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                console.error('No details available for input: ' + addressInput.value);
                return;
            }
            // Вы можете добавить дополнительные действия здесь, например, заполнение других полей
            console.log('Address details:', place);
        });
    }

    // Обновляем отображение корзины при загрузке страницы
    updateCartDisplay();
    
    // Инициализация автозаполнения после загрузки страницы
    initAutocomplete();

    // Обработчик отправки формы оформления заказа
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) {
        console.error('Checkout form not found');
        return;
    }

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Получение данных формы
        const formData = new FormData(checkoutForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Добавление данных корзины
        data.cart = getCart();

        // Отправка данных на сервер
        fetch('/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            // Очистка корзины после успешного заказа
            if (result.success) {
                localStorage.removeItem('cart');
                alert('Order placed successfully!');
                updateCartDisplay();
            } else {
                alert('Error placing order: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
