document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('sushiModal');
    const closeModal = modal.querySelector('.close');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal1-title');
    const modalPrice = modal.querySelector('.modal1-price');
    const modalDetails = modal.querySelector('.modal1-details');

    // Переменная для хранения ID текущего элемента
    let currentItemId; 

    // Функция для открытия модального окна
    function openModal(event) {
        if (event.target.classList.contains('add-button')) return;

        const sushiItem = event.currentTarget;
        const imgSrc = sushiItem.querySelector('img').src;
        const title = sushiItem.querySelector('h2').textContent;
        const price = sushiItem.querySelector('.price').textContent;
        const details = sushiItem.getAttribute('data-details');
        currentItemId = sushiItem.getAttribute('data-item-id'); // Извлечение ID элемента

        modalImage.src = imgSrc;
        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalDetails.textContent = details;

        modal.classList.add('show');
    }

    // Функция для закрытия модального окна
    function closeModalHandler() {
        modal.classList.remove('show');
    }

    // Функция для удаления элемента из корзины
    function deleteItemHandler(itemId) {
        if (itemId && cart[itemId]) {
            delete cart[itemId];
            updateCart();
            closeModalHandler();
        }
    }

    // Обработчик кликов по карточкам суши для открытия модального окна
    document.querySelectorAll('.sushi-item').forEach(item => {
        item.addEventListener('click', openModal);
    });

    closeModal.addEventListener('click', closeModalHandler);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalHandler();
        }
    });

    // Устанавливаем обработчик клика для всех кнопок удаления в корзине
    function setupDeleteButtons() {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                deleteItemHandler(itemId);
            });
        });
    }

    // Инициализация корзины
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Функция для обновления содержимого корзины
    function updateCart() {
        const cartModalBody = document.querySelector('#cartModal .modal-body');
        cartModalBody.innerHTML = '';

        let total = 0;

        if (Object.keys(cart).length === 0) {
            cartModalBody.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            const list = document.createElement('ul');
            for (const [id, item] of Object.entries(cart)) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${item.name} - $${item.price} x ${item.quantity}
                    <button class="btn btn-danger btn-sm delete-button" data-item-id="${id}">Remove</button>
                `;
                list.appendChild(listItem);
                total += item.price * item.quantity;
            }
            cartModalBody.appendChild(list);
            const totalElement = document.createElement('p');
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
            cartModalBody.appendChild(totalElement);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Устанавливаем обработчики для кнопок удаления
        setupDeleteButtons();
    }

    // Обработчик кликов по кнопкам "плюс" для добавления товаров в корзину
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function(event) {
            event.stopPropagation();

            const itemId = this.getAttribute('data-item-id');
            const itemName = this.getAttribute('data-item-name');
            const itemPrice = parseFloat(this.getAttribute('data-item-price'));

            if (cart[itemId]) {
                cart[itemId].quantity += 1;
            } else {
                cart[itemId] = { name: itemName, price: itemPrice, quantity: 1 };
            }

            updateCart();
        });
    });

    updateCart();
});
