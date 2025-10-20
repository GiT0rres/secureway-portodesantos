// Configuração da API
const API_URL = 'http://localhost:3034/api';

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const companiesList = document.getElementById('companiesList');
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearBtn');
    const btnHome = document.getElementById('btnHome');
    const emptyState = document.getElementById('emptyState');
    
    // Array para armazenar as empresas
    let empresas = [];
    
    // ========================================
    // BUSCAR EMPRESAS DA API
    // ========================================
    async function buscarEmpresas() {
        try {
            console.log('🔍 Buscando empresas da API...');
            
            const response = await fetch(`${API_URL}/enterprises`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar empresas');
            }
            
            const data = await response.json();
            console.log('📥 Empresas recebidas:', data);
            
            empresas = data;
            generateCompanyCards();
            
        } catch (error) {
            console.error('❌ Erro ao buscar empresas:', error);
            showNotification('Erro ao carregar empresas. Verifique se a API está rodando.', 'error');
            emptyState.style.display = 'flex';
            companiesList.style.display = 'none';
        }
    }
    
    // ========================================
    // FORMATAÇÃO
    // ========================================
    
    // Função para formatar telefone
    function formatarTelefone(telefone) {
        if (!telefone) return 'Não informado';
        
        // Se já for string, usa direto
        const tel = telefone.toString();
        
        if (tel.length === 11) {
            return `(${tel.substring(0,2)}) ${tel.substring(2,7)}-${tel.substring(7)}`;
        } else if (tel.length === 10) {
            return `(${tel.substring(0,2)}) ${tel.substring(2,6)}-${tel.substring(6)}`;
        }
        return telefone;
    }
    
    // Função para formatar CNPJ
    function formatarCNPJ(cnpj) {
        if (!cnpj) return 'Não informado';
        
        // Se já for string, usa direto
        const cnpjStr = cnpj.toString().padStart(14, '0');
        return `${cnpjStr.substring(0,2)}.${cnpjStr.substring(2,5)}.${cnpjStr.substring(5,8)}/${cnpjStr.substring(8,12)}-${cnpjStr.substring(12)}`;
    }
    
    // ========================================
    // GERAR CARDS DAS EMPRESAS
    // ========================================
    function generateCompanyCards() {
        if (empresas.length === 0) {
            companiesList.style.display = 'none';
            emptyState.style.display = 'flex';
            emptyState.querySelector('h3').textContent = 'Nenhuma empresa cadastrada';
            emptyState.querySelector('p').textContent = 'Cadastre empresas para começar a usar o sistema';
            return;
        }
        
        companiesList.style.display = 'grid';
        emptyState.style.display = 'none';
        
        const cardsHTML = empresas.map((empresa, index) => `
            <div class="company-item" data-index="${index}" data-id="${empresa.id}" style="animation-delay: ${index * 0.1}s">
                <div class="company-header">
                    <div class="company-details">
                        <h3 class="company-name">${empresa.nome}</h3>
                        <div class="company-address">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <span>${empresa.email}</span>
                        </div>
                        <div class="company-contact">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                            </svg>
                            <span>${formatarTelefone(empresa.telefone)}</span>
                        </div>
                        <div class="company-cnpj">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span>CNPJ: ${formatarCNPJ(empresa.cnpj)}</span>
                        </div>
                    </div>
                    <button class="bookmark-btn saved" data-id="${empresa.id}" title="Excluir empresa">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
                <div class="company-actions">
                    <button class="action-btn" data-action="view" data-id="${empresa.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Ver Detalhes
                    </button>
                    <button class="action-btn primary" data-action="edit" data-id="${empresa.id}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar
                    </button>
                    <button class="action-btn" data-action="contact" data-id="${empresa.id}">
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
        
        console.log(`✅ ${empresas.length} empresa(s) carregada(s)`);
    }
    
    // ========================================
    // ANEXAR EVENT LISTENERS
    // ========================================
    function attachEventListeners() {
        // Botões de deletar
        const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
        bookmarkBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const empresaId = parseInt(btn.dataset.id);
                await removeCompany(empresaId);
            });
        });
        
        // Botões de ação
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                const empresaId = parseInt(btn.dataset.id);
                const empresa = empresas.find(e => e.id === empresaId);
                
                handleAction(action, empresa);
            });
        });
    }
    
    // ========================================
    // REMOVER EMPRESA
    // ========================================
    async function removeCompany(empresaId) {
        const empresa = empresas.find(e => e.id === empresaId);
        
        if (!empresa) {
            showNotification('Empresa não encontrada!', 'error');
            return;
        }
        
        if (confirm(`⚠️ Deseja realmente excluir "${empresa.nome}"?\n\nEsta ação não pode ser desfeita!`)) {
            try {
                console.log('🗑️ Deletando empresa:', empresaId);
                
                const response = await fetch(`${API_URL}/enterprises/${empresaId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Erro ao deletar empresa');
                }
                
                console.log('✅ Empresa deletada com sucesso');
                showNotification('✓ Empresa excluída com sucesso!');
                
                // Recarrega a lista
                await buscarEmpresas();
                
            } catch (error) {
                console.error('❌ Erro ao deletar empresa:', error);
                showNotification('❌ Erro ao excluir empresa: ' + error.message, 'error');
            }
        }
    }
    
    // ========================================
    // LIDAR COM AÇÕES
    // ========================================
    function handleAction(action, empresa) {
        if (!empresa) return;
        
        console.log(`Ação: ${action} - Empresa: ${empresa.nome}`);
        
        switch(action) {
            case 'view':
                // Mostra detalhes em um alert (temporário)
                alert(`📋 Detalhes da Empresa\n\n` +
                      `Nome: ${empresa.nome}\n` +
                      `Email: ${empresa.email}\n` +
                      `Telefone: ${formatarTelefone(empresa.telefone)}\n` +
                      `CNPJ: ${formatarCNPJ(empresa.cnpj)}\n\n` +
                      `ID: ${empresa.id}\n` +
                      `Cadastrado em: ${new Date(empresa.createdAt).toLocaleDateString('pt-BR')}`);
                break;
                
            case 'edit':
                // Futuramente: redirecionar para página de edição
                showNotification('🚧 Funcionalidade em desenvolvimento', 'info');
                console.log('Editar empresa:', empresa.id);
                // window.location.href = `editar-empresa.html?id=${empresa.id}`;
                break;
                
            case 'contact':
                // Simula ligação
                alert(`📞 Ligando para ${empresa.nome}\n\n${formatarTelefone(empresa.telefone)}\n\nEm um app real, isso abriria o discador do telefone.`);
                break;
        }
    }
    
    // ========================================
    // NOTIFICAÇÃO
    // ========================================
    function showNotification(message, tipo = 'success') {
        const cores = {
            success: 'rgba(40, 167, 69, 0.95)',
            error: 'rgba(220, 53, 69, 0.95)',
            info: 'rgba(13, 102, 119, 0.95)'
        };
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${cores[tipo] || cores.success};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            max-width: 400px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ========================================
    // FILTRAR EMPRESAS
    // ========================================
    function filterCompanies(searchTerm) {
        const items = document.querySelectorAll('.company-item');
        let visibleCount = 0;
        
        items.forEach(item => {
            const name = item.querySelector('.company-name').textContent.toLowerCase();
            const email = item.querySelector('.company-address span').textContent.toLowerCase();
            const cnpj = item.querySelector('.company-cnpj span').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || email.includes(searchTerm) || cnpj.includes(searchTerm)) {
                item.style.display = 'flex';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Mostra empty state se não houver resultados
        if (visibleCount === 0 && empresas.length > 0) {
            emptyState.style.display = 'flex';
            emptyState.querySelector('h3').textContent = 'Nenhuma empresa encontrada';
            emptyState.querySelector('p').textContent = `Nenhum resultado para "${searchInput.value}"`;
        } else if (visibleCount > 0) {
            emptyState.style.display = 'none';
        }
    }
    
    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    // Pesquisa
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterCompanies(e.target.value.toLowerCase());
        });
    }
    
    // Limpar pesquisa
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterCompanies('');
            emptyState.style.display = 'none';
            if (empresas.length > 0) {
                companiesList.style.display = 'grid';
            }
            searchInput.focus();
        });
    }
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = '../Home/index.html';
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
    
    // ========================================
    // ESTILOS DINÂMICOS
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOut {
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
    
    // ========================================
    // INICIALIZA A PÁGINA
    // ========================================
    buscarEmpresas();
    
    console.log('✅ SecureWay - Lista de Empresas carregada!');
    console.log('📡 API URL:', API_URL);
});