document.addEventListener('DOMContentLoaded', function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    function switchTab(tabName) {
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const activeLink = document.querySelector(`.tab-link[data-tab="${tabName}"]`);
        if (activeLink) activeLink.classList.add('active');
        const activeContent = document.getElementById(`tab-${tabName}`);
        if (activeContent) activeContent.classList.add('active');
    }
    tabLinks.forEach(link => {
        link.addEventListener('click', () => switchTab(link.getAttribute('data-tab')));
    });
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => item.classList.toggle('active'));
    });
    const container = document.getElementById('bubblesContainer');
    let staticBubbles = [];
    let animatedBubbles = [];
    let isAnimating = false;
    const BUBBLES_COUNT = 36;
    function createStaticBubbles() {
        container.innerHTML = '';
        for (let i = 0; i < BUBBLES_COUNT; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble-static';
            const size = Math.random() * 60 + 25;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const opacity = Math.random() * 0.3 + 0.7;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = left + '%';
            bubble.style.top = top + '%';
            bubble.style.opacity = opacity;
            container.appendChild(bubble);
        }
        staticBubbles = document.querySelectorAll('.bubble-static');
    }
    function createAnimatedBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble-animated';
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 6 + 4;
        const opacity = Math.random() * 0.3 + 0.7;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = left + '%';
        bubble.style.opacity = opacity;
        bubble.style.bottom = '-50px';
        bubble.style.animation = `floatUp ${duration}s linear forwards`;
        bubble.addEventListener('animationend', () => {
            if (!isAnimating) return;
            const newLeft = Math.random() * 100;
            bubble.style.left = newLeft + '%';
            bubble.style.bottom = '-50px';
            bubble.style.opacity = Math.random() * 0.3 + 0.7;
            bubble.style.animation = 'none';
            bubble.offsetHeight;
            const newDuration = Math.random() * 6 + 4;
            bubble.style.animation = `floatUp ${newDuration}s linear forwards`;
        });
        return bubble;
    }
    function createAnimatedBubbles() {
        if (animatedBubbles.length) {
            animatedBubbles.forEach(b => b.remove());
            animatedBubbles = [];
        }
        for (let i = 0; i < BUBBLES_COUNT; i++) {
            const bubble = createAnimatedBubble();
            container.appendChild(bubble);
            animatedBubbles.push(bubble);
        }
    }
    function startAnimation() {
        staticBubbles.forEach(b => b.style.display = 'none');
        createAnimatedBubbles();
        isAnimating = true;
    }
    function stopAnimation() {
        if (animatedBubbles.length) {
            animatedBubbles.forEach(b => b.remove());
            animatedBubbles = [];
        }
        staticBubbles.forEach(b => b.style.display = 'block');
        isAnimating = false;
    }
    const animToggle = document.getElementById('animToggle');
    createStaticBubbles();
    isAnimating = false;
    animToggle.classList.remove('active');
    animToggle.addEventListener('click', () => {
        if (isAnimating) {
            stopAnimation();
            animToggle.classList.remove('active');
        } else {
            startAnimation();
            animToggle.classList.add('active');
        }
    });
    const orderModal = document.getElementById('orderModal');
    const loadingModal = document.getElementById('loadingModal');
    const successModal = document.getElementById('successModal');
    const orderForm = document.getElementById('orderForm');
    function closeAllModals() {
        orderModal.style.display = 'none';
        loadingModal.style.display = 'none';
        successModal.style.display = 'none';
    }
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    window.addEventListener('click', (e) => {
        if (e.target === orderModal || e.target === loadingModal || e.target === successModal) closeAllModals();
    });
    const buyButtons = document.querySelectorAll('.order-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            orderModal.style.display = 'flex';
        });
    });
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const card = document.getElementById('card').value.trim();
        if (!address || !phone || !card) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        orderModal.style.display = 'none';
        loadingModal.style.display = 'flex';
        setTimeout(() => {
            loadingModal.style.display = 'none';
            successModal.style.display = 'flex';
            orderForm.reset();
        }, 2000);
    });
    const cardInput = document.getElementById('card');
    cardInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\s/g, '').replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        this.value = formatted;
    });
});
