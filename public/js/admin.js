document.addEventListener("DOMContentLoaded", function() {
    // Функция для обновления списка суши
    function updateSushiList() {
        fetch('/sushi.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const sushiList = document.getElementById('sushiList');
                const categorySelect = document.getElementById('categorySelect');
                sushiList.innerHTML = ''; // Очищаем список перед добавлением новых элементов
                categorySelect.innerHTML = ''; // Очищаем список категорий

                // Добавляем категории в выпадающий список
                data.categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);

                    // Добавляем суши по категориям
                    category.items.forEach(item => {
                        const sushiItem = document.createElement('div');
                        sushiItem.classList.add('sushi-item');
                        sushiItem.setAttribute('data-id', item.id);

                        sushiItem.innerHTML = `
                            <div class="sushi-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="sushi-details">
                                <h2>${item.name}</h2>
                                <p class="price">$${item.price}</p>
                                <p>${item.details}</p>
                                <p class="weight">Weight: ${item.weight}</p>
                                <p class="category">Category: ${category.name}</p>
                                <button class="delete-button">Delete</button>
                            </div>
                        `;

                        sushiItem.querySelector('.delete-button').addEventListener('click', function(event) {
                            event.stopPropagation(); // Предотвращаем всплытие события клика по элементу списка
                            fetch(`/delete-sushi/${item.id}`, { method: 'DELETE' })
                                .then(response => response.json())
                                .then(data => {
                                    alert('Sushi deleted!');
                                    updateSushiList(); // Обновляем список после удаления
                                })
                                .catch(error => console.error('Error deleting sushi:', error));
                        });

                        sushiItem.addEventListener('click', function() {
                            document.getElementById('editId').value = item.id;
                            document.getElementById('name').value = item.name;
                            document.getElementById('price').value = item.price;
                            document.getElementById('details').value = item.details;
                            document.getElementById('image').value = item.image;
                            document.getElementById('weight').value = item.weight;
                            document.getElementById('categorySelect').value = category.name;
                        });

                        sushiList.appendChild(sushiItem);
                    });
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Обновляем список суши при загрузке страницы
    updateSushiList();

    // Обработчик отправки формы
    const form = document.getElementById('sushiForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('editId').value || Date.now().toString();
        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const details = document.getElementById('details').value;
        const image = document.getElementById('image').value;
        const weight = document.getElementById('weight').value;
        const category = document.getElementById('categorySelect').value;
        const newItem = { id, name, price, details, image, weight, category };

        fetch('/update-sushi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        })
        .then(response => response.json())
        .then(data => {
            alert('Sushi saved!');
            updateSushiList(); // Обновляем список после сохранения
        })
        .catch(error => console.error('Error saving sushi:', error));
    });
});
