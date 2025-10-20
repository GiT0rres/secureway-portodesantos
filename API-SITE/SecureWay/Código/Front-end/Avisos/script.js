// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const navBtns = document.querySelectorAll('.nav-btn');
    const btnsDismiss = document.querySelectorAll('.btn-dismiss');
    const avisosContainer = document.querySelector('.avisos-container');
    const noAvisos = document.getElementById('noAvisos');
    
    // Contador de avisos
    let totalAvisos = document.querySelectorAll('.aviso-card').length;
    
    // Função para verificar se há avisos
    function verificarAvisos() {
        const avisosVisiveis = avisosContainer.querySelectorAll('.aviso-card:not(.removing)').length;
        
        if (avisosVisiveis === 0) {
            noAvisos.style.display = 'block';
        } else {
            noAvisos.style.display = 'none';
        }
        
        console.log(`📊 Avisos restantes: ${avisosVisiveis}`);
    }
    
    // Função para remover aviso
    function removerAviso(avisoCard, avisoId) {
        // Adiciona classe de animação
        avisoCard.classList.add('removing');
        
        // Log da ação
        console.log(`🗑️ Removendo aviso ID: ${avisoId}`);
        
        // Remove o elemento após a animação
        setTimeout(() => {
            avisoCard.remove();
            totalAvisos--;
            verificarAvisos();
            
            // Mostra notificação
            mostrarNotificacao('Aviso removido com sucesso');
        }, 400);
    }
    
    // Função para mostrar notificação temporária
    function mostrarNotificacao(mensagem) {
        // Cria elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        notificacao.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.4s ease;
        `;
        
        document.body.appendChild(notificacao);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                notificacao.remove();
            }, 400);
        }, 3000);
    }
    
    // Event listeners para botões de dispensar
    btnsDismiss.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const avisoCard = this.closest('.aviso-card');
            const avisoId = this.getAttribute('data-id');
            
            // Confirmação antes de remover
            const avisoTitulo = avisoCard.querySelector('.aviso-titulo').textContent;
            
            if (confirm(`Deseja remover o aviso "${avisoTitulo}"?`)) {
                removerAviso(avisoCard, avisoId);
            }
        });
    });
    
    // Click no card para expandir informações (opcional)
    const avisosCards = document.querySelectorAll('.aviso-card');
    avisosCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Não expande se clicar no botão de remover
            if (e.target.closest('.btn-dismiss')) return;
            
            const titulo = this.querySelector('.aviso-titulo').textContent;
            console.log(`📋 Aviso selecionado: ${titulo}`);
            
            // Aqui você pode adicionar lógica para mostrar detalhes
            // Por exemplo, abrir um modal com mais informações
        });
    });
    
    // Botão Home - volta para a página principal
    if (btnHome) {
        btnHome.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // Navegação dos botões do header
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (btn.id !== 'btnHome') {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log('Navegação alterada:', index);
            }
        });
    });
    
    // Atalho de teclado para remover todos os avisos (Ctrl + Shift + D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            
            const avisosVisiveis = document.querySelectorAll('.aviso-card:not(.removing)');
            
            if (avisosVisiveis.length === 0) {
                alert('Não há avisos para remover.');
                return;
            }
            
            if (confirm(`Deseja remover todos os ${avisosVisiveis.length} avisos?`)) {
                avisosVisiveis.forEach((card, index) => {
                    setTimeout(() => {
                        const avisoId = card.querySelector('.btn-dismiss').getAttribute('data-id');
                        removerAviso(card, avisoId);
                    }, index * 100); // Efeito cascata
                });
            }
        }
    });
    
    // Adiciona animações CSS necessárias
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Log inicial
    console.log('✅ SecureWay - Avisos carregado com sucesso!');
    console.log(`📊 Total de avisos: ${totalAvisos}`);
    console.log('⌨️ Atalho: Ctrl + Shift + D para remover todos os avisos');
});