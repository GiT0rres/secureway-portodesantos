// perfil-motorista-integration.js
// Integração da página Perfil do Motorista com a API

document.addEventListener('DOMContentLoaded', async function() {
  
  // ===== VERIFICAÇÃO DE AUTENTICAÇÃO =====
  if (!AuthService.isAuthenticated()) {
    console.log('❌ Usuário não autenticado, redirecionando...');
    UIHelper.showError('Você precisa fazer login para acessar esta página');
    setTimeout(() => {
      window.location.href = '../Login/index.html';
    }, 1500);
    return;
  }

  // ===== ELEMENTOS DA PÁGINA =====
  const perfilNome = document.getElementById('perfilNome');
  const avatarImg = document.getElementById('avatarImg');
  const btnLogout = document.getElementById('btnLogout');
  const btnDeleteAccount = document.getElementById('btnDeleteAccount');
  const btnChangePhoto = document.getElementById('btnChangePhoto');
  const btnEdit = document.getElementById('btnEdit');
  const btnAddVeiculo = document.getElementById('btnAddVeiculo');
  
  // Elementos da sidebar
  const sidebarAvatar = document.querySelector('.user-avatar');
  const sidebarNome = document.querySelector('.user-info h3');

  // Elementos de dados do veículo
  const marcaEl = document.getElementById('marca');
  const placaEl = document.getElementById('placa');
  const modeloEl = document.getElementById('modelo');
  const etiquetaEl = document.getElementById('etiqueta');
  const corEl = document.getElementById('cor');

  // ===== ESTADO DA APLICAÇÃO =====
  let userData = null;
  let userId = null;

  // ===== CARREGA PERFIL DO USUÁRIO =====
  await loadUserProfile();

  /**
   * Carrega dados do perfil do usuário
   */
  async function loadUserProfile() {
    try {
      console.log('🔄 Carregando perfil do usuário...');

      const response = await UserService.getProfile();

      if (response.success) {
        userData = response.data;
        userId = response.data.id;

        console.log('✅ Perfil carregado:', userData);

        // Atualiza interface com dados do usuário
        updateProfileUI(userData);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error);

      if (error.requireLogin) {
        UIHelper.showError(error.message);
        setTimeout(() => {
          window.location.href = '../Login/index.html';
        }, 2000);
      } else {
        UIHelper.showError('Erro ao carregar perfil. Tente novamente.');
      }
    }
  }

  /**
   * Atualiza interface com dados do usuário
   */
  function updateProfileUI(data) {
    // Nome do perfil
    if (perfilNome && data.nome) {
      perfilNome.textContent = data.nome;
    }

    // Sidebar
    if (sidebarNome && data.nome) {
      sidebarNome.textContent = data.nome;
    }

    // Avatar com iniciais
    if (sidebarAvatar && data.nome) {
      const initials = getInitials(data.nome);
      sidebarAvatar.textContent = initials;
    }

    console.log('📋 Dados do usuário atualizados na interface');
  }

  /**
   * Extrai iniciais do nome
   */
  function getInitials(nome) {
    if (!nome) return '??';
    const parts = nome.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }

  // ===== CARREGAR HISTÓRICO DE LEITURAS =====
  async function carregarHistoricoLeituras() {
      try {
          console.log('📖 Carregando histórico de leituras...');

          // Busca TODAS as leituras da API
          const response = await apiClient.get('/read');

          if (response.status === 200) {
              const leituras = response.data;

              console.log('✅ Todas as leituras carregadas:', leituras);

              // Renderiza TODAS as leituras na tela
              renderizarHistoricoLeituras(leituras);
          }

      } catch (error) {
          console.error('❌ Erro ao carregar histórico:', error);
          
          const historicoContainer = document.querySelector('.historico-container');
          if (historicoContainer) {
              historicoContainer.innerHTML = `
                  <div class="historico-item">
                      <div class="historico-icon info">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="16" x2="12" y2="12"></line>
                              <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                      </div>
                      <div class="historico-info">
                          <h4>Erro ao carregar histórico</h4>
                          <p>Tente novamente mais tarde</p>
                      </div>
                  </div>
              `;
          }
      }
  }

  /**
   * Renderiza histórico de leituras no HTML
   */
  function renderizarHistoricoLeituras(leituras) {
      const historicoContainer = document.querySelector('.historico-container');
      
      if (!historicoContainer) {
          console.error('❌ Container de histórico não encontrado');
          return;
      }

      if (!leituras || leituras.length === 0) {
          historicoContainer.innerHTML = `
              <div class="historico-item">
                  <div class="historico-icon info">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                  </div>
                  <div class="historico-info">
                      <h4>Nenhuma leitura registrada</h4>
                      <p>Seu histórico de acessos aparecerá aqui</p>
                  </div>
              </div>
          `;
          return;
      }

      // Ordena por data (mais recentes primeiro)
      const leiturasOrdenadas = [...leituras].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
      });

      // Renderiza cada leitura
      historicoContainer.innerHTML = leiturasOrdenadas.map(leitura => {
          // Formata a data
          const data = new Date(leitura.createdAt);
          const dataFormatada = data.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });

          const iconClass = 'success';
          const iconSvg = '<polyline points="20 6 9 17 4 12"></polyline>';
          
          const statusTexto = 'Leitura Registrada';
          const espInfo = `ESP ID: ${leitura.idEsp}`;
          const cardInfo = `Cartão RFID: ${leitura.readKey}`;

          return `
              <div class="historico-item">
                  <div class="historico-icon ${iconClass}">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          ${iconSvg}
                      </svg>
                  </div>
                  <div class="historico-info">
                      <h4>${statusTexto}</h4>
                      <p>${espInfo}</p>
                      <p>${cardInfo}</p>
                      <span class="historico-data">${dataFormatada}</span>
                  </div>
              </div>
          `;
      }).join('');

      console.log(`✅ ${leiturasOrdenadas.length} leituras renderizadas no histórico`);
  }

  // ===== BOTÃO LOGOUT =====
  if (btnLogout) {
    btnLogout.addEventListener('click', async function(e) {
      e.preventDefault();

      if (!confirm('Deseja realmente sair do sistema?')) {
        return;
      }

      try {
        console.log('🚪 Fazendo logout...');
        
        mostrarNotificacao('Saindo do sistema...', 'info');

        const response = await AuthService.logout();

        if (response.success) {
          console.log('✅ Logout realizado com sucesso');
          
          setTimeout(() => {
            window.location.href = '../Login/index.html';
          }, 1000);
        }

      } catch (error) {
        console.error('❌ Erro no logout:', error);
        
        UIHelper.showError('Erro no logout, mas você será desconectado');
        setTimeout(() => {
          window.location.href = '../Login/index.html';
        }, 1500);
      }
    });
  }

  // ===== BOTÃO EXCLUIR CONTA =====
  if (btnDeleteAccount) {
    btnDeleteAccount.addEventListener('click', async function(e) {
      e.preventDefault();

      const confirmacao = prompt(
        '⚠️ ATENÇÃO! Esta ação é IRREVERSÍVEL.\n\n' +
        'Todos os seus dados serão permanentemente excluídos:\n' +
        '- Perfil do motorista\n' +
        '- Veículos cadastrados\n' +
        '- Histórico de entregas\n' +
        '- Configurações\n\n' +
        'Digite "EXCLUIR" para confirmar:'
      );

      if (confirmacao !== 'EXCLUIR') {
        if (confirmacao !== null && confirmacao !== '') {
          mostrarNotificacao('Texto de confirmação incorreto. Exclusão cancelada.', 'error');
        }
        return;
      }

      try {
        console.log('🗑️ Excluindo conta...');
        
        mostrarNotificacao('Excluindo conta...', 'error');

        const response = await apiClient.delete(`/users/${userId}`);

        if (response.status === 200 || response.status === 204) {
          TokenManager.removeToken();

          alert('✔ Conta excluída com sucesso!\n\nSentiremos sua falta. Obrigado por usar o SecureWay.');

          setTimeout(() => {
            window.location.href = '../Login/index.html';
          }, 1000);
        }

      } catch (error) {
        console.error('❌ Erro ao excluir conta:', error);
        UIHelper.showError('Erro ao excluir conta. Tente novamente.');
      }
    });
  }

  // ===== BOTÃO ALTERAR FOTO =====
  if (btnChangePhoto) {
    btnChangePhoto.addEventListener('click', function(e) {
      e.preventDefault();

      const opcoes = [
        '1. Upload de arquivo',
        '2. Tirar foto com câmera',
        '3. Usar avatar padrão',
        '4. Remover foto'
      ];

      const escolha = prompt(`Alterar Foto de Perfil:\n\n${opcoes.join('\n')}\n\nEscolha uma opção (1-4):`);

      if (!escolha) return;

      const index = parseInt(escolha);
      
      switch(index) {
        case 1:
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                avatarImg.innerHTML = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
                mostrarNotificacao('Foto de perfil atualizada!');
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
    });
  }

  // ===== BOTÃO EDITAR INFORMAÇÕES =====
  if (btnEdit) {
    btnEdit.addEventListener('click', async function(e) {
      e.preventDefault();

      const novoNome = prompt('Digite o novo nome:', userData.nome);
      const novoTelefone = prompt('Digite o novo telefone:', userData.telefone || '');
      
      if (!novoNome && !novoTelefone) {
        return;
      }

      try {
        console.log('✏️ Atualizando perfil...');

        const updateData = {};
        if (novoNome && novoNome.trim()) {
          updateData.nome = novoNome.trim();
        }
        if (novoTelefone && novoTelefone.trim()) {
          updateData.telefone = novoTelefone.replace(/\D/g, '');
        }

        const response = await UserService.updateProfile(userId, updateData);

        if (response.success) {
          console.log('✅ Perfil atualizado:', response.data);

          userData = { ...userData, ...response.data };
          updateProfileUI(userData);

          mostrarNotificacao('Informações atualizadas com sucesso!');
        }

      } catch (error) {
        console.error('❌ Erro ao atualizar perfil:', error);

        if (error.requireLogin) {
          UIHelper.showError(error.message);
          setTimeout(() => {
            window.location.href = '../Login/index.html';
          }, 2000);
        } else {
          UIHelper.showError(error.message || 'Erro ao atualizar perfil');
        }
      }
    });
  }

  // ===== BOTÃO ADICIONAR VEÍCULO =====
  if (btnAddVeiculo) {
    btnAddVeiculo.addEventListener('click', function(e) {
      e.preventDefault();

      if (confirm('Deseja adicionar um novo veículo?')) {
        mostrarNotificacao('Funcionalidade em desenvolvimento', 'info');
      }
    });
  }

  // ===== FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES =====
  function mostrarNotificacao(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `notificacao-toast ${tipo}`;
    toast.textContent = mensagem;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // ===== CONTROLE DO MENU LATERAL =====
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    }
  });

  // ===== CONTROLE DAS TABS =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      // Remove active de todos
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Adiciona active no clicado
      btn.classList.add('active');
      const targetContent = document.getElementById(`tab-${tabName}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // ← CARREGA HISTÓRICO quando clicar na aba
      if (tabName === 'historico') {
        carregarHistoricoLeituras();
      }
    });
  });

  // ===== ANIMAÇÃO DE ENTRADA DOS CARDS =====
  window.addEventListener('load', () => {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  });

  console.log('✅ Perfil do Motorista integrado com API');
  console.log('👤 Usuário:', userData?.nome || 'Carregando...');
  console.log('🔐 Autenticação ativa');
});