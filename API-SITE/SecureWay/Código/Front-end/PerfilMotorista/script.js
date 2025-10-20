// Configuração da API
const API_URL = 'http://localhost:3034/api';

document.addEventListener('DOMContentLoaded', function() {
    // Pegar usuário logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    const userId = localStorage.getItem('userId');

    if (!usuarioLogado || !userId) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = '../Login/index.html';
        return;
    }

    console.log('✅ Usuário logado:', usuarioLogado);

    // Elementos do DOM
    const perfilNome = document.getElementById('perfilNome');
    const btnLogout = document.getElementById('btnLogout');
    const btnHome = document.getElementById('btnHome');
    const btnEdit = document.getElementById('btnEdit');
    const btnAddVeiculo = document.getElementById('btnAddVeiculo');
    const btnChangePhoto = document.getElementById('btnChangePhoto');
    const btnDeleteAccount = document.getElementById('btnDeleteAccount');
    const avatarImg = document.getElementById('avatarImg');
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Atualiza nome do perfil
    if (perfilNome) perfilNome.textContent = usuarioLogado.nome || 'Usuário';

    // Funções principais
    function carregarNomeUsuario() {
        if (perfilNome) {
            perfilNome.textContent = usuarioLogado.nome || 'Usuário';
            console.log('👤 Nome do motorista:', usuarioLogado.nome);
        }
    }

    async function buscarVeiculos() {
        try {
            console.log('🔍 Buscando veículos do usuário...');
            const elementoMarca = document.getElementById('marca');
            const elementoModelo = document.getElementById('modelo');
            const elementoCor = document.getElementById('cor');
            const elementoPlaca = document.getElementById('placa');
            const elementoEtiqueta = document.getElementById('etiqueta');

            if (elementoMarca) elementoMarca.textContent = '-';
            if (elementoModelo) elementoModelo.textContent = '-';
            if (elementoCor) elementoCor.textContent = '-';
            if (elementoPlaca) elementoPlaca.textContent = '-';
            if (elementoEtiqueta) elementoEtiqueta.textContent = usuarioLogado.chaveUnitaria || '-';

            console.log('ℹ️ Nenhum veículo cadastrado no banco de dados');
        } catch (error) {
            console.error('❌ Erro ao buscar veículos:', error);
        }
    }

    async function buscarHistorico() {
        try {
            console.log('🔍 Buscando histórico de agendamentos...');
            const response = await fetch(`${API_URL}/scheduling`);
            if (!response.ok) throw new Error('Erro ao buscar agendamentos');
            const todosAgendamentos = await response.json();

            const agendamentosUsuario = todosAgendamentos.filter(ag => ag.idUsuario === parseInt(userId));
            const historicoContainer = document.querySelector('.historico-container');
            const historicoEmpty = document.getElementById('historicoEmpty');

            if (agendamentosUsuario.length === 0) {
                if (historicoContainer) historicoContainer.innerHTML = '';
                if (historicoEmpty) historicoEmpty.style.display = 'flex';
                console.log('ℹ️ Nenhum histórico encontrado');
            } else {
                if (historicoEmpty) historicoEmpty.style.display = 'none';
                if (historicoContainer) {
                    historicoContainer.innerHTML = '';
                    agendamentosUsuario.forEach(ag => {
                        const dataAgendamento = new Date(ag.dataHora);
                        const dataFormatada = dataAgendamento.toLocaleDateString('pt-BR');
                        const horaFormatada = dataAgendamento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                        const item = document.createElement('div');
                        item.className = 'historico-item';
                        item.innerHTML = `
                            <div class="historico-icon ${ag.disponivel ? 'info' : 'success'}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    ${ag.disponivel ? 
                                        '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>' :
                                        '<polyline points="20 6 9 17 4 12"></polyline>'
                                    }
                                </svg>
                            </div>
                            <div class="historico-info">
                                <h4>${ag.disponivel ? 'Agendamento Pendente' : 'Entrega Realizada'}</h4>
                                <p><strong>Local:</strong> ${ag.local}</p>
                                <p><strong>Empresa:</strong> ${ag.empresa}</p>
                                <p><strong>Carga:</strong> ${ag.carga}</p>
                                <span class="historico-data">${dataFormatada} às ${horaFormatada}</span>
                            </div>
                        `;
                        historicoContainer.appendChild(item);
                    });
                }
                console.log(`✅ ${agendamentosUsuario.length} agendamento(s) carregado(s)`);
            }
        } catch (error) {
            console.error('❌ Erro ao buscar histórico:', error);
            const historicoEmpty = document.getElementById('historicoEmpty');
            if (historicoEmpty) historicoEmpty.style.display = 'flex';
        }
    }

    // Inicializações
    carregarNomeUsuario();
    buscarVeiculos();
    buscarHistorico();
    
    // Sistema de Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active de todos os botões e conteúdos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Adiciona active no botão clicado
            this.classList.add('active');
            
            // Mostra o conteúdo correspondente
            const targetContent = document.getElementById(`tab-${tabName}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            console.log(`📑 Tab alterada para: ${tabName}`);
        });
    });
    
    // Função para deletar usuário na API
    async function deletarUsuario(userId) {
        try {
            console.log('🗑️ Deletando usuário:', userId);

            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao deletar usuário');
            }

            console.log('✅ Usuário deletado:', data);
            return { success: true, data };

        } catch (error) {
            console.error('❌ Erro ao deletar:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Botão Editar Informações (para adicionar/editar veículo)
    if (btnEdit) {
        btnEdit.addEventListener('click', function() {
            console.log('✏️ Editar informações clicado');
            mostrarNotificacao('Funcionalidade de edição será implementada em breve', 'info');
        });
    }
    
    // Botão Adicionar Veículo
    if (btnAddVeiculo) {
        btnAddVeiculo.addEventListener('click', function() {
            console.log('➕ Adicionar veículo clicado');
            
            if (confirm('Deseja adicionar um novo veículo?')) {
                mostrarNotificacao('Redirecionando para cadastro de veículo...', 'info');
                // Redireciona para a página de cadastro de veículos
                // window.location.href = '../cadastro-veiculo/index.html';
            }
        });
    }
    
    // Botão Alterar Foto de Perfil
    if (btnChangePhoto) {
        btnChangePhoto.addEventListener('click', function() {
            console.log('📷 Alterar foto de perfil clicado');
            
            // Simula upload de arquivo
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (avatarImg) {
                            avatarImg.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
                            mostrarNotificacao('Foto de perfil atualizada com sucesso!');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }
    
    // Botão Deslogar
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            console.log('🚪 Deslogar clicado');
            
            if (confirm('Deseja realmente sair do sistema?')) {
                mostrarNotificacao('Saindo do sistema...', 'info');
                
                // Limpa o localStorage
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('userId');
                
                // Redireciona para login após 1s
                setTimeout(() => {
                    console.log('👋 Logout realizado com sucesso');
                    window.location.href = '../Login/index.html';
                }, 1000);
            }
        });
    }
    
    // Botão Excluir Conta
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', async function() {
            console.log('⚠️ Excluir conta clicado');
            
            const confirmacao = prompt('⚠️ ATENÇÃO! Esta ação é IRREVERSÍVEL.\n\nTodos os seus dados serão permanentemente excluídos:\n- Perfil do motorista\n- Veículos cadastrados\n- Histórico de entregas\n- Configurações\n\nDigite "EXCLUIR" para confirmar:');
            
            if (confirmacao === 'EXCLUIR') {
                const senhaConfirmacao = prompt('Por segurança, digite sua senha para confirmar a exclusão da conta:');
                
                if (senhaConfirmacao) {
                    // Verifica se a senha está correta
                    if (senhaConfirmacao === usuarioLogado.senhaHash) {
                        mostrarNotificacao('Excluindo conta...', 'error');
                        
                        // Deleta o usuário na API
                        const resultado = await deletarUsuario(userId);
                        
                        if (resultado.success) {
                            // Limpa o localStorage
                            localStorage.removeItem('usuarioLogado');
                            localStorage.removeItem('userId');
                            
                            setTimeout(() => {
                                alert('❌ Conta excluída com sucesso!\n\nSentiremos sua falta. Obrigado por usar o SecureWay.');
                                console.log('🗑️ Conta excluída permanentemente');
                                window.location.href = '../Login/index.html';
                            }, 1500);
                        } else {
                            mostrarNotificacao('Erro ao excluir conta: ' + resultado.error, 'error');
                        }
                    } else {
                        mostrarNotificacao('Senha incorreta. Exclusão cancelada.', 'error');
                    }
                }
            } else if (confirmacao !== null && confirmacao !== '') {
                mostrarNotificacao('Texto de confirmação incorreto. Exclusão cancelada.', 'error');
            }
        });
    }
    
    // Função para mostrar notificação temporária
    function mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        
        const cores = {
            success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            info: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
        };
        
        notificacao.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${cores[tipo] || cores.success};
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
        
        .historico-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            text-align: center;
            color: #999;
        }
        
        .historico-empty svg {
            margin-bottom: 20px;
            opacity: 0.5;
        }
        
        .historico-empty h3 {
            font-size: 1.3rem;
            margin-bottom: 10px;
            color: #666;
        }
        
        .historico-empty p {
            font-size: 1rem;
            color: #999;
        }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 SecureWay - Perfil do Motorista carregado com sucesso!');
    console.log('👤 Motorista:', usuarioLogado.nome);
    console.log('🆔 ID:', userId);
});