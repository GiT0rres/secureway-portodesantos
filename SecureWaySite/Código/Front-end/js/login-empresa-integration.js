// login-empresa-integration.js
// Login de empresas - ADAPTADO PARA SUA API

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Login de empresa carregado');
  
  // Elementos
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const btnLogin = loginForm ? loginForm.querySelector('.btn-login') : null;
  const toast = document.getElementById('toast');
  const forgotPassword = document.getElementById('forgotPassword');

  // Verifica se já está logado
  if (TokenManager.hasToken()) {
    console.log('ℹ️ Já autenticado');
    
    const userType = localStorage.getItem('userType');
    if (userType === 'enterprise') {
      window.location.href = '../PerfilEmpresa/index.html';
      return;
    }
  }

  // Handler do formulário
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Limpa erros
      emailInput.classList.remove('error');
      senhaInput.classList.remove('error');

      try {
        // Loading
        btnLogin.disabled = true;
        const originalText = btnLogin.textContent;
        btnLogin.textContent = '⏳ Entrando...';

        // Dados
        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        console.log('📋 Login:', { email, senha: '***' });

        // Validação
        if (!email || !senha) {
          throw new Error('Preencha todos os campos');
        }

        if (!email.includes('@')) {
          throw new Error('E-mail inválido');
        }

        // Chama API - endpoint de login de empresa
        const response = await apiClient.post('/enterprise/login', {
          email: email,
          senha: senha
        });

        console.log('📥 Resposta:', response);

        if (response.status === 200 && response.data['access-token']) {
          console.log('✅ Login OK!');

          // Salva token
          TokenManager.setToken(response.data['access-token']);
          localStorage.setItem('userType', 'enterprise');
          
          // Salva dados da empresa
          if (response.data.enterprise) {
            localStorage.setItem('enterprise', JSON.stringify(response.data.enterprise));
          }

          // Visual
          btnLogin.textContent = '✓ Sucesso!';
          btnLogin.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';

          showToast('✅ Login realizado!', 'success');

          // Redireciona
          setTimeout(() => {
            window.location.href = '../PerfilEmpresa/index.html';
          }, 1500);

        } else {
          throw new Error('Resposta inválida');
        }

      } catch (error) {
        console.error('❌ Erro:', error);

        let errorMessage = 'Erro ao fazer login';

        if (error.status === 401 || error.status === 404) {
          errorMessage = 'E-mail ou senha incorretos';
          emailInput.classList.add('error');
          senhaInput.classList.add('error');
        } else if (error.message) {
          errorMessage = error.message;
        }

        showToast(`❌ ${errorMessage}`, 'error');

        // Visual botão
        btnLogin.textContent = '✗ Erro';
        btnLogin.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';

        // Restaura
        setTimeout(() => {
          btnLogin.textContent = 'Entrar';
          btnLogin.style.background = '';
          btnLogin.disabled = false;
        }, 2000);
      }
    });
  }

  // Esqueceu senha
  if (forgotPassword) {
    forgotPassword.addEventListener('click', function(e) {
      e.preventDefault();
      showToast('ℹ️ Funcionalidade em desenvolvimento', 'info');
    });
  }

  // Validação email
  if (emailInput) {
    emailInput.addEventListener('blur', function() {
      if (this.value && !this.value.includes('@')) {
        this.classList.add('error');
      } else {
        this.classList.remove('error');
      }
    });

    emailInput.addEventListener('focus', function() {
      this.classList.remove('error');
    });
  }

  // Validação senha
  if (senhaInput) {
    senhaInput.addEventListener('focus', function() {
      this.classList.remove('error');
    });
  }

  // Enter na senha
  if (senhaInput) {
    senhaInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  function showToast(message, type = 'success') {
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `notificacao-toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  console.log('✅ Integração carregada');
});