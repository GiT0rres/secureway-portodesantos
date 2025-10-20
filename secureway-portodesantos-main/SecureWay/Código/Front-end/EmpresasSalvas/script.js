// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const companiesList = document.getElementById('companiesList');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const btnHome = document.getElementById('btnHome');
    const emptyState = document.getElementById('emptyState');
    
    // Dados de exemplo das empresas salvas
    const savedCompanies = [
        {
            name: 'SecureWay Transportes',
            address: 'Av. Paulista, 1000 - São Paulo, SP',
            contact: '(11) 3000-0000',
            saved: true
        },
        {
            name: 'Express Cargo Ltda',
            address: 'Rua das Flores, 500 - Rio de Janeiro, RJ',
            contact: '(21) 3000-0000',
            saved: true
        },
        {
            name: 'Logística Brasil',
            address: 'Av. Brasil, 2000 - Belo Horizonte, MG',
            contact: '(31) 3000-0000',
            saved: true
        },
        {
            name: 'Transportadora Nacional',
            address: 'Rua do Comércio, 750 - Curitiba, PR',
            contact: '(41) 3000-0000',
            saved: true
        },
        {
            name: 'Cargas Rápidas SA',
            address: 'Av. dos Estados, 1500 - Porto Alegre, RS',
            contact: '(51) 3000-0000',
            saved: true
        },
        {
            name: 'Trans Atlântico',
            address: 'Rua Principal, 300 - Salvador, BA',
            contact: '(71) 3000-0000',
            saved: true
        }
    ];
    
    // Função para gerar cards das empresas
    function generateCompanyCards() {
        if (savedCompanies.length === 0) {
            companiesList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        companiesList.style.display = 'grid';
        emptyState.style.display = 'none';
        
        const cardsHTML = savedCompanies.map((company, index) => `
            <div class="company-item" data-index="${index}" style="animation-delay: ${index * 0.1}s">
                <div class="company-header">
                    <div class="company-details">
                        <h3 class="company-name">${company.name}</h3>
                        <div class="company-address">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>${company.address}</span>
                        </div>
                        <div class="company-contact">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${company.contact}</span>
                        </div>
                    </div>
                    <button class="bookmark-btn saved" data-index="${index}" title="Remover dos salvos">
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
                <div class="company-actions">
                    <button class="action-btn" data-action="view" data-index="${index}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Ver Detalhes
                    </button>
                    <button class="action-btn primary" data-action="schedule" data-index="${index}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Agendar
                    </button>
                    <button class="action-btn" data-action="contact" data-index="${index}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Ligar
                    </button>
                </div>
            </div>
        `).join('');
        
        companiesList.innerHTML = cardsHTML;
        attachEventListeners();
    }
    
    // Função para anexar event listeners
    function attachEventListeners() {
        // Botões de bookmark
        const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
        bookmarkBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.dataset.index);
                removeCompany(index);
            });
        });
        
        // Botões de ação
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const index = parseInt(btn.dataset.index);
                const company = savedCompanies[index];
                
                handleAction(action, company);
            });
        });
    }
    
    // Função para remover empresa
    function removeCompany(index) {
        const company = savedCompanies[index];
        
        if (confirm(`Deseja remover "${company.name}" dos salvos?`)) {
            savedCompanies.splice(index, 1);
            generateCompanyCards();
            
            console.log('Empresa removida:', company.name);
            showNotification('Empresa removida dos salvos!');
        }
    }
    
    // Função para lidar com ações
    function handleAction(action, company) {
        console.log(`Ação: ${action} - Empresa: ${company.name}`);
        
        switch(action) {
            case 'view':
                alert(`📋 Detalhes de ${company.name}\n\nEndereço: ${company.address}\nContato: ${company.contact}\n\nHorários, serviços e mais informações...`);
                break;
            case 'schedule':
                alert(`📅 Agendar entrega com ${company.name}\n\nSelecione data e horário para sua entrega.`);
                break;
            case 'contact':
                alert(`📞 Ligando para ${company.name}\n\n${company.contact}`);
                break;
        }
    }
    
    // Função para mostrar notificação
    function showNotification(message) {
        // Implementação simples de notificação
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(13, 102, 119, 0.95);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Função para filtrar empresas
    function filterCompanies(searchTerm) {
        const items = document.querySelectorAll('.company-item');
        
        items.forEach(item => {
            const name = item.querySelector('.company-name').textContent.toLowerCase();
            const address = item.querySelector('.company-address span').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || address.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Event listener para pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterCompanies(e.target.value.toLowerCase());
        });
    }
    
    // Event listener para limpar pesquisa
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterCompanies('');
            searchInput.focus();
        });
    }
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K para focar na busca
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Inicializa a página
    generateCompanyCards();
    
    console.log('SecureWay - Empresas Salvas carregado com sucesso!');
    console.log(`Total de empresas salvas: ${savedCompanies.length}`);
});