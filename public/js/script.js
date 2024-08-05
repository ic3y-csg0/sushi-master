console.log('Welcome to Sushi Delivery!');

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const content = document.querySelector('.content');

    function updateContentMargin(extraMargin) {
        const headerHeight = header.offsetHeight;
        content.style.marginTop = `${headerHeight + extraMargin}px`; // Добавляем дополнительный отступ
    }

    // Обновить отступ при загрузке страницы
    updateContentMargin(10); 

  

    // Переменные для отслеживания состояния хедера
    let isSmallHeader = false;

    // Обработчик прокрутки
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 50 && !isSmallHeader) {
            header.classList.remove('large-header');
            header.classList.add('small-header');
            isSmallHeader = true;
            updateContentMargin(20); // Обновить отступ при изменении класса
           
        } else if (scrollPosition <= 50 && isSmallHeader) {
            header.classList.remove('small-header');
            header.classList.add('large-header');
            isSmallHeader = false;
            
           
        }
       
    });
});
