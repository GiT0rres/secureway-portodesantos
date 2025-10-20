// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const btnConfig = document.getElementById('btnConfig');
    const btnEdit = document.getElementById('btnEdit');
    const btnAddVeiculo = document.getElementById('btnAddVeiculo');
    const btnChangePhoto = document.getElementById('btnChangePhoto');
    const btnLogout = document.getElementById('btnLogout');
    const btnDeleteAccount = document.getElementById('btnDeleteAccount');
    const avatarImg = document.getElementById('avatarImg');
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Dados do veículo (simulação - normalmente viria de um banco de dados)
    const dadosVeiculo = {
        marca: 'Volvo',
        modelo: 'FH 540',
        cor: 'Branco',
        placa: 'ABC-1234',
        etiqueta: 'ET123456789'
    };
    
    // Função para carregar dados do veículo
    function carregarDadosVeiculo() {
        document.getElementById('marca').textContent = dadosVeiculo.marca;
        document.getElementById('modelo').textContent = dadosVeiculo.modelo;
        document.getElementById('cor').textContent = dadosVeiculo.cor;
        document.getElementById('placa').textContent = dadosVeiculo.placa;
        document.getElementById('etiqueta').textContent = dadosVeiculo.etiqueta;
        
        console.log('✅ Dados do veículo carregados:', dadosVeiculo);
    }
    
    // Carrega os dados ao iniciar
    carregarDadosVeiculo();
    
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
    
    // Botão de Configurações
    if (btnConfig) {
        btnConfig.addEventListener('click', function() {
            console.log('⚙️ Configurações clicadas');
            
            const opcoes = [
                'Alterar foto',
                'Editar perfil',
                'Configurações de conta',
                'Sair'
            ];
            
            const escolha = prompt(`Configurações:\n\n${opcoes.map((op, i) => `${i + 1}. ${op}`).join('\n')}\n\nEscolha uma opção (1-4):`);
            
            if (escolha) {
                const index = parseInt(escolha) - 1;
                if (index >= 0 && index < opcoes.length) {
                    alert(`Você selecionou: ${opcoes[index]}`);
                    
                    if (index === 3) { // Sair
                        if (confirm('Deseja realmente sair?')) {
                            console.log('👋 Saindo do sistema...');
                            window.location.href = '../login/index.html';
                        }
                    }
                }
            }
        });
    }
    
    // Botão Editar Informações
    if (btnEdit) {
        btnEdit.addEventListener('click', function() {
            console.log('✏️ Editar informações clicado');
            
            const novaMarca = prompt('Digite a nova marca:', dadosVeiculo.marca);
            if (novaMarca && novaMarca.trim()) {
                dadosVeiculo.marca = novaMarca.trim();
            }
            
            const novoModelo = prompt('Digite o novo modelo:', dadosVeiculo.modelo);
            if (novoModelo && novoModelo.trim()) {
                dadosVeiculo.modelo = novoModelo.trim();
            }
            
            const novaCor = prompt('Digite a nova cor:', dadosVeiculo.cor);
            if (novaCor && novaCor.trim()) {
                dadosVeiculo.cor = novaCor.trim();
            }
            
            const novaPlaca = prompt('Digite a nova placa:', dadosVeiculo.placa);
            if (novaPlaca && novaPlaca.trim()) {
                dadosVeiculo.placa = novaPlaca.trim().toUpperCase();
            }
            
            const novaEtiqueta = prompt('Digite a nova etiqueta:', dadosVeiculo.etiqueta);
            if (novaEtiqueta && novaEtiqueta.trim()) {
                dadosVeiculo.etiqueta = novaEtiqueta.trim();
            }
            
            // Atualiza os dados na tela
            carregarDadosVeiculo();
            
            // Mostra notificação de sucesso
            mostrarNotificacao('Informações atualizadas com sucesso!');
            
            console.log('✅ Dados atualizados:', dadosVeiculo);
        });
    }
    
    // Botão Adicionar Veículo
    if (btnAddVeiculo) {
        btnAddVeiculo.addEventListener('click', function() {
            console.log('➕ Adicionar veículo clicado');
            
            if (confirm('Deseja adicionar um novo veículo?')) {
                // Redireciona para a página de cadastro de veículos
                window.location.href = '../cadastro-veiculo/index.html';
            }
        });
    }
    
    // Botão Alterar Foto de Perfil
    if (btnChangePhoto) {
        btnChangePhoto.addEventListener('click', function() {
            console.log('📷 Alterar foto de perfil clicado');
            
            const opcoes = [
                '1. Upload de arquivo',
                '2. Tirar foto com câmera',
                '3. Usar avatar padrão',
                '4. Remover foto'
            ];
            
            const escolha = prompt(`Alterar Foto de Perfil:\n\n${opcoes.join('\n')}\n\nEscolha uma opção (1-4):`);
            
            if (escolha) {
                const index = parseInt(escolha);
                switch(index) {
                    case 1:
                        // Simula upload de arquivo
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    avatarImg.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
                                    mostrarNotificacao('Foto de perfil atualizada com sucesso!');
                                };
                                reader.readAsDataURL(file);
                            }
                        };
                        input.click();
                        break;
                    case 2:
                        mostrarNotificacao('Funcionalidade de câmera não disponível nesta demonstração', 'info');
                        break;
                    case 3:
                        // Restaura avatar padrão
                        avatarImg.innerHTML = `
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        `;
                        mostrarNotificacao('Avatar padrão restaurado!');
                        break;
                    case 4:
                        if (confirm('Deseja realmente remover sua foto de perfil?')) {
                            avatarImg.innerHTML = `
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            `;
                            mostrarNotificacao('Foto de perfil removida!', 'info');
                        }
                        break;
                    default:
                        mostrarNotificacao('Opção inválida!', 'error');
                }
            }
        });
    }
    
    // Botão Deslogar
    if (btnLogout) {
        btnLogout.addEventListener('click', function() {
            console.log('🚪 Deslogar clicado');
            
            if (confirm('Deseja realmente sair do sistema?')) {
                mostrarNotificacao('Saindo do sistema...', 'info');
                
                // Simula logout e redireciona para login após 1.5s
                setTimeout(() => {
                    console.log('👋 Logout realizado com sucesso');
                    window.location.href = '../login/index.html';
                }, 1500);
            }
        });
    }
    
    // Botão Excluir Conta
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', function() {
            console.log('⚠️ Excluir conta clicado');
            
            const confirmacao = prompt('⚠️ ATENÇÃO! Esta ação é IRREVERSÍVEL.\n\nTodos os seus dados serão permanentemente excluídos:\n- Perfil do motorista\n- Veículos cadastrados\n- Histórico de entregas\n- Configurações\n\nDigite "EXCLUIR" para confirmar:');
            
            if (confirmacao === 'EXCLUIR') {
                const senhaConfirmacao = prompt('Por segurança, digite sua senha para confirmar a exclusão da conta:');
                
                if (senhaConfirmacao) {
                    mostrarNotificacao('Excluindo conta...', 'error');
                    
                    // Simula exclusão da conta
                    setTimeout(() => {
                        alert('❌ Conta excluída com sucesso!\n\nSentiremos sua falta. Obrigado por usar o SecureWay.');
                        console.log('🗑️ Conta excluída permanentemente');
                        window.location.href = '../login/index.html';
                    }, 2000);
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
    `;
    document.head.appendChild(style);
    
    console.log('🚀 SecureWay - Perfil do Motorista carregado com sucesso!');
    console.log('👤 Motorista:', document.getElementById('perfilNome').textContent);
});