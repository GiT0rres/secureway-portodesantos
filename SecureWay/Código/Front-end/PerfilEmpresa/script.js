// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const btnHome = document.getElementById('btnHome');
    const chatBtn = document.getElementById('chatBtn');
    const navBtns = document.querySelectorAll('.nav-button');
    
    // Dados de exemplo para Sedes
    const sedesData = [
        {
            nome: 'Sede Central',
            endereco: 'Av. Paulista, 1000 - São Paulo, SP',
            telefone: '(11) 3000-0000'
        },
        {
            nome: 'Filial Rio de Janeiro',
            endereco: 'Av. Rio Branco, 500 - Rio de Janeiro, RJ',
            telefone: '(21) 3000-0000'
        },
        {
            nome: 'Filial Belo Horizonte',
            endereco: 'Av. Afonso Pena, 1500 - Belo Horizonte, MG',
            telefone: '(31) 3000-0000'
        }
    ];
    
    // Dados de exemplo para Horários
    const horariosData = {
        semana: 'Segunda a Sexta: 08:00 - 18:00',
        sabado: 'Sábado: 08:00 - 12:00',
        domingo: 'Domingo: Fechado',
        observacao: 'Horário de almoço: 12:00 - 13:00'
    };
    
    // Função para trocar de tab
    function switchTab(tabName) {
        // Remove active de todas as tabs e panes
        tabs.forEach(tab => tab.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Adiciona active na tab e pane selecionadas
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        const selectedPane = document.getElementById(`content${capitalize(tabName)}`);
        
        if (selectedTab && selectedPane) {
            selectedTab.classList.add('active');
            selectedPane.classList.add('active');
            
            // Carrega conteúdo da tab
            loadTabContent(tabName);
        }
    }
    
    // Função para carregar conteúdo da tab
    function loadTabContent(tabName) {
        const contentArea = document.querySelector(`#content${capitalize(tabName)} .content-area`);
        
        if (tabName === 'sedes') {
            contentArea.innerHTML = generateSedesContent();
        } else if (tabName === 'horarios') {
            contentArea.innerHTML = generateHorariosContent();
        }
    }
    
    // Gera conteúdo de Sedes
    function generateSedesContent() {
        return `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${sedesData.map(sede => `
                    <div style="background: rgba(255, 255, 255, 0.2); padding: 16px; border-radius: 12px;">
                        <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; color: #0a2832;">${sede.nome}</h3>
                        <p style="font-size: 0.95rem; color: #0a2832; margin-bottom: 4px;">${sede.endereco}</p>
                        <p style="font-size: 0.9rem; color: #1a4050; font-weight: 500;">${sede.telefone}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Gera conteúdo de Horários
    function generateHorariosContent() {
        return `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div style="background: rgba(255, 255, 255, 0.2); padding: 16px; border-radius: 12px;">
                    <h3 style="font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; color: #0a2832;">Horário de Funcionamento</h3>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <p style="font-size: 0.95rem; color: #0a2832;"><strong>Segunda a Sexta:</strong> 08:00 - 18:00</p>
                        <p style="font-size: 0.95rem; color: #0a2832;"><strong>Sábado:</strong> 08:00 - 12:00</p>
                        <p style="font-size: 0.95rem; color: #0a2832;"><strong>Domingo:</strong> Fechado</p>
                    </div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.15); padding: 14px; border-radius: 12px;">
                    <p style="font-size: 0.9rem; color: #0a2832; font-style: italic;"><strong>Obs:</strong> Horário de almoço: 12:00 - 13:00</p>
                </div>
            </div>
        `;
    }
    
    // Função auxiliar para capitalizar
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Event listeners para as tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
    
    // Botão de Chat
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            console.log('Abrindo chat...');
            alert('Função de chat será implementada em breve!');
        });
    }
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Navegação inferior
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (btn.id !== 'btnHome') {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log('Navegação alterada:', index);
            }
        });
    });
    
    // Carrega conteúdo inicial (Sedes)
    loadTabContent('sedes');
    
    console.log('SecureWay - Empresas carregada com sucesso!');
});