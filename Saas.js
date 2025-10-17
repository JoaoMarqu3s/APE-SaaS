document.addEventListener('DOMContentLoaded', () => {

    // ========================================================== //
    // --- LÓGICA DA NAVBAR (HEADER) ---                          //
    // ========================================================== //
    const navList = document.querySelector('.nav-list');
    const navItems = document.querySelectorAll('.nav-item');
    const highlight = document.querySelector('.nav-highlight');
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    const hamburger = document.querySelector('.hamburger-menu');
    const navContainer = document.querySelector('.navbar-container');

    if (window.innerWidth > 999) {
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const itemRect = item.getBoundingClientRect();
                const navListRect = navList.getBoundingClientRect();
                const leftPosition = itemRect.left - navListRect.left;
                highlight.style.width = `${itemRect.width}px`;
                highlight.style.transform = `translateX(${leftPosition}px)`;
                highlight.style.opacity = '1';
            });
        });
        navList.addEventListener('mouseleave', () => {
            highlight.style.opacity = '0';
        });
    }

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropbtn');
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = dropdown.classList.contains('open');
            dropdowns.forEach(d => d.classList.remove('open'));
            if (!isOpen) {
                dropdown.classList.add('open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item.dropdown')) {
            dropdowns.forEach(d => d.classList.remove('open'));
        }
    });

    if (hamburger && navList) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navList.classList.toggle('active');
            navContainer.classList.toggle('menu-open');
        });
    }

    // ========================================================== //
    // --- LÓGICA DA SEÇÃO ECOSYSTEM (NUVEM INTERATIVA) ---       //
    // ========================================================== //
    const nodes = document.querySelectorAll('.service-node');
    const overlay = document.getElementById('overlay');
    const lines = document.querySelectorAll('.connection-lines path');
    const ecosystemContainer = document.querySelector('.ecosystem-container');
    const progressCounter = document.querySelector('.progress-counter');
    const achievementMessage = document.getElementById('achievement-message');

    let isAnimating = false;
    let connectedLinesCount = 0;

    setTimeout(() => {
        lines.forEach(line => {
            const length = line.getTotalLength();
            line.style.strokeDasharray = length;
            line.style.strokeDashoffset = length;
        });
    }, 100);

    const closeOpenCard = () => {
        const openCard = document.querySelector('.info-card.visible');
        if (openCard) {
            openCard.classList.remove('visible');
            overlay.classList.remove('visible');
        }
    };

    const updateCounter = () => {
        progressCounter.textContent = `${connectedLinesCount} de 5 áreas conectadas`;
        if (connectedLinesCount > 0 && !progressCounter.classList.contains('visible')) {
            progressCounter.classList.add('visible');
        }
    };

    const showAchievementMessage = () => {
        achievementMessage.classList.add('visible');
        setTimeout(() => {
            achievementMessage.classList.remove('visible');
        }, 5000);
    };

    const handleNodeClick = (node) => {
        if (isAnimating) return;

        const targetId = node.dataset.target;
        const line = document.getElementById(`line-${targetId}`);
        const card = document.getElementById(`card-${targetId}`);

        if (card.classList.contains('visible')) return;
        
        closeOpenCard();

        if (line.classList.contains('connected')) {
            card.classList.add('visible');
            overlay.classList.add('visible');
            return;
        }

        isAnimating = true;
        line.style.strokeDashoffset = '0';

        line.addEventListener('transitionend', (event) => {
            if (event.propertyName !== 'stroke-dashoffset') return;

            isAnimating = false;
            line.classList.add('connected');
            card.classList.add('visible');
            overlay.classList.add('visible');

            connectedLinesCount++;
            updateCounter();
            
            if (connectedLinesCount === 5) {
                ecosystemContainer.classList.add('all-connected');
                showAchievementMessage();
            }
        }, { once: true });
    };

    nodes.forEach(node => {
        node.addEventListener('click', () => handleNodeClick(node));
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        // CORREÇÃO DO ERRO DE DIGITAÇÃO AQUI
        btn.addEventListener('click', closeOpenCard);
    });

    overlay.addEventListener('click', closeOpenCard);
});


// ========================================================== //
    // --- LÓGICA DA SEÇÃO DE RECURSOS (FEATURES) ---             //
    // ========================================================== //
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });