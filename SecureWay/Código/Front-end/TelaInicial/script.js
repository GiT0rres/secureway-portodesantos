// ========== TELA DE CARREGAMENTO ==========
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loading").style.display = "none";
        document.getElementById("content").style.display = "block";
        
        // Adiciona animação fade-in
        setTimeout(() => {
            document.getElementById("content").classList.add("fade-in");
        }, 50);
    }, 300);
});

// ========== ELEMENTOS DO DOM ==========
let searchInput, clearBtn, cards, phoneBtns, navBtns, sidebar, overlay, menuBtn, sidebarLinks, sidebarNavBtns;

// Aguarda o conteúdo estar visível para inicializar
setTimeout(() => {
    initializeElements();
}, 3100);

function initializeElements() {
    searchInput = document.getElementById('searchInput');
    clearBtn = document.getElementById('clearBtn');
    cards = document.querySelectorAll('.card');
    phoneBtns = document.querySelectorAll('.phone-btn');
    navBtns = document.querySelectorAll('.nav-btn');
    sidebar = document.getElementById('sidebar');
    overlay = document.getElementById('overlay');
    menuBtn = document.getElementById('menuBtn');
    sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarNavBtns = document.querySelectorAll('.sidebar-nav-btn');
    
    // Inicializa eventos
    initializeEvents();
    
    // Animação de entrada dos cards
    animateCardsEntrance();
}

// ========== MENU LATERAL ==========
function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function initializeEvents() {
    // ✅ MENU LATERAL (adição correta do bloco que você pediu)
    if (menuBtn && sidebar && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Fechar menu ao clicar em um link do sidebar
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.querySelector('span')?.textContent || 'Link';
            console.log('Navegando para:', linkText);
            toggleSidebar();
        });
    });

    // Navegação inferior do sidebar
    sidebarNavBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            console.log('Botão do sidebar clicado:', index);
        });
    });

    // ========== PESQUISA ==========
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
            filterCards('');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterCards(searchTerm);
        });
    }

    // ========== BOTÕES DE TELEFONE ==========
    phoneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
            alert('Função de chamada ativada!');
        });
    });

    // ========== NAVEGAÇÃO INFERIOR ==========
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (index !== 0) {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            console.log('Navegação alterada:', index);
        });
    });

    // ========== EFEITO DE HOVER NOS CARDS ==========
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });
}

// ========== FILTRO DE CARDS ==========
function filterCards(searchTerm) {
    cards.forEach(card => {
        const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
        if (title.includes(searchTerm)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========== ANIMAÇÃO DE ENTRADA DOS CARDS ==========
function animateCardsEntrance() {
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 120);
    });
}

// ========== ATALHOS DO TECLADO ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('active')) {
        toggleSidebar();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
    }
});

// ========== AJUSTE RESPONSIVO ==========
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && sidebar && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    }, 250);
});

// ========== LOG ==========
console.log('SecureWay - Sistema inicializado com sucesso!');
console.log('Versão: 1.0.0');
console.log('Desenvolvido por: Sua Empresa');