const API_URL = 'http://localhost:3034/api';

document.addEventListener('DOMContentLoaded', async function() {
    
    const btnNovoAgendamento = document.getElementById('btnNovoAgendamento');
    const btnsFiltro = document.querySelectorAll('.btn-filtro');
    const agendamentosContainer = document.querySelector('.agendamentos-container');
    const noAgendamentos = document.getElementById('noAgendamentos');
    
    let agendamentos = [];
    let filtroAtual = 'todos';

    // BUSCAR AGENDAMENTOS DA API
    async function buscarAgendamentos() {
        try {
            console.log('Buscando agendamentos...');
            
            const response = await fetch(`${API_URL}/scheduling`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            agendamentos = await response.json();
            console.log('✅ Agendamentos carregados:', agendamentos);
            
            renderizarAgendamentos();
            
        } catch (error) {
            console.error('❌ Erro ao buscar agendamentos:', error);
            if (noAgendamentos) {
                noAgendamentos.style.display = 'block';
                noAgendamentos.innerHTML = '<h3>Erro ao carregar agendamentos</h3><p>Verifique se a API está rodando</p>';
            }
        }
    }
    
    // RENDERIZAR AGENDAMENTOS NA TELA
    function renderizarAgendamentos() {
        if (!agendamentosContainer) return;
        
        // Remove agendamentos antigos (que estão hardcoded no HTML)
        agendamentosContainer.querySelectorAll('.agendamento-card').forEach(card => card.remove());
        
        // Filtra agendamentos
        const agendamentosFiltrados = filtroAtual === 'todos' 
            ? agendamentos 
            : agendamentos.filter(a => determinarStatus(a) === filtroAtual);
        
        console.log(`Agendamentos filtrados (${filtroAtual}):`, agendamentosFiltrados.length);
        
        if (agendamentosFiltrados.length === 0) {
            if (noAgendamentos) {
                noAgendamentos.style.display = 'block';
            }
            return;
        }
        
        if (noAgendamentos) {
            noAgendamentos.style.display = 'none';
        }
        
        agendamentosFiltrados.forEach(agendamento => {
            const card = criarCardAgendamento(agendamento);
            agendamentosContainer.appendChild(card);
        });
    }
    
    // CRIAR CARD HTML
    function criarCardAgendamento(agendamento) {
        const card = document.createElement('div');
        card.className = 'agendamento-card';
        card.dataset.id = agendamento.id;
        
        const status = determinarStatus(agendamento);
        card.dataset.status = status;
        
        const dataFormatada = formatarData(agendamento.dataHora);
        
        card.innerHTML = `
            <div class="agendamento-status ${status}">
                ${status === 'pendente' ? 'Pendente' : status === 'confirmado' ? 'Confirmado' : 'Concluído'}
            </div>
            <div class="agendamento-header">
                <div class="agendamento-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </div>
                <div class="agendamento-info">
                    <h3 class="agendamento-titulo">${agendamento.carga}</h3>
                    <p class="agendamento-descricao">${agendamento.empresa}</p>
                </div>
            </div>
            <div class="agendamento-detalhes">
                <div class="detalhe-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${dataFormatada.data}</span>
                </div>
                <div class="detalhe-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${dataFormatada.hora}</span>
                </div>
                <div class="detalhe-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>${agendamento.local}</span>
                </div>
            </div>
            <div class="agendamento-acoes">
                ${status !== 'concluido' ? `
                    <button class="btn-acao btn-editar" data-id="${agendamento.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar
                    </button>
                    <button class="btn-acao btn-cancelar" data-id="${agendamento.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        Cancelar
                    </button>
                ` : `
                    <button class="btn-acao btn-visualizar" data-id="${agendamento.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Detalhes
                    </button>
                `}
            </div>
        `;
        
        const btnEditar = card.querySelector('.btn-editar');
        const btnCancelar = card.querySelector('.btn-cancelar');
        const btnVisualizar = card.querySelector('.btn-visualizar');
        
        if (btnEditar) {
            btnEditar.addEventListener('click', (e) => {
                e.stopPropagation();
                editarAgendamento(agendamento.id);
            });
        }
        
        if (btnCancelar) {
            btnCancelar.addEventListener('click', (e) => {
                e.stopPropagation();
                cancelarAgendamento(agendamento.id);
            });
        }
        
        if (btnVisualizar) {
            btnVisualizar.addEventListener('click', (e) => {
                e.stopPropagation();
                visualizarDetalhes(agendamento.id);
            });
        }
        
        return card;
    }
    
    // REDIRECIONAR PARA NOVO AGENDAMENTO
    function criarNovoAgendamento() {
        window.location.href = 'novo-agendamento.html';
    }
    
    // EDITAR AGENDAMENTO
    async function editarAgendamento(id) {
        const agendamento = agendamentos.find(a => a.id === id);
        if (!agendamento) return;
        
        const novoLocal = prompt('Novo local:', agendamento.local);
        if (!novoLocal) return;
        
        try {
            const response = await fetch(`${API_URL}/scheduling/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ local: novoLocal })
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar');
            
            console.log('✅ Agendamento atualizado');
            buscarAgendamentos();
            
        } catch (error) {
            console.error('❌ Erro ao atualizar:', error);
            alert('Erro ao atualizar agendamento');
        }
    }
    
    // CANCELAR AGENDAMENTO
    async function cancelarAgendamento(id) {
        const agendamento = agendamentos.find(a => a.id === id);
        if (!agendamento) return;
        
        if (!confirm(`Deseja cancelar o agendamento "${agendamento.carga}"?`)) return;
        
        try {
            const response = await fetch(`${API_URL}/scheduling/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Erro ao cancelar');
            
            console.log('✅ Agendamento cancelado');
            buscarAgendamentos();
            
        } catch (error) {
            console.error('❌ Erro ao cancelar:', error);
            alert('Erro ao cancelar agendamento');
        }
    }
    
    // VISUALIZAR DETALHES
    function visualizarDetalhes(id) {
        const agendamento = agendamentos.find(a => a.id === id);
        if (!agendamento) return;
        
        alert(`
Detalhes do Agendamento:

Empresa: ${agendamento.empresa}
Local: ${agendamento.local}
Carga: ${agendamento.carga}
Data: ${formatarData(agendamento.dataHora).completo}
Status: ${agendamento.disponivel ? 'Disponível' : 'Indisponível'}
        `);
    }
    
    // FUNÇÕES AUXILIARES
    
    function determinarStatus(agendamento) {
        const dataAgendamento = new Date(agendamento.dataHora);
        const agora = new Date();
        
        if (dataAgendamento < agora) return 'concluido';
        if (agendamento.disponivel) return 'confirmado';
        return 'pendente';
    }
    
    function formatarData(dataISO) {
        const data = new Date(dataISO);
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        
        return {
            data: `${dia}/${mes}/${ano}`,
            hora: `${hora}:${minuto}`,
            completo: `${dia}/${mes}/${ano} às ${hora}:${minuto}`
        };
    }
    
    // EVENT LISTENERS
    
    if (btnNovoAgendamento) {
        btnNovoAgendamento.addEventListener('click', criarNovoAgendamento);
    }
    
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', function() {
            btnsFiltro.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            filtroAtual = this.getAttribute('data-status');
            renderizarAgendamentos();
            
            console.log('Filtrando por:', filtroAtual);
        });
    });
    
    // INICIALIZAÇÃO
    buscarAgendamentos();
    
    console.log('✅ Index carregado');
    console.log('API URL:', API_URL);
});