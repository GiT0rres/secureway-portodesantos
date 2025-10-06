// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const navItems = document.querySelectorAll('.nav-item');
    const btnsDismiss = document.querySelectorAll('.btn-dismiss');
    const avisosList = document.querySelector('.avisos-list');
    const noAvisos = document.getElementById('noAvisos');
    
    // Contador de avisos
    let totalAvisos = document.querySelectorAll('.aviso-card').length;
    
    // Função para verificar se há avisos
    function verificarAvisos() {
        const avisosVisiveis = avisosList.querySelectorAll('.aviso-card:not(.removing)').length;
        
        if (avisosVisiveis === 0) {
            noAvisos.style.display = 'block';
        } else {
            noAvisos.style.display = 'none';
        }
        
        console.log(`📊 Avisos restantes: ${avisosVisiveis}`);
    }
    
    // Função para remover aviso
    function removerAviso(avisoCard, avisoId) {
        avisoCard.classList.add('removing');
        
        const titulo = avisoCard.querySelector('.aviso-titulo').textContent;
        console.log(`🗑️ Removendo aviso ID: ${avisoId} - ${titulo}`);
        
        setTimeout(() => {
            avisoCard.remove();
            totalAvisos--;
            verificarAvisos();
            
            mostrarNotificacao('Aviso removido');
        }, 400);
    }
    
    // Função para mostrar notificação temporária
    function mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        notificacao.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            font-weight: 500;
            font-size: 0.9rem;
            z-index: 1000;
            animation: slideInUp 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                notificacao.remove();
            }, 300);
        }, 2000);
    }
    
    // Event listeners para botões de dispensar
    btnsDismiss.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const avisoCard = this.closest('.aviso-card');
            const avisoId = this.getAttribute('data-id');
            
            removerAviso(avisoCard, avisoId);
        });
    });
    
    // Click no card para expandir informações (opcional)
    const avisosCards = document.querySelectorAll('.aviso-card');
    avisosCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-dismiss')) return;
            
            const titulo = this.querySelector('.aviso-titulo').textContent;
            console.log(`📋 Aviso selecionado: ${titulo}`);
            
            // Adiciona efeito visual de seleção
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', function() {
            console.log('🏠 Voltando para home');
            mostrarNotificacao('Voltando ao início');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        });
    }
    
    // Navegação dos botões
    navItems.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            navItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log('Navegação alterada:', index);
        });
    });
    
    // Swipe para remover aviso (funcionalidade mobile)
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentCard = null;
    
    avisosCards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            if (e.target.closest('.btn-dismiss')) return;
            
            startX = e.touches[0].clientX;
            isDragging = true;
            currentCard = this;
            this.style.transition = 'none';
        });
        
        card.addEventListener('touchmove', function(e) {
            if (!isDragging || e.target.closest('.btn-dismiss')) return;
            
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            
            if (diff < 0) {
                this.style.transform = `translateX(${diff}px)`;
                this.style.opacity = 1 + (diff / 200);
            }
        });
        
        card.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            
            const diff = currentX - startX;
            this.style.transition = 'all 0.3s ease';
            
            if (diff < -100) {
                const avisoId = this.querySelector('.btn-dismiss').getAttribute('data-id');
                removerAviso(this, avisoId);
            } else {
                this.style.transform = '';
                this.style.opacity = '';
            }
            
            isDragging = false;
            currentCard = null;
        });
    });
    
    // Pull to refresh (simulação)
    let startY = 0;
    let isPulling = false;
    
    window.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    });
    
    window.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 80 && window.scrollY === 0) {
            console.log('🔄 Atualizando avisos...');
        }
    });
    
    window.addEventListener('touchend', function() {
        isPulling = false;
    });
    
    // Adiciona animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translate(-50%, 100px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        
        @keyframes slideOutDown {
            from {
                opacity: 1;
                transform: translate(-50%, 0);
            }
            to {
                opacity: 0;
                transform: translate(-50%, 100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Vibração ao remover (se suportado)
    function vibrar() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    // Adiciona vibração aos botões
    btnsDismiss.forEach(btn => {
        btn.addEventListener('click', vibrar);
    });
    
    // Log inicial
    console.log('✅ SecureWay - Avisos Mobile carregado!');
    console.log(`📊 Total de avisos: ${totalAvisos}`);
    console.log('👆 Dica: Deslize o aviso para a esquerda para remover');
    
    // Verifica estado inicial
    verificarAvisos();
});// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const navItems = document.querySelectorAll('.nav-item');
    const btnsDismiss = document.querySelectorAll('.btn-dismiss');
    const avisosList = document.querySelector('.avisos-list');
    const noAvisos = document.getElementById('noAvisos');
    
    // Contador de avisos
    let totalAvisos = document.querySelectorAll('.aviso-card').length;
    
    // Função para verificar se há avisos
    function verificarAvisos() {
        const avisosVisiveis = avisosList.querySelectorAll('.aviso-card:not(.removing)').length;
        
        if (avisosVisiveis === 0) {
            noAvisos.style.display = 'block';
        } else {
            noAvisos.style.display = 'none';
        }
        
        console.log(`📊 Avisos restantes: ${avisosVisiveis}`);
    }
    
    // Função para remover aviso
    function removerAviso(avisoCard, avisoId) {
        avisoCard.classList.add('removing');
        
        const titulo = avisoCard.querySelector('.aviso-titulo').textContent;
        console.log(`🗑️ Removendo aviso ID: ${avisoId} - ${titulo}`);
        
        setTimeout(() => {
            avisoCard.remove();
            totalAvisos--;
            verificarAvisos();
            
            mostrarNotificacao('Aviso removido');
        }, 400);
    }
    
    // Função para mostrar notificação temporária
    function mostrarNotificacao(mensagem) {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        notificacao.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            font-weight: 500;
            font-size: 0.9rem;
            z-index: 1000;
            animation: slideInUp 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                notificacao.remove();
            }, 300);
        }, 2000);
    }
    
    // Event listeners para botões de dispensar
    btnsDismiss.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const avisoCard = this.closest('.aviso-card');
            const avisoId = this.getAttribute('data-id');
            
            removerAviso(avisoCard, avisoId);
        });
    });
    
    // Click no card para expandir informações (opcional)
    const avisosCards = document.querySelectorAll('.aviso-card');
    avisosCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-dismiss')) return;
            
            const titulo = this.querySelector('.aviso-titulo').textContent;
            console.log(`📋 Aviso selecionado: ${titulo}`);
            
            // Adiciona efeito visual de seleção
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', function() {
            console.log('🏠 Voltando para home');
            mostrarNotificacao('Voltando ao início');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 500);
        });
    }
    
    // Navegação dos botões
    navItems.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            navItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log('Navegação alterada:', index);
        });
    });
    
    // Swipe para remover aviso (funcionalidade mobile)
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentCard = null;
    
    avisosCards.forEach(card => {
        card.addEventListener('touchstart', function(e) {
            if (e.target.closest('.btn-dismiss')) return;
            
            startX = e.touches[0].clientX;
            isDragging = true;
            currentCard = this;
            this.style.transition = 'none';
        });
        
        card.addEventListener('touchmove', function(e) {
            if (!isDragging || e.target.closest('.btn-dismiss')) return;
            
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            
            if (diff < 0) {
                this.style.transform = `translateX(${diff}px)`;
                this.style.opacity = 1 + (diff / 200);
            }
        });
        
        card.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            
            const diff = currentX - startX;
            this.style.transition = 'all 0.3s ease';
            
            if (diff < -100) {
                const avisoId = this.querySelector('.btn-dismiss').getAttribute('data-id');
                removerAviso(this, avisoId);
            } else {
                this.style.transform = '';
                this.style.opacity = '';
            }
            
            isDragging = false;
            currentCard = null;
        });
    });
    
    // Pull to refresh (simulação)
    let startY = 0;
    let isPulling = false;
    
    window.addEventListener('touchstart', function(e) {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    });
    
    window.addEventListener('touchmove', function(e) {
        if (!isPulling) return;
        
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 80 && window.scrollY === 0) {
            console.log('🔄 Atualizando avisos...');
        }
    });
    
    window.addEventListener('touchend', function() {
        isPulling = false;
    });
    
    // Adiciona animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translate(-50%, 100px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        
        @keyframes slideOutDown {
            from {
                opacity: 1;
                transform: translate(-50%, 0);
            }
            to {
                opacity: 0;
                transform: translate(-50%, 100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Vibração ao remover (se suportado)
    function vibrar() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
    
    // Adiciona vibração aos botões
    btnsDismiss.forEach(btn => {
        btn.addEventListener('click', vibrar);
    });
    
    // Log inicial
    console.log('✅ SecureWay - Avisos Mobile carregado!');
    console.log(`📊 Total de avisos: ${totalAvisos}`);
    console.log('👆 Dica: Deslize o aviso para a esquerda para remover');
    
    // Verifica estado inicial
    verificarAvisos();
});