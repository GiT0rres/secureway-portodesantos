// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const btnAddMotorista = document.getElementById('btnAddMotorista');
    const btnAddFromEmpty = document.getElementById('btnAddFromEmpty');
    const btnExport = document.getElementById('btnExport');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const filterOrdem = document.getElementById('filterOrdem');
    const motoristasGrid = document.getElementById('motoristasGrid');
    const emptyState = document.getElementById('emptyState');
    const modal = document.getElementById('modalDetalhes');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnEditarMotorista = document.getElementById('btnEditarMotorista');
    const btnDeletarMotorista = document.getElementById('btnDeletarMotorista');

    // Dados dos motoristas (simulação - normalmente viria de um banco de dados)
    let motoristas = [
        {
            id: 1,
            nome: 'Sérgio Andrade',
            cpf: '123.456.789-00',
            cnh: '12345678900',
            telefone: '(11) 98765-4321',
            email: 'sergio.andrade@email.com',
            status: 'ativo',
            dataCadastro: '15/01/2024'
        },
        {
            id: 2,
            nome: 'Carlos Silva',
            cpf: '987.654.321-00',
            cnh: '98765432100',
            telefone: '(11) 91234-5678',
            email: 'carlos.silva@email.com',
            status: 'ativo',
            dataCadastro: '20/01/2024'
        },
        {
            id: 3,
            nome: 'Maria Santos',
            cpf: '456.789.123-00',
            cnh: '45678912300',
            telefone: '(11) 99876-5432',
            email: 'maria.santos@email.com',
            status: 'inativo',
            dataCadastro: '10/02/2024'
        },
        {
            id: 4,
            nome: 'João Oliveira',
            cpf: '321.654.987-00',
            cnh: '32165498700',
            telefone: '(11) 97654-3210',
            email: 'joao.oliveira@email.com',
            status: 'ativo',
            dataCadastro: '05/03/2024'
        },
        {
            id: 5,
            nome: 'Ana Costa',
            cpf: '159.753.486-00',
            cnh: '15975348600',
            telefone: '(11) 96543-2109',
            email: 'ana.costa@email.com',
            status: 'suspenso',
            dataCadastro: '12/03/2024'
        }
    ];

    let motoristaSelecionado = null;
    let motoristasFiltrados = [...motoristas];

    // Função para obter iniciais do nome
    function getIniciais(nome) {
        const partes = nome.split(' ');
        if (partes.length >= 2) {
            return partes[0][0] + partes[1][0];
        }
        return partes[0][0];
    }

    // Função para renderizar motoristas
    function renderizarMotoristas(lista) {
        motoristasGrid.innerHTML = '';
        
        if (lista.length === 0) {
            emptyState.style.display = 'block';
            motoristasGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            motoristasGrid.style.display = 'grid';
            
            lista.forEach(motorista => {
                const card = document.createElement('div');
                card.className = 'motorista-card';
                card.dataset.id = motorista.id;
                
                card.innerHTML = `
                    <div class="motorista-header">
                        <div class="motorista-avatar">${getIniciais(motorista.nome)}</div>
                        <span class="motorista-status status-${motorista.status}">
                            ${motorista.status.charAt(0).toUpperCase() + motorista.status.slice(1)}
                        </span>
                    </div>
                    <div class="motorista-info">
                        <h3>${motorista.nome}</h3>
                        <p>CPF: ${motorista.cpf}</p>
                        <p>CNH: ${motorista.cnh}</p>
                        <p>${motorista.telefone}</p>
                    </div>
                    <div class="motorista-footer">
                        <span class="motorista-date">Desde ${motorista.dataCadastro}</span>
                        <button class="btn-view-details">Ver Detalhes</button>
                    </div>
                `;
                
                card.addEventListener('click', () => abrirModal(motorista));
                motoristasGrid.appendChild(card);
            });
        }
        
        console.log(`✅ ${lista.length} motorista(s) renderizado(s)`);
    }

    // Função para abrir modal com detalhes
    function abrirModal(motorista) {
        motoristaSelecionado = motorista;
        
        document.getElementById('modalNome').textContent = motorista.nome;
        document.getElementById('modalCpf').textContent = motorista.cpf;
        document.getElementById('modalCnh').textContent = motorista.cnh;
        document.getElementById('modalTelefone').textContent = motorista.telefone;
        document.getElementById('modalEmail').textContent = motorista.email;
        document.getElementById('modalData').textContent = motorista.dataCadastro;
        
        const statusElement = document.getElementById('modalStatus');
        statusElement.textContent = motorista.status.charAt(0).toUpperCase() + motorista.status.slice(1);
        statusElement.className = `motorista-status status-${motorista.status}`;
        
        modal.classList.add('show');
        console.log('📋 Modal aberto para:', motorista.nome);
    }

    // Função para fechar modal
    function fecharModal() {
        modal.classList.remove('show');
        motoristaSelecionado = null;
        console.log('❌ Modal fechado');
    }

    // Função de busca
    function buscarMotoristas() {
        const termo = searchInput.value.toLowerCase();
        const status = filterStatus.value;
        
        let resultados = motoristas.filter(motorista => {
            const matchBusca = motorista.nome.toLowerCase().includes(termo) ||
                              motorista.cpf.includes(termo) ||
                              motorista.cnh.includes(termo);
            
            const matchStatus = status === 'todos' || motorista.status === status;
            
            return matchBusca && matchStatus;
        });
        
        ordenarMotoristas(resultados);
        console.log(`🔍 Busca realizada: ${resultados.length} resultado(s)`);
    }

    // Função de ordenação
    function ordenarMotoristas(lista) {
        const ordem = filterOrdem.value;
        
        switch(ordem) {
            case 'nome':
                lista.sort((a, b) => a.nome.localeCompare(b.nome));
                break;
            case 'data':
                lista.sort((a, b) => {
                    const dataA = a.dataCadastro.split('/').reverse().join('');
                    const dataB = b.dataCadastro.split('/').reverse().join('');
                    return dataB.localeCompare(dataA);
                });
                break;
            case 'status':
                lista.sort((a, b) => a.status.localeCompare(b.status));
                break;
        }
        
        motoristasFiltrados = lista;
        renderizarMotoristas(lista);
    }

    // Função para mostrar notificação
    function mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        
        const cores = {
            success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            info: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
        };
        
        notificacao.style.background = cores[tipo] || cores.success;
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notificacao.remove(), 400);
        }, 3000);
    }

    // Função para exportar dados
    function exportarMotoristas() {
        console.log('📊 Exportando dados...');
        
        // Simula exportação para CSV
        let csv = 'Nome,CPF,CNH,Telefone,E-mail,Status,Data de Cadastro\n';
        
        motoristasFiltrados.forEach(motorista => {
            csv += `${motorista.nome},${motorista.cpf},${motorista.cnh},${motorista.telefone},${motorista.email},${motorista.status},${motorista.dataCadastro}\n`;
        });
        
        // Cria arquivo para download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `motoristas_${new Date().getTime()}.csv`);
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        mostrarNotificacao('✓ Dados exportados com sucesso!', 'success');
    }

    // Função para adicionar motorista
    function adicionarMotorista() {
        console.log('➕ Adicionar novo motorista');
        mostrarNotificacao('Funcionalidade de cadastro em desenvolvimento', 'info');
        // Aqui você redirecionaria para uma página de cadastro
        // window.location.href = 'cadastro-motorista.html';
    }

    // Função para editar motorista
    function editarMotorista() {
        if (motoristaSelecionado) {
            console.log('✏️ Editar motorista:', motoristaSelecionado.nome);
            mostrarNotificacao('Funcionalidade de edição em desenvolvimento', 'info');
            fecharModal();
        }
    }

    // Função para deletar motorista
    function deletarMotorista() {
        if (!motoristaSelecionado) return;
        
        if (confirm(`Deseja realmente excluir o motorista ${motoristaSelecionado.nome}?\n\nEsta ação não pode ser desfeita.`)) {
            const index = motoristas.findIndex(m => m.id === motoristaSelecionado.id);
            
            if (index !== -1) {
                motoristas.splice(index, 1);
                console.log('🗑️ Motorista excluído:', motoristaSelecionado.nome);
                mostrarNotificacao('✓ Motorista excluído com sucesso!', 'success');
                fecharModal();
                buscarMotoristas();
            }
        }
    }

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', buscarMotoristas);
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', buscarMotoristas);
    }

    if (filterOrdem) {
        filterOrdem.addEventListener('change', buscarMotoristas);
    }

    if (btnAddMotorista) {
        btnAddMotorista.addEventListener('click', adicionarMotorista);
    }

    if (btnAddFromEmpty) {
        btnAddFromEmpty.addEventListener('click', adicionarMotorista);
    }

    if (btnExport) {
        btnExport.addEventListener('click', exportarMotoristas);
    }

    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', fecharModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', fecharModal);
    }

    if (btnEditarMotorista) {
        btnEditarMotorista.addEventListener('click', editarMotorista);
    }

    if (btnDeletarMotorista) {
        btnDeletarMotorista.addEventListener('click', deletarMotorista);
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            fecharModal();
        }
    });

    // Renderiza motoristas ao carregar
    renderizarMotoristas(motoristas);
    
    console.log('🚀 SecureWay - Motoristas Cadastrados carregado com sucesso!');
    console.log(`📊 Total de motoristas: ${motoristas.length}`);
});