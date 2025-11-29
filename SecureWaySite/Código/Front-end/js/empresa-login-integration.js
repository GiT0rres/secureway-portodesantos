// empresa-login-integration.js
// Integração de login para empresas - ADAPTADO PARA SUA API

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando integração de login de empresa...');

  // Verifica se já está logado
  if (TokenManager.hasToken()) {
    const enterprise = localStorage.getItem('enterprise');
    if (enterprise) {
      console.log('ℹ️ Empresa já autenticada, redirecionando...');
      window.location.href = '../AgendamentosEmpresa/index.html';
      return;
    }
  }

  // Busca formulário
  const form = document.getElementById('loginForm') 
    || document.getElementById('formLoginEmpresa') 
    || document.querySelector('form');
  
  if (!form) {
    console.error('❌ Formulário de login não encontrado!');
    return;
  }

  console.log('✅ Formulário encontrado:', form.id || 'sem ID');

  // Menu sidebar (se existir)
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Handler do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Busca campos (tenta vários IDs possíveis)
    const email = document.getElementById('email')?.value 
      || document.getElementById('emailEmpresa')?.value;
    
    const senha = document.getElementById('senha')?.value 
      || document.getElementById('senhaEmpresa')?.value 
      || document.getElementById('password')?.value;

    const btn = form.querySelector('button[type="submit"]') 
      || form.querySelector('.btn-login') 
      || form.querySelector('.btn-primary');

    console.log('📋 Dados coletados:', { 
      email, 
      senhaLength: senha?.length 
    });

    // Validação
    if (!email || !senha) {
      showNotification('❌ Preencha email e senha', 'error');
      return;
    }

    try {
      // Loading
      if (btn) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = '⏳ Entrando...';
      }

      console.log('🔐 Fazendo login empresa via /api/enterprise/login...');

      // Chama API usando Enterprise.login do enterprise.js
      const data = await Enterprise.login(email, senha);

      console.log('✅ Login empresa realizado:', data);

      showNotification('✅ Login realizado com sucesso!', 'success');

      // Aguarda 1 segundo e redireciona
      setTimeout(() => {
        window.location.href = '../AgendamentosEmpresa/index.html';
      }, 1000);

    } catch (error) {
      console.error('❌ Erro no login:', error);

      let errorMsg = 'Erro ao fazer login.';
      
      if (error.message) {
        errorMsg = error.message;
      }

      if (error.status === 401) {
        errorMsg = 'Email ou senha incorretos';
      } else if (error.status === 404) {
        errorMsg = 'Empresa não encontrada';
      } else if (error.status === 0) {
        errorMsg = 'Erro de conexão. Verifique se o servidor está ligado.';
      }

      showNotification(`❌ ${errorMsg}`, 'error');

      // Restaura botão
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'Entrar';
      }
    }
  });

  // Função helper para notificações
  function showNotification(message, type = 'info') {
    // Tenta usar UIHelper se disponível
    if (window.UIHelper) {
      if (type === 'error') {
        UIHelper.showError(message);
      } else {
        UIHelper.showSuccess(message);
      }
      return;
    }

    // Fallback: alert
    alert(message);
  }

  console.log('✅ Integração de Login Empresa carregada');
});