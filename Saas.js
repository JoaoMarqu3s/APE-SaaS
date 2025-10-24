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
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = dropdown.classList.contains('open');
                dropdowns.forEach(d => d.classList.remove('open'));
                if (!isOpen) {
                    dropdown.classList.add('open');
                }
            });
        }
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
    const ecosystemNodes = document.querySelectorAll('#ecosystem .service-node');
    const ecosystemOverlay = document.getElementById('overlay');
    const ecosystemLines = document.querySelectorAll('#ecosystem .connection-lines path');
    const ecosystemContainer = document.querySelector('.ecosystem-container');
    const progressCounter = document.querySelector('.progress-counter');
    const achievementMessage = document.getElementById('achievement-message');

    let isEcosystemAnimating = false;
    let connectedLinesCount = 0;

    if (ecosystemLines.length > 0) {
        setTimeout(() => {
            ecosystemLines.forEach(line => {
                const length = line.getTotalLength();
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
            });
        }, 100);
    }

    const closeOpenCard = () => {
        const openCard = document.querySelector('.info-card.visible');
        if (openCard) {
            openCard.classList.remove('visible');
            ecosystemOverlay.classList.remove('visible');
        }
    };

    const updateCounter = () => {
        if (progressCounter) {
            progressCounter.textContent = `${connectedLinesCount} de 5 áreas conectadas`;
            if (connectedLinesCount > 0 && !progressCounter.classList.contains('visible')) {
                progressCounter.classList.add('visible');
            }
        }
    };

    const showAchievementMessage = () => {
        if (achievementMessage) {
            achievementMessage.classList.add('visible');
            setTimeout(() => {
                achievementMessage.classList.remove('visible');
            }, 5000);
        }
    };

    const handleNodeClick = (node) => {
        if (isEcosystemAnimating) return;
        const targetId = node.dataset.target;
        const line = document.getElementById(`line-${targetId}`);
        const card = document.getElementById(`card-${targetId}`);

        if (!line || !card) return;
        if (card.classList.contains('visible')) return;
        
        closeOpenCard();

        if (line.classList.contains('connected')) {
            card.classList.add('visible');
            ecosystemOverlay.classList.add('visible');
            return;
        }

        isEcosystemAnimating = true;
        line.style.strokeDashoffset = '0';

        line.addEventListener('transitionend', (event) => {
            if (event.propertyName !== 'stroke-dashoffset') return;
            isEcosystemAnimating = false;
            line.classList.add('connected');
            card.classList.add('visible');
            ecosystemOverlay.classList.add('visible');
            connectedLinesCount++;
            updateCounter();
            if (connectedLinesCount === 5 && ecosystemContainer) {
                ecosystemContainer.classList.add('all-connected');
                showAchievementMessage();
            }
        }, { once: true });
    };

    ecosystemNodes.forEach(node => {
        node.addEventListener('click', () => handleNodeClick(node));
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeOpenCard);
    });

    if (ecosystemOverlay) {
        ecosystemOverlay.addEventListener('click', closeOpenCard);
    }

    // ========================================================== //
    // --- LÓGICA DO CARROSSEL DE SOLUÇÕES ---                    //
    // ========================================================== //
    const nextBtn = document.querySelector('.solutions-carousel-section .next');
    const prevBtn = document.querySelector('.solutions-carousel-section .prev');

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", () => {
            let items = document.querySelectorAll(".carousel-container .item");
            document.querySelector(".carousel-container .slide").appendChild(items[0]);
        });
        prevBtn.addEventListener("click", () => {
            let items = document.querySelectorAll(".carousel-container .item");
            document.querySelector(".carousel-container .slide").prepend(items[items.length - 1]);
        });
    }

    // ========================================================== //
    // --- LÓGICA DA SEÇÃO DE RECURSOS (HOVER) ---                //
    // ========================================================== //
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ========================================================== //
    // --- LÓGICA DA SEÇÃO FAQ (ACORDEÃO) ---                     //
    // ========================================================== //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                // Fecha todos os itens antes de abrir o novo (comportamento de acordeão)
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                // Se não estava aberto, abre
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ========================================================== //
    // --- LÓGICA DO ANO DO RODAPÉ ---                           //
    // ========================================================== //
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // ========================================================== //
    // --- LÓGICA DE ANIMAÇÃO DE SCROLL (AOS) ---                 //
    // ========================================================== //
    // O seu HTML já inclui a biblioteca AOS, só precisamos iniciá-la.
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, // Duração da animação em milissegundos
            once: true,    // Animação acontece apenas uma vez
            offset: 120,   // Começa a animar um pouco antes do elemento aparecer
        });
    }
});