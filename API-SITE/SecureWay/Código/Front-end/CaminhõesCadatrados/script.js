// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const btnNovoCaminhao = document.getElementById('btnNovoCaminhao');
    const searchInput = document.getElementById('searchInput');
    const navBtns = document.querySelectorAll('.nav-btn');
    const caminhoesContainer = document.querySelector('.caminhoes-container');
    const noCaminhoes = document.getElementById('noCaminhoes');
    
    // Contador de caminhões
    let totalCaminhoes = document.querySelectorAll('.caminhao-card').length;
    
    // Função para verificar se há caminhões visíveis
    function verificarCaminhoes() {
        const caminhoesVisiveis = caminhoesContainer.querySelectorAll('.caminhao-card:not(.removing):not([style*="display: none"])').length;
        
        if (caminhoesVisiveis === 0) {
            noCaminhoes.style.display = 'block';
        } else {
            noCaminhoes.style.display = 'none';
        }
        
        console.log(`📊 Caminhões visíveis: ${caminhoesVisiveis}`);
    }
    
    // Função para mostrar notificação temporária
    function mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        
        let backgroundColor;
        switch(tipo) {
            case 'success':
                backgroundColor = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                break;
            case 'error':
                backgroundColor = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                break;
            case 'info':
                backgroundColor = 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)';
                break;
            case 'warning':
                backgroundColor = 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
                break;
            default:
                backgroundColor = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        }
        
        notificacao.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${backgroundColor};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-weight: 500;
            z-index: 1000;
            animation: slideInRight 0.4s ease;
        `;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                notificacao.remove();
            }, 400);
        }, 3000);
    }
    
    // Função para remover caminhão
    function removerCaminhao(caminhaoCard, caminhaoId) {
        caminhaoCard.classList.add('removing');
        
        const modelo = caminhaoCard.querySelector('.caminhao-modelo').textContent;
        const placa = caminhaoCard.querySelector('.caminhao-placa').textContent;
        
        console.log(`🗑️ Removendo caminhão ID: ${caminhaoId} - ${modelo} (${placa})`);
        
        setTimeout(() => {
            caminhaoCard.remove();
            totalCaminhoes--;
            verificarCaminhoes();
            
            mostrarNotificacao('Caminhão removido com sucesso', 'info');
        }, 400);
    }
    
    // Função para editar caminhão
    function editarCaminhao(caminhaoId) {
        const caminhaoCard = document.querySelector(`.caminhao-card .btn-editar[data-id="${caminhaoId}"]`).closest('.caminhao-card');
        const modelo = caminhaoCard.querySelector('.caminhao-modelo').textContent;
        const placa = caminhaoCard.querySelector('.caminhao-placa').textContent;
        
        console.log(`✏️ Editando caminhão ID: ${caminhaoId} - ${modelo} (${placa})`);
        mostrarNotificacao('Abrindo formulário de edição', 'info');
        
        // Aqui você pode adicionar a lógica para abrir um modal de edição
    }
    
    // Função para visualizar detalhes
    function visualizarDetalhes(caminhaoId) {
        const caminhaoCard = document.querySelector(`.caminhao-card .btn-visualizar[data-id="${caminhaoId}"]`).closest('.caminhao-card');
        const modelo = caminhaoCard.querySelector('.caminhao-modelo').textContent;
        const placa = caminhaoCard.querySelector('.caminhao-placa').textContent;
        
        console.log(`👁️ Visualizando detalhes ID: ${caminhaoId} - ${modelo} (${placa})`);
        mostrarNotificacao('Abrindo detalhes do veículo', 'info');
        
        // Aqui você pode adicionar a lógica para abrir um modal com detalhes completos
    }
    
    // Função de busca
    function buscarCaminhoes(termo) {
        const todosCaminhoes = document.querySelectorAll('.caminhao-card');
        termo = termo.toLowerCase().trim();
        
        let encontrados = 0;
        
        todosCaminhoes.forEach(card => {
            const modelo = card.querySelector('.caminhao-modelo').textContent.toLowerCase();
            const placa = card.querySelector('.caminhao-placa').textContent.toLowerCase();
            const motorista = card.querySelector('.detalhe-valor').textContent.toLowerCase();
            
            if (modelo.includes(termo) || placa.includes(termo) || motorista.includes(termo)) {
                card.style.display = 'block';
                encontrados++;
            } else {
                card.style.display = 'none';
            }
        });
        
        verificarCaminhoes();
        
        if (termo && encontrados > 0) {
            console.log(`🔍 Busca: "${termo}" - ${encontrados} resultado(s)`);
        }
    }
    
    // Event listener para busca
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            buscarCaminhoes(e.target.value);
        });
        
        // Limpar busca com Esc
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                buscarCaminhoes('');
                this.blur();
            }
        });
    }
    
    // Event listeners para botões de visualizar
    document.querySelectorAll('.btn-visualizar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const caminhaoId = this.getAttribute('data-id');
            visualizarDetalhes(caminhaoId);
        });
    });
    
    // Event listeners para botões de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const caminhaoId = this.getAttribute('data-id');
            editarCaminhao(caminhaoId);
        });
    });
    
    // Event listeners para botões de remover
    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const caminhaoCard = this.closest('.caminhao-card');
            const caminhaoId = this.getAttribute('data-id');
            const modelo = caminhaoCard.querySelector('.caminhao-modelo').textContent;
            const placa = caminhaoCard.querySelector('.caminhao-placa').textContent;
            
            if (confirm(`Deseja remover o caminhão "${modelo}" (${placa})?`)) {
                removerCaminhao(caminhaoCard, caminhaoId);
            }
        });
    });
    
    // Click no card para expandir (opcional)
    document.querySelectorAll('.caminhao-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-acao')) return;
            
            const modelo = this.querySelector('.caminhao-modelo').textContent;
            const placa = this.querySelector('.caminhao-placa').textContent;
            console.log(`📋 Card selecionado: ${modelo} (${placa})`);
        });
    });
    
    // Botão Novo Caminhão
    if (btnNovoCaminhao) {
        btnNovoCaminhao.addEventListener('click', function() {
            console.log('➕ Cadastrar novo caminhão');
            mostrarNotificacao('Abrindo formulário de cadastro', 'info');
            
            // Aqui você pode adicionar a lógica para abrir um modal de cadastro
        });
    }
    
    // Botão Home
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
    
    // Atalho de teclado para novo caminhão (Ctrl + N)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            btnNovoCaminhao.click();
        }
    });
    
    // Atalho de teclado para focar na busca (Ctrl + K)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
    
    // Atalho de teclado para limpar busca (Ctrl + Shift + C)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            searchInput.value = '';
            buscarCaminhoes('');
            mostrarNotificacao('Busca limpa', 'info');
        }
    });
    
    // Estatísticas dos caminhões
    function calcularEstatisticas() {
        const ativos = document.querySelectorAll('.caminhao-card[data-status="ativo"]').length;
        const manutencao = document.querySelectorAll('.caminhao-card[data-status="manutencao"]').length;
        const inativos = document.querySelectorAll('.caminhao-card[data-status="inativo"]').length;
        
        console.log('📈 Estatísticas da Frota:');
        console.log(`  - Ativos: ${ativos}`);
        console.log(`  - Em Manutenção: ${manutencao}`);
        console.log(`  - Inativos: ${inativos}`);
        console.log(`  - Total: ${totalCaminhoes}`);
    }
    
    // Função para exportar dados (simulação)
    function exportarDados() {
        const caminhoes = [];
        document.querySelectorAll('.caminhao-card').forEach(card => {
            const dados = {
                modelo: card.querySelector('.caminhao-modelo').textContent,
                placa: card.querySelector('.caminhao-placa').textContent,
                status: card.getAttribute('data-status'),
                motorista: card.querySelectorAll('.detalhe-valor')[0].textContent,
                ano: card.querySelectorAll('.detalhe-valor')[1].textContent
            };
            caminhoes.push(dados);
        });
        
        console.log('📤 Dados exportados:', caminhoes);
        mostrarNotificacao(`${caminhoes.length} veículos exportados`, 'success');
        
        // Aqui você pode adicionar lógica para exportar para CSV, Excel, etc.
    }
    
    // Atalho para exportar dados (Ctrl + E)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            exportarDados();
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
        
        /* Highlight na busca */
        .caminhao-card.highlight {
            animation: pulse 0.6s ease;
        }
        
        @keyframes pulse {
            0%, 100% {
                border-color: rgba(255, 255, 255, 0.15);
            }
            50% {
                border-color: rgba(40, 167, 69, 0.6);
                box-shadow: 0 0 20px rgba(40, 167, 69, 0.4);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Log inicial
    console.log('✅ SecureWay - Caminhões Cadastrados carregado com sucesso!');
    console.log(`🚛 Total de caminhões: ${totalCaminhoes}`);
    console.log('⌨️ Atalhos:');
    console.log('  - Ctrl + N: Novo caminhão');
    console.log('  - Ctrl + K: Focar na busca');
    console.log('  - Ctrl + Shift + C: Limpar busca');
    console.log('  - Ctrl + E: Exportar dados');
    console.log('  - Esc: Limpar campo de busca');
    
    // Calcula estatísticas iniciais
    calcularEstatisticas();
    
    // Verifica estado inicial
    verificarCaminhoes();
});