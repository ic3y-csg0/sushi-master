document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('sushiModal');
    const closeModal = modal.querySelector('.close');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal1-title');
    const modalPrice = modal.querySelector('.modal1-price');
    const modalDetails = modal.querySelector('.modal1-details');

    // Функция для открытия модального окна
    function openModal(event) {
        // Убедитесь, что это клик на карточке, а не на кнопке "+"
        if (event.target.classList.contains('add-button')) return;

        const sushiItem = event.currentTarget;
        const imgSrc = sushiItem.querySelector('img').src;
        const title = sushiItem.querySelector('h2').textContent;
        const price = sushiItem.querySelector('.price').textContent;
        const details = sushiItem.getAttribute('data-details'); // Извлечение данных из атрибута

        modalImage.src = imgSrc;
        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalDetails.textContent = details;

        modal.classList.add('show'); // Показ модального окна
    }

    // Функция для закрытия модального окна
    function closeModalHandler() {
        modal.classList.remove('show'); // Скрытие модального окна
    }

    // Обработчик кликов по карточкам суши для открытия модального окна
    document.querySelectorAll('.sushi-item').forEach(item => {
        item.addEventListener('click', openModal);
    });

    // Закрытие модального окна при клике на кнопку закрытия
    closeModal.addEventListener('click', closeModalHandler);

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalHandler();
        }
    });

    // Обработчик кликов по кнопкам "плюс" для добавления товаров в корзину
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function(event) {
            // Предотвращаем всплытие события клика на карточку
            event.stopPropagation();

            const itemId = this.getAttribute('data-item-id');
            const itemName = this.getAttribute('data-item-name');
            const itemPrice = parseFloat(this.getAttribute('data-item-price'));

            // Добавляем или обновляем товар в корзине
            if (cart[itemId]) {
                cart[itemId].quantity += 1;
            } else {
                cart[itemId] = { name: itemName, price: itemPrice, quantity: 1 };
            }

            // Обновляем отображение корзины
            updateCart();
        });
    });

    const cart = {}; // Объект для хранения данных корзины

    // Функция для обновления содержимого корзины
    function updateCart() {
        const cartModalBody = document.querySelector('#cartModal .modal-body');
        cartModalBody.innerHTML = ''; // Очищаем текущее содержимое корзины

        let total = 0;

        if (Object.keys(cart).length === 0) {
            cartModalBody.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            const list = document.createElement('ul');
            for (const [id, item] of Object.entries(cart)) {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
                list.appendChild(listItem);
                total += item.price * item.quantity;
            }

            cartModalBody.appendChild(list);
            const totalElement = document.createElement('p');
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
            cartModalBody.appendChild(totalElement);
        }
    }
});

