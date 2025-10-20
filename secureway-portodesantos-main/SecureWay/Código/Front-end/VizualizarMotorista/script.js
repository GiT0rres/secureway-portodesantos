// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnVoltar = document.getElementById('btnVoltar');
    const btnHome = document.getElementById('btnHome');
    const btnEdit = document.getElementById('btnEdit');
    const btnSuspend = document.getElementById('btnSuspend');
    const btnDelete = document.getElementById('btnDelete');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Dados do motorista (simulação - normalmente viria de uma API/banco de dados)
    const motorista = {
        id: 1,
        nome: 'Sérgio Andrade',
        cpf: '123.456.789-00',
        cnh: '12345678900',
        categoriaCnh: 'D',
        validadeCnh: '15/08/2026',
        dataNascimento: '20/05/1985',
        telefone: '(11) 98765-4321',
        email: 'sergio.andrade@email.com',
        endereco: 'Rua Exemplo, 123 - São Paulo/SP',
        status: 'ativo',
        dataCadastro: '15/01/2024',
        veiculos: [
            {
                marca: 'Volvo',
                modelo: 'FH 540',
                placa: 'ABC-1234',
                cor: 'Branco',
                etiqueta: 'ET123456789'
            },
            {
                marca: 'Scania',
                modelo: 'R 450',
                placa: 'XYZ-5678',
                cor: 'Prata',
                etiqueta: 'ET987654321'
            }
        ],
        historico: [
            {
                tipo: 'success',
                titulo: 'Entrega realizada',
                descricao: 'São Paulo - SP',
                data: '15/03/2024 às 14:30'
            },
            {
                tipo: 'info',
                titulo: 'Veículo cadastrado',
                descricao: 'Placa: ABC-1234',
                data: '10/03/2024 às 09:15'
            },
            {
                tipo: 'success',
                titulo: 'Entrega realizada',
                descricao: 'Rio de Janeiro - RJ',
                data: '05/03/2024 às 16:45'
            },
            {
                tipo: 'warning',
                titulo: 'Manutenção realizada',
                descricao: 'Veículo ABC-1234',
                data: '01/03/2024 às 10:00'
            }
        ],
        documentos: [
            {
                nome: 'CNH (Frente)',
                tipo: 'image',
                data: '15/01/2024'
            },
            {
                nome: 'CNH (Verso)',
                tipo: 'image',
                data: '15/01/2024'
            },
            {
                nome: 'RG',
                tipo: 'image',
                data: '15/01/2024'
            },
            {
                nome: 'Comprovante de Residência',
                tipo: 'pdf',
                data: '15/01/2024'
            },
            {
                nome: 'Certificado Curso MOPP',
                tipo: 'pdf',
                data: '20/01/2024'
            },
            {
                nome: 'Exame Médico',
                tipo: 'pdf',
                data: '18/01/2024'
            }
        ]
    };

    // Função para carregar dados do motorista
    function carregarDadosMotorista() {
        // Dados pessoais
        document.getElementById('perfilNome').textContent = motorista.nome;
        document.getElementById('dataCadastro').textContent = motorista.dataCadastro;
        document.getElementById('nome').textContent = motorista.nome;
        document.getElementById('cpf').textContent = motorista.cpf;
        document.getElementById('cnh').textContent = motorista.cnh;
        document.getElementById('categoriaCnh').textContent = motorista.categoriaCnh;
        document.getElementById('validadeCnh').textContent = motorista.validadeCnh;
        document.getElementById('dataNascimento').textContent = motorista.dataNascimento;
        document.getElementById('telefone').textContent = motorista.telefone;
        document.getElementById('email').textContent = motorista.email;
        document.getElementById('endereco').textContent = motorista.endereco;

        // Status
        const statusBadge = document.getElementById('statusBadge');
        statusBadge.className = `status-badge ${motorista.status}`;
        
        const statusTexto = {
            'ativo': 'Ativo',
            'inativo': 'Inativo',
            'suspenso': 'Suspenso'
        };
        
        const statusIcon = {
            'ativo': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
            'inativo': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            'suspenso': '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        };
        
        statusBadge.innerHTML = `${statusIcon[motorista.status]} ${statusTexto[motorista.status]}`;

        // Atualiza botão de suspender
        if (motorista.status === 'suspenso') {
            btnSuspend.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Reativar
            `;
        }

        console.log('✅ Dados do motorista carregados:', motorista.nome);
    }

    // Função para carregar veículos
    function carregarVeiculos() {
        const veiculosList = document.getElementById('veiculosList');
        veiculosList.innerHTML = '';

        if (motorista.veiculos.length === 0) {
            veiculosList.innerHTML = `
                <div style="text-align: center; padding: 60px; color: rgba(255, 255, 255, 0.6);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 20px; opacity: 0.5;">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    <h3 style="color: white; margin-bottom: 10px;">Nenhum veículo cadastrado</h3>
                    <p>Este motorista ainda não possui veículos vinculados</p>
                </div>
            `;
            return;
        }

        motorista.veiculos.forEach(veiculo => {
            const veiculoCard = document.createElement('div');
            veiculoCard.className = 'veiculo-card';
            veiculoCard.innerHTML = `
                <div class="veiculo-header">
                    <h4>${veiculo.marca} ${veiculo.modelo}</h4>
                    <span class="veiculo-placa">${veiculo.placa}</span>
                </div>
                <div class="veiculo-info">
                    <div class="veiculo-info-item">
                        <label>Cor</label>
                        <span>${veiculo.cor}</span>
                    </div>
                    <div class="veiculo-info-item">
                        <label>Etiqueta</label>
                        <span>${veiculo.etiqueta}</span>
                    </div>
                </div>
            `;
            veiculosList.appendChild(veiculoCard);
        });

        console.log(`✅ ${motorista.veiculos.length} veículo(s) carregado(s)`);
    }

    // Função para carregar histórico
    function carregarHistorico() {
        const historicoContainer = document.getElementById('historicoContainer');
        historicoContainer.innerHTML = '';

        if (motorista.historico.length === 0) {
            historicoContainer.innerHTML = `
                <div style="text-align: center; padding: 60px; color: rgba(255, 255, 255, 0.6);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 20px; opacity: 0.5;">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <h3 style="color: white; margin-bottom: 10px;">Nenhum histórico disponível</h3>
                    <p>As atividades aparecerão aqui</p>
                </div>
            `;
            return;
        }

        motorista.historico.forEach(item => {
            const historicoItem = document.createElement('div');
            historicoItem.className = 'historico-item';
            
            const icons = {
                success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
                info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
                warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
            };
            
            historicoItem.innerHTML = `
                <div class="historico-icon ${item.tipo}">
                    ${icons[item.tipo]}
                </div>
                <div class="historico-info">
                    <h4>${item.titulo}</h4>
                    <p>${item.descricao}</p>
                    <span class="historico-data">${item.data}</span>
                </div>
            `;
            historicoContainer.appendChild(historicoItem);
        });

        console.log(`✅ ${motorista.historico.length} atividade(s) carregada(s)`);
    }

    // Função para carregar documentos
    function carregarDocumentos() {
        const documentosGrid = document.getElementById('documentosGrid');
        documentosGrid.innerHTML = '';

        if (motorista.documentos.length === 0) {
            documentosGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: rgba(255, 255, 255, 0.6);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 20px; opacity: 0.5;">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                        <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    <h3 style="color: white; margin-bottom: 10px;">Nenhum documento anexado</h3>
                    <p>Os documentos aparecerão aqui quando forem enviados</p>
                </div>
            `;
            return;
        }

        motorista.documentos.forEach(documento => {
            const documentoCard = document.createElement('div');
            documentoCard.className = 'documento-card';
            
            const icon = documento.tipo === 'image' 
                ? '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>'
                : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>';
            
            documentoCard.innerHTML = `
                <div class="documento-icon">${icon}</div>
                <h4>${documento.nome}</h4>
                <p>Enviado em ${documento.data}</p>
            `;
            
            documentoCard.addEventListener('click', () => {
                mostrarNotificacao('Visualização de documento em desenvolvimento', 'info');
            });
            
            documentosGrid.appendChild(documentoCard);
        });

        console.log(`✅ ${motorista.documentos.length} documento(s) carregado(s)`);
    }

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

    // Função para mostrar notificação
    function mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        
        const cores = {
            success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            info: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
            warning: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
        };
        
        notificacao.style.background = cores[tipo] || cores.success;
        notificacao.style.animation = 'slideInRight 0.4s ease';
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notificacao.remove(), 400);
        }, 3000);
    }

    // Botão Voltar
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }

    // Botão Editar
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            console.log('✏️ Editar motorista:', motorista.nome);
            mostrarNotificacao('Funcionalidade de edição em desenvolvimento', 'info');
            // Redirecionar para página de edição
            // window.location.href = `editar-motorista.html?id=${motorista.id}`;
        });
    }

    // Botão Suspender/Reativar
    if (btnSuspend) {
        btnSuspend.addEventListener('click', () => {
            const acao = motorista.status === 'suspenso' ? 'reativar' : 'suspender';
            const mensagem = motorista.status === 'suspenso' 
                ? `Deseja reativar o motorista ${motorista.nome}?`
                : `Deseja suspender o motorista ${motorista.nome}?\n\nO motorista não poderá realizar entregas enquanto estiver suspenso.`;
            
            if (confirm(mensagem)) {
                motorista.status = motorista.status === 'suspenso' ? 'ativo' : 'suspenso';
                carregarDadosMotorista();
                
                const notificacaoTexto = motorista.status === 'suspenso' 
                    ? '⚠️ Motorista suspenso com sucesso!'
                    : '✓ Motorista reativado com sucesso!';
                
                mostrarNotificacao(notificacaoTexto, motorista.status === 'suspenso' ? 'warning' : 'success');
                console.log(`${acao === 'reativar' ? '✓' : '⚠️'} Motorista ${acao}do:`, motorista.nome);
            }
        });
    }

    // Botão Excluir
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            const confirmacao = confirm(`⚠️ ATENÇÃO! Deseja realmente excluir o motorista ${motorista.nome}?\n\nTodos os dados serão permanentemente excluídos:\n- Dados pessoais\n- Veículos vinculados\n- Histórico de entregas\n- Documentos\n\nEsta ação NÃO pode ser desfeita!`);
            
            if (confirmacao) {
                const senhaConfirmacao = prompt('Por segurança, digite "EXCLUIR" para confirmar:');
                
                if (senhaConfirmacao === 'EXCLUIR') {
                    console.log('🗑️ Motorista excluído:', motorista.nome);
                    mostrarNotificacao('✓ Motorista excluído com sucesso!', 'success');
                    
                    setTimeout(() => {
                        window.history.back();
                    }, 1500);
                } else if (senhaConfirmacao !== null) {
                    mostrarNotificacao('Texto de confirmação incorreto. Exclusão cancelada.', 'error');
                }
            }
        });
    }

    // Carrega todos os dados ao iniciar
    carregarDadosMotorista();
    carregarVeiculos();
    carregarHistorico();
    carregarDocumentos();
    
    console.log('🚀 SecureWay - Visualização do Motorista carregada com sucesso!');
    console.log('👤 Visualizando:', motorista.nome);
});