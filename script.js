document.addEventListener('DOMContentLoaded', function() {
    // ============================================================
    // 2. ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК «КАТАЛОГ» / «СКИДКИ»
    // ============================================================
    // Находим все элементы, которые являются кнопками-заголовками вкладок
    const tabLinks = document.querySelectorAll('.tab-link');
    // Находим все панели с содержимым вкладок
    const tabContents = document.querySelectorAll('.tab-content');
    // Функция переключения на указанную вкладку
    // Принимает имя вкладки (catalog или discounts)
    function switchTab(tabName) {
        // Шаг 1: Скрываем все вкладки (убираем класс 'active' у всех панелей)
        // и снимаем активный класс со всех кнопок
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        // Шаг 2: Находим кнопку, у которой атрибут data-tab равен переданному имени
        // и добавляем ей класс 'active' (подсвечиваем)
        const activeLink = document.querySelector(`.tab-link[data-tab="${tabName}"]`);
        if (activeLink) activeLink.classList.add('active');
        // Шаг 3: Находим панель с id="tab-имя" и добавляем ей класс 'active' (показываем)
        const activeContent = document.getElementById(`tab-${tabName}`);
        if (activeContent) activeContent.classList.add('active');
    }
    // Для каждой кнопки-вкладки вешаем обработчик клика,
    // который вызывает switchTab с именем вкладки из атрибута data-tab
    tabLinks.forEach(link => {
        link.addEventListener('click', () => switchTab(link.getAttribute('data-tab')));
    });
    // ============================================================
    // 3. АККОРДЕОН ДЛЯ ЧАСТО ЗАДАВАЕМЫХ ВОПРОСОВ (FAQ)
    // ============================================================
    // Находим все блоки вопрос-ответ (каждый содержит кнопку с вопросом и блок с ответом)
    const faqItems = document.querySelectorAll('.faq-item');
    // Для каждого блока находим кнопку-заголовок и вешаем обработчик клика
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        // При клике переключаем класс 'active' у родительского блока .faq-item
        // CSS обрабатывает видимость ответа через max-height и overflow
        btn.addEventListener('click', () => item.classList.toggle('active'));
    });
    // ============================================================
    // 4. АНИМАЦИЯ ФОНОВЫХ ПУЗЫРЬКОВ
    // ============================================================
    // Контейнер, в который будут добавляться пузырьки (div#bubblesContainer)
    const container = document.getElementById('bubblesContainer');
    // Массивы для хранения ссылок на созданные элементы
    let staticBubbles = [];   // статические пузырьки (неподвижные)
    let animatedBubbles = []; // анимированные пузырьки (движущиеся)
    let isAnimating = false;  // флаг: включена ли анимация (true – да, false – нет)
    const BUBBLES_COUNT = 36; // общее количество пузырьков на фоне
    // 4.1. Функция создания статических пузырьков
    function createStaticBubbles() {
        // Очищаем контейнер от предыдущих элементов
        container.innerHTML = '';
        // Создаём BUBBLES_COUNT пузырьков
        for (let i = 0; i < BUBBLES_COUNT; i++) {
            // Создаём новый div-элемент
            const bubble = document.createElement('div');
            // Задаём класс 'bubble-static' – CSS задаёт внешний вид
            bubble.className = 'bubble-static';
            // Генерируем случайные параметры:
            // размер от 25 до 85 пикселей
            const size = Math.random() * 60 + 25;
            // горизонтальная позиция от 0 до 100%
            const left = Math.random() * 100;
            // вертикальная позиция от 0 до 100%
            const top = Math.random() * 100;
            // прозрачность от 0.7 до 1.0
            const opacity = Math.random() * 0.3 + 0.7;
            // Применяем стили к элементу
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = left + '%';
            bubble.style.top = top + '%';
            bubble.style.opacity = opacity;

            // Добавляем пузырёк в контейнер
            container.appendChild(bubble);
        }
        // Сохраняем все созданные статические пузырьки в массив для дальнейшего управления
        staticBubbles = document.querySelectorAll('.bubble-static');
    }
    // 4.2. Функция создания одного анимированного пузырька (с бесконечным циклом)
    function createAnimatedBubble() {
        // Создаём элемент div
        const bubble = document.createElement('div');
        // Задаём класс 'bubble-animated' – CSS применяет анимацию floatUp
        bubble.className = 'bubble-animated';
        // Генерируем случайные параметры для пузырька
        const size = Math.random() * 60 + 20;        // размер от 20 до 80px
        const left = Math.random() * 100;            // горизонтальная позиция 0–100%
        const duration = Math.random() * 6 + 4;      // длительность анимации 4–10 секунд
        const opacity = Math.random() * 0.3 + 0.7;   // прозрачность 0.7–1.0
        // Применяем стили
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = left + '%';
        bubble.style.opacity = opacity;
        // Начальное положение – за нижней границей экрана (сразу не виден)
        bubble.style.bottom = '-50px';
        // Запускаем CSS-анимацию floatUp с заданной длительностью и линейным ускорением
        // 'forwards' – после окончания сохраняет конечное состояние (прозрачность 0)
        bubble.style.animation = `floatUp ${duration}s linear forwards`;
        // Добавляем обработчик события 'animationend' – когда анимация заканчивается
        bubble.addEventListener('animationend', () => {
            // Если анимация в данный момент выключена (isAnimating === false),
            // то ничего не делаем – пузырёк просто исчезнет (он уже удалится из DOM? нет, он останется, но не будет перезапускаться)
            // Мы не удаляем его, но он больше не будет двигаться.
            if (!isAnimating) return;
            // Если анимация всё ещё активна, то перезапускаем цикл:
            // генерируем новую горизонтальную позицию
            const newLeft = Math.random() * 100;
            bubble.style.left = newLeft + '%';
            // Возвращаем вниз
            bubble.style.bottom = '-50px';
            // Меняем прозрачность
            bubble.style.opacity = Math.random() * 0.3 + 0.7;
            // Перезапускаем анимацию:
            // Сначала сбрасываем анимацию (устанавливаем 'none')
            bubble.style.animation = 'none';
            // Принудительно вызываем перерисовку (reflow), чтобы браузер применил сброс
            // Обращение к свойству offsetHeight заставляет браузер пересчитать стили
            bubble.offsetHeight;
            // Задаём новую длительность и запускаем заново
            const newDuration = Math.random() * 6 + 4;
            bubble.style.animation = `floatUp ${newDuration}s linear forwards`;
        });
        // Возвращаем созданный элемент
        return bubble;
    }
    // 4.3. Функция создания всех анимированных пузырьков (заменяет старые)
    function createAnimatedBubbles() {
        // Если уже есть анимированные пузырьки, удаляем их из DOM и очищаем массив
        if (animatedBubbles.length) {
            animatedBubbles.forEach(b => b.remove());
            animatedBubbles = [];
        }
        // Создаём BUBBLES_COUNT новых анимированных пузырьков
        for (let i = 0; i < BUBBLES_COUNT; i++) {
            const bubble = createAnimatedBubble();
            container.appendChild(bubble);
            animatedBubbles.push(bubble);
        }
    }
    // 4.4. Запуск анимации
    function startAnimation() {
        // Скрываем статические пузырьки (display: none)
        staticBubbles.forEach(b => b.style.display = 'none');
        // Создаём анимированные пузырьки
        createAnimatedBubbles();
        // Устанавливаем флаг, что анимация включена
        isAnimating = true;
    }
    // 4.5. Остановка анимации
    function stopAnimation() {
        // Если есть анимированные пузырьки – удаляем их
        if (animatedBubbles.length) {
            animatedBubbles.forEach(b => b.remove());
            animatedBubbles = [];
        }
        // Показываем статические пузырьки
        staticBubbles.forEach(b => b.style.display = 'block');
        // Сбрасываем флаг
        isAnimating = false;
    }
    // 4.6. Переключатель анимации (ползунок)
    const animToggle = document.getElementById('animToggle');
    // Сразу при загрузке создаём статические пузырьки
    createStaticBubbles();
    // Убеждаемся, что анимация выключена
    isAnimating = false;
    // Убираем класс 'active' у переключателя (он в выключенном состоянии)
    animToggle.classList.remove('active');
    // Вешаем обработчик клика на переключатель
    animToggle.addEventListener('click', () => {
        if (isAnimating) {
            // Если анимация включена – выключаем
            stopAnimation();
            animToggle.classList.remove('active');
        } else {
            // Если выключена – включаем
            startAnimation();
            animToggle.classList.add('active');
        }
    });
    // ============================================================
    // 5. МОДАЛЬНЫЕ ОКНА
    // ============================================================
    // Находим все три модальных окна по их id
    const orderModal = document.getElementById('orderModal');    // форма заказа
    const loadingModal = document.getElementById('loadingModal'); // окно загрузки
    const successModal = document.getElementById('successModal'); // окно успеха
    const orderForm = document.getElementById('orderForm');      // форма внутри модалки
    // 5.1. Функция закрытия всех модальных окон (скрывает все три)
    function closeAllModals() {
        orderModal.style.display = 'none';
        loadingModal.style.display = 'none';
        successModal.style.display = 'none';
    }
    // 5.2. Закрытие по клику на крестик (у всех модальных окон)
    // Находим все элементы с классом 'close-modal' (это крестики)
    document.querySelectorAll('.close-modal').forEach(btn => {
        // При клике на любой крестик вызываем функцию закрытия всех модалок
        btn.addEventListener('click', closeAllModals);
    });
    // 5.3. Закрытие по клику на фон (затемнённую область)
    // Вешаем обработчик на всё окно
    window.addEventListener('click', (e) => {
        // Проверяем, что клик был именно по самому затемнённому фону,
        // а не по содержимому модалки. Если e.target равен одному из модальных окон,
        // значит кликнули по фону (на сам div.modal), а не по дочернему элементу.
        if (e.target === orderModal || e.target === loadingModal || e.target === successModal) {
            closeAllModals();
        }
    });
    // 5.4. Открытие формы заказа по клику на кнопку «Купить»
    // Находим все кнопки с классом 'order-btn'
    const buyButtons = document.querySelectorAll('.order-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Предотвращаем стандартное поведение (например, если кнопка внутри формы – не отправляем её)
            e.preventDefault();
            // Показываем модалку заказа (display: flex – чтобы центрировать)
            orderModal.style.display = 'flex';
        });
    });
    // 5.5. Обработка отправки формы
    orderForm.addEventListener('submit', (e) => {
        // Предотвращаем стандартную отправку формы (перезагрузку страницы)
        e.preventDefault();
        // Получаем значения полей и удаляем лишние пробелы по краям
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const card = document.getElementById('card').value.trim();
        // Проверяем, что все поля заполнены
        if (!address || !phone || !card) {
            // Если какое-то поле пустое – выводим предупреждение и выходим
            alert('Пожалуйста, заполните все поля');
            return; // прерываем выполнение, форма не отправляется
        }
        // Если все поля заполнены:
        // 1. Закрываем модалку заказа
        orderModal.style.display = 'none';
        // 2. Показываем модалку загрузки
        loadingModal.style.display = 'flex';
        // 3. Имитируем отправку данных на сервер с задержкой 2 секунды
        setTimeout(() => {
            // По истечении 2 секунд:
            // - скрываем загрузку
            loadingModal.style.display = 'none';
            // - показываем окно успеха
            successModal.style.display = 'flex';
            // - сбрасываем форму (очищаем все поля)
            orderForm.reset();
        }, 2000);
    });
    // ============================================================
    // 6. ДЛЯ НОМЕРА КАРТЫ (автоматическое форматирование)
    // ============================================================
    // Находим поле ввода номера карты
    const cardInput = document.getElementById('card');
    // Вешаем обработчик события 'input', которое срабатывает при каждом изменении значения поля
    cardInput.addEventListener('input', function(e) {
        // 1. Удаляем все пробелы и все нецифровые символы (оставляем только цифры)
        let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
        // 2. Ограничиваем длину 16 цифрами (стандарт для банковских карт)
        if (value.length > 16) value = value.slice(0, 16);
        // 3. Форматируем: добавляем пробел после каждых 4 цифр
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            // Если индекс кратен 4 и не равен 0 – добавляем пробел перед текущей цифрой
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        // 4. Заменяем значение поля на отформатированную строку
        this.value = formatted;
    });

});
