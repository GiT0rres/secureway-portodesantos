// verificacao-acesso-integration.js
// Integração de verificação de acesso com RFID

document.addEventListener('DOMContentLoaded', async () => {
  if (!AuthService.isAuthenticated()) {
    alert('❌ Faça login para acessar');
    setTimeout(() => window.location.href = '../Login/index.html', 1000);
    return;
  }

  let userId = null;

  // Obtém ID do usuário
  try {
    const profileResponse = await UserService.getProfile();
    if (profileResponse.success && profileResponse.data) {
      userId = profileResponse.data.id;
      console.log('👤 Usuário ID:', userId);
    }
  } catch (error) {
    console.error('❌ Erro ao obter usuário:', error);
    userId = 1; // Fallback
  }

  // ========== BOTÃO VERIFICAR ACESSO ==========
  const btnVerificarAcesso = document.getElementById('btnVerificarAcesso') || 
                              document.querySelector('.btn-verificar-acesso');

  if (btnVerificarAcesso) {
    btnVerificarAcesso.addEventListener('click', async () => {
      if (!userId) {
        alert('❌ ID do usuário não encontrado');
        return;
      }

      try {
        console.log('🔍 Verificando acesso do usuário:', userId);

        const response = await apiClient.get(`/canAccess/${userId}`);

        console.log('✅ Resposta de acesso:', response.data);

        if (response.data.message === 'Access granted') {
          alert(`✅ ACESSO PERMITIDO!\n\n` +
                `📋 Agendamento: ${response.data.scheduling?.empresa || 'N/A'}\n` +
                `📍 Local: ${response.data.scheduling?.local || 'N/A'}\n` +
                `🔑 Chave lida: ${response.data.lastRead?.readKey || 'N/A'}`);
        } else {
          alert(`❌ ACESSO NEGADO\n\n${response.data.message || 'Sem permissão'}`);
        }

      } catch (error) {
        console.error('❌ Erro ao verificar acesso:', error);

        let errorMsg = 'Erro ao verificar acesso';
        
        if (error.data?.message) {
          errorMsg = error.data.message;
        } else if (error.data?.error) {
          errorMsg = error.data.error;
        }

        alert(`❌ ${errorMsg}`);
      }
    });
  }

  // ========== BOTÃO ADICIONAR CHAVE ==========
  const btnAdicionarChave = document.getElementById('btnAdicionarChave') || 
                             document.querySelector('.btn-adicionar-chave');

  if (btnAdicionarChave) {
    btnAdicionarChave.addEventListener('click', async () => {
      if (!userId) {
        alert('❌ ID do usuário não encontrado');
        return;
      }

      const espId = prompt('Digite o ID do ESP (leitor):');
      
      if (!espId || isNaN(parseInt(espId))) {
        alert('❌ ID do ESP inválido');
        return;
      }

      try {
        console.log(`🔑 Adicionando chave do ESP ${espId} ao usuário ${userId}...`);

        const response = await apiClient.patch(`/addKeytoUser/${userId}/${espId}`);

        console.log('✅ Chave adicionada:', response.data);

        alert(`✅ CHAVE ADICIONADA COM SUCESSO!\n\n` +
              `🔑 Chave: ${response.data.read?.readKey || 'N/A'}\n` +
              `👤 Usuário: ${response.data.user?.nome || 'N/A'}\n` +
              `📡 ESP: #${espId}`);

        // Recarrega perfil se estiver na página de perfil
        if (typeof loadUserProfile === 'function') {
          await loadUserProfile();
        }

      } catch (error) {
        console.error('❌ Erro ao adicionar chave:', error);

        let errorMsg = 'Erro ao adicionar chave';
        
        if (error.data?.error) {
          errorMsg = error.data.error;
        } else if (error.message) {
          errorMsg = error.message;
        }

        alert(`❌ ${errorMsg}`);
      }
    });
  }

  console.log('✅ Integração de Verificação de Acesso carregada');
});