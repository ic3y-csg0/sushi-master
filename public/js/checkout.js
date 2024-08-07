document.addEventListener("DOMContentLoaded", function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    function updateCart() {
        const cartModalBody = document.querySelector('#cartModal .modal-body');
        console.log('cartModalBody:', cartModalBody); // Debug log
        if (!cartModalBody) {
            console.error('cartModalBody not found');
            return;
        }

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
        setupDeleteButtons();
    }

    function setupDeleteButtons() {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                deleteItemHandler(itemId);
            });
        });
    }

    function deleteItemHandler(itemId) {
        if (itemId && cart[itemId]) {
            delete cart[itemId];
            updateCart();
        }
    }

    function addToCart(itemId, itemName, itemPrice) {
        if (cart[itemId]) {
            cart[itemId].quantity += 1;
        } else {
            cart[itemId] = { name: itemName, price: itemPrice, quantity: 1 };
        }
        updateCart();
    }

    function setupAddButtons() {
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', function(event) {
                event.stopPropagation();
                const itemId = this.getAttribute('data-item-id');
                const itemName = this.getAttribute('data-item-name');
                const itemPrice = parseFloat(this.getAttribute('data-item-price'));
                addToCart(itemId, itemName, itemPrice);
            });
        });
    }

    const sushiContainer = document.getElementById('sushiContainer');
    console.log('sushiContainer:', sushiContainer); // Debug log

    const addSushi = (data) => {
        sushiContainer.innerHTML = ''; // Clear the container

        data.categories.forEach(category => {
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category-container');

            const categoryHeader = document.createElement('h1');
            categoryHeader.textContent = category.name;
            categoryHeader.classList.add('category-header');
            categoryContainer.appendChild(categoryHeader);

            category.items.forEach(item => {
                const sushiDiv = document.createElement('div');
                sushiDiv.classList.add('sushi-item');
                sushiDiv.setAttribute('data-item-id', item.id);
                sushiDiv.setAttribute('data-item-name', item.name);
                sushiDiv.setAttribute('data-item-price', item.price);
                sushiDiv.setAttribute('data-details', item.details);
                sushiDiv.setAttribute('data-weight', item.weight);

                sushiDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="sushi-image">
                    <div class="weight-container">
                        <p class="weight">${item.weight}</p>
                    </div>
                    <div class="sushi-content">
                        <h2>${item.name}</h2>
                        <p class="details">${item.details}</p>
                        <p class="price">$${item.price}</p>
                        <button class="add-button" data-item-id="${item.id}" data-item-name="${item.name}" data-item-price="${item.price}">Add to Cart</button>
                    </div>
                `;

                categoryContainer.appendChild(sushiDiv);
            });

            sushiContainer.appendChild(categoryContainer);
        });

        setupAddButtons();
    };

    fetch('/sushi.json')
        .then(response => response.json())
        .then(data => {
            addSushi(data);
        });

    const modal = document.getElementById('sushiModal');
    console.log('modal:', modal); // Debug log
    if (!modal) {
        console.error('modal not found');
        return;
    }
    
    const closeModal = modal.querySelector('.close');
    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal1-title');
    const modalPrice = modal.querySelector('.modal1-price');
    const modalDetails = modal.querySelector('.modal1-details');
    
    if (!closeModal || !modalImage || !modalTitle || !modalPrice || !modalDetails) {
        console.error('One or more modal elements not found');
        return;
    }

    let currentItemId;

    function openModal(event) {
        if (event.target.classList.contains('add-button')) return;

        const sushiItem = event.currentTarget;
        const imgSrc = sushiItem.querySelector('img').src;
        const title = sushiItem.querySelector('h2').textContent;
        const price = sushiItem.querySelector('.price').textContent;
        const details = sushiItem.querySelector('[data-details]').textContent;
        currentItemId = sushiItem.getAttribute('data-item-id');

        modalImage.src = imgSrc;
        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalDetails.textContent = details;

        modal.classList.add('show');
    }

    function closeModalHandler() {
        modal.classList.remove('show');
    }

    closeModal.addEventListener('click', closeModalHandler);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalHandler();
        }
    });

    updateCart();
});
