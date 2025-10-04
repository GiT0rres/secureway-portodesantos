// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
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
        },
        {
            nome: 'Filial Curitiba',
            endereco: 'Rua XV de Novembro, 800 - Curitiba, PR',
            telefone: '(41) 3000-0000'
        },
        {
            nome: 'Filial Porto Alegre',
            endereco: 'Av. Borges de Medeiros, 1200 - Porto Alegre, RS',
            telefone: '(51) 3000-0000'
        },
        {
            nome: 'Filial Salvador',
            endereco: 'Av. Tancredo Neves, 900 - Salvador, BA',
            telefone: '(71) 3000-0000'
        }
    ];
    
    // Função para gerar conteúdo de sedes
    function generateSedesContent() {
        const content = sedesData.map(sede => `
            <div class="card">
                <h3>${sede.nome}</h3>
                <p><strong>Endereço:</strong> ${sede.endereco}</p>
                <p><strong>Telefone:</strong> ${sede.telefone}</p>
            </div>
        `).join('');
        document.getElementById('sedesContent').innerHTML = content;
    }
    
    // Função para gerar conteúdo de horários
    function generateHorariosContent() {
        const content = `
            <div class="schedule-card">
                <h3>Horário de Funcionamento</h3>
                <div class="schedule-items">
                    <div class="schedule-item">
                        <strong>Segunda a Sexta</strong>
                        <span>08:00 - 18:00</span>
                    </div>
                    <div class="schedule-item">
                        <strong>Sábado</strong>
                        <span>08:00 - 12:00</span>
                    </div>
                    <div class="schedule-item">
                        <strong>Domingo</strong>
                        <span>Fechado</span>
                    </div>
                </div>
                <div class="schedule-note">
                    <p><strong>Observação:</strong> Horário de almoço: 12:00 - 13:00</p>
                </div>
            </div>
        `;
        document.getElementById('horariosContent').innerHTML = content;
    }
    
    // Gerenciamento de tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Remove active de todas as tabs
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            
            // Adiciona active na tab selecionada
            tab.classList.add('active');
            const contentId = `content${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
            document.getElementById(contentId).classList.add('active');
        });
    });
    
    // Chat button
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            console.log('Abrindo chat...');
            alert('Função de chat será implementada em breve!');
        });
    }
    
    // Home button
    const btnHome = document.getElementById('btnHome');
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Carregar conteúdo inicial
    generateSedesContent();
    generateHorariosContent();
    
    console.log('SecureWay - Site Desktop carregado com sucesso!');
});