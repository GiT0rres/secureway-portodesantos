// login-integration.js
// Integração da página de login com a API

document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos do formulário
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const btnLogin = loginForm ? loginForm.querySelector('.btn-login') : null;

  // Verifica se já está logado
  if (AuthService.isAuthenticated()) {
    console.log('Usuário já autenticado, verificando sessão...');
    
    // Verifica se o token ainda é válido
    UserService.checkAuth().then(result => {
      if (result.authenticated) {
        console.log('Sessão válida, redirecionando para Perfil do Motorista...');
        window.location.href = '../PerfilMotorista/index.html';
      } else {
        console.log('Sessão inválida, removendo token');
        TokenManager.removeToken();
      }
    });
  }

  // Handler do formulário de login
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Limpa erros anteriores
      UIHelper.clearInputErrors(loginForm);

      try {
        // Mostra loading no botão
        UIHelper.setButtonLoading(btnLogin, true, 'Entrar');

        // Coleta dados
        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        console.log('Tentando fazer login:', { email, senha: '***' });

        // Chama serviço de login
        const response = await AuthService.login(email, senha);

        console.log('Login bem-sucedido:', {
          ...response,
          data: {
            ...response.data,
            'access-token': '***' // Não loga token
          }
        });

        // Atualiza visual do botão
        btnLogin.textContent = '✓ Login realizado!';
        btnLogin.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';

        // Mostra mensagem de sucesso
        UIHelper.showSuccess('Login realizado com sucesso!');

        // Redireciona após 1.5 segundos DIRETO PARA PERFIL (plano gratuito)
        setTimeout(() => {
          window.location.href = '../PerfilMotorista/index.html';
        }, 1500);

      } catch (error) {
        console.error('Erro no login:', error);

        // Exibe mensagem de erro
        UIHelper.showError(error.message || 'Erro ao fazer login');

        // Marca inputs como erro
        if (error.error && error.error.status === 401) {
          UIHelper.setInputError(emailInput, 'Credenciais inválidas');
          UIHelper.setInputError(senhaInput, 'Credenciais inválidas');
        }

        // Atualiza visual do botão
        btnLogin.textContent = '✗ Erro no login';
        btnLogin.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';

        // Restaura botão após 2 segundos
        setTimeout(() => {
          btnLogin.textContent = 'Entrar';
          btnLogin.style.background = '';
          btnLogin.disabled = false;
        }, 2000);

      } finally {
        // Remove loading após delay para mostrar feedback
        setTimeout(() => {
          UIHelper.setButtonLoading(btnLogin, false, 'Entrar');
        }, 1500);
      }
    });
  }

  // Validação em tempo real
  setupFieldValidation();

  // Permite login com Enter na senha
  if (senhaInput) {
    senhaInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  /**
   * Configura validação em tempo real dos campos
   */
  function setupFieldValidation() {
    // Validação do email
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        const valor = this.value.trim();
        if (AuthService.isValidEmail(valor)) {
          UIHelper.setInputValid(this);
        } else if (valor.length > 0) {
          UIHelper.setInputError(this, 'Email inválido');
        }
      });

      emailInput.addEventListener('focus', function() {
        this.classList.remove('error');
      });
    }

    // Validação da senha
    if (senhaInput) {
      senhaInput.addEventListener('blur', function() {
        const valor = this.value;
        if (valor.length >= 6) {
          UIHelper.setInputValid(this);
        } else if (valor.length > 0) {
          UIHelper.setInputError(this, 'Senha muito curta');
        }
      });

      senhaInput.addEventListener('focus', function() {
        this.classList.remove('error');
      });
    }
  }

  console.log('✅ Integração de login carregada');
});