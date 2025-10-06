// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const btnNovoAgendamento = document.getElementById('btnNovoAgendamento');
    const navBtns = document.querySelectorAll('.nav-btn');
    const btnsFiltro = document.querySelectorAll('.btn-filtro');
    const agendamentosContainer = document.querySelector('.agendamentos-container');
    const noAgendamentos = document.getElementById('noAgendamentos');
    
    // Contador de agendamentos
    let totalAgendamentos = document.querySelectorAll('.agendamento-card').length;
    
    // Função para verificar se há agendamentos visíveis
    function verificarAgendamentos() {
        const agendamentosVisiveis = agendamentosContainer.querySelectorAll('.agendamento-card:not(.removing):not([style*="display: none"])').length;
        
        if (agendamentosVisiveis === 0) {
            noAgendamentos.style.display = 'block';
        } else {
            noAgendamentos.style.display = 'none';
        }
        
        console.log(`📊 Agendamentos visíveis: ${agendamentosVisiveis}`);
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
    
    // Função para cancelar agendamento
    function cancelarAgendamento(agendamentoCard, agendamentoId) {
        agendamentoCard.classList.add('removing');
        
        const titulo = agendamentoCard.querySelector('.agendamento-titulo').textContent;
        console.log(`🗑️ Cancelando agendamento ID: ${agendamentoId} - ${titulo}`);
        
        setTimeout(() => {
            agendamentoCard.remove();
            totalAgendamentos--;
            verificarAgendamentos();
            
            mostrarNotificacao('Agendamento cancelado com sucesso', 'info');
        }, 400);
    }
    
    // Função para editar agendamento
    function editarAgendamento(agendamentoId) {
        const agendamentoCard = document.querySelector(`.agendamento-card .btn-editar[data-id="${agendamentoId}"]`).closest('.agendamento-card');
        const titulo = agendamentoCard.querySelector('.agendamento-titulo').textContent;
        
        console.log(`✏️ Editando agendamento ID: ${agendamentoId} - ${titulo}`);
        mostrarNotificacao('Função de edição em desenvolvimento', 'info');
        
        // Aqui você pode adicionar a lógica para abrir um modal de edição
        // ou redirecionar para uma página de edição
    }
    
    // Função para visualizar detalhes
    function visualizarDetalhes(agendamentoId) {
        const agendamentoCard = document.querySelector(`.agendamento-card .btn-visualizar[data-id="${agendamentoId}"]`).closest('.agendamento-card');
        const titulo = agendamentoCard.querySelector('.agendamento-titulo').textContent;
        
        console.log(`👁️ Visualizando detalhes ID: ${agendamentoId} - ${titulo}`);
        mostrarNotificacao('Abrindo detalhes do agendamento', 'info');
        
        // Aqui você pode adicionar a lógica para abrir um modal com detalhes
    }
    
    // Função para filtrar agendamentos
    function filtrarAgendamentos(status) {
        const todosAgendamentos = document.querySelectorAll('.agendamento-card');
        
        todosAgendamentos.forEach(card => {
            if (status === 'todos') {
                card.style.display = 'block';
            } else {
                const cardStatus = card.getAttribute('data-status');
                if (cardStatus === status) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
        
        verificarAgendamentos();
        console.log(`🔍 Filtrando por: ${status}`);
    }
    
    // Event listeners para botões de filtro
    btnsFiltro.forEach(btn => {
        btn.addEventListener('click', function() {
            btnsFiltro.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const status = this.getAttribute('data-status');
            filtrarAgendamentos(status);
        });
    });
    
    // Event listeners para botões de editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const agendamentoId = this.getAttribute('data-id');
            editarAgendamento(agendamentoId);
        });
    });
    
    // Event listeners para botões de cancelar
    document.querySelectorAll('.btn-cancelar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const agendamentoCard = this.closest('.agendamento-card');
            const agendamentoId = this.getAttribute('data-id');
            const titulo = agendamentoCard.querySelector('.agendamento-titulo').textContent;
            
            if (confirm(`Deseja cancelar o agendamento "${titulo}"?`)) {
                cancelarAgendamento(agendamentoCard, agendamentoId);
            }
        });
    });
    
    // Event listeners para botões de visualizar
    document.querySelectorAll('.btn-visualizar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const agendamentoId = this.getAttribute('data-id');
            visualizarDetalhes(agendamentoId);
        });
    });
    
    // Click no card para expandir (opcional)
    document.querySelectorAll('.agendamento-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-acao')) return;
            
            const titulo = this.querySelector('.agendamento-titulo').textContent;
            console.log(`📋 Card selecionado: ${titulo}`);
        });
    });
    
    // Botão Novo Agendamento
    if (btnNovoAgendamento) {
        btnNovoAgendamento.addEventListener('click', function() {
            console.log('➕ Criar novo agendamento');
            mostrarNotificacao('Abrindo formulário de novo agendamento', 'info');
            
            // Aqui você pode adicionar a lógica para abrir um modal
            // ou redirecionar para uma página de criação
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
    
    // Atalho de teclado para criar novo agendamento (Ctrl + N)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            btnNovoAgendamento.click();
        }
    });
    
    // Atalho de teclado para limpar filtros (Ctrl + Shift + F)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'F') {
            e.preventDefault();
            
            btnsFiltro.forEach(b => b.classList.remove('active'));
            document.querySelector('.btn-filtro[data-status="todos"]').classList.add('active');
            filtrarAgendamentos('todos');
            
            mostrarNotificacao('Filtros limpos', 'info');
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
    console.log('✅ SecureWay - Agendamentos carregado com sucesso!');
    console.log(`📊 Total de agendamentos: ${totalAgendamentos}`);
    console.log('⌨️ Atalhos:');
    console.log('  - Ctrl + N: Novo agendamento');
    console.log('  - Ctrl + Shift + F: Limpar filtros');
    
    // Verifica estado inicial
    verificarAgendamentos();
});