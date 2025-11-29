// cadastro-integration.js
// Integração da página de cadastro com a API

document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos do formulário
  const formCadastro = document.getElementById('formCadastro');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const telefoneInput = document.getElementById('telefone');
  const senhaInput = document.getElementById('senha');
  const cpfInput = document.getElementById('CPF');
  const rgInput = document.getElementById('RG');
  const modalSucesso = document.getElementById('modalSucesso');
  const btnComecar = document.getElementById('btnComecar');

  // Verifica se já está logado
  if (AuthService.isAuthenticated()) {
    console.log('Usuário já autenticado, redirecionando para Perfil do Motorista...');
    // Redireciona direto para perfil (plano gratuito)
    window.location.href = '../PerfilMotorista/index.html';
  }

  // Handler do formulário de cadastro
  if (formCadastro) {
    formCadastro.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Limpa erros anteriores
      UIHelper.clearInputErrors(formCadastro);

      // Botão de submit
      const btnSubmit = formCadastro.querySelector('.btn-primary');
      
      try {
        // Mostra loading
        UIHelper.setButtonLoading(btnSubmit, true);

        // Coleta dados do formulário
        const userData = {
          nome: nomeInput.value.trim(),
          email: emailInput.value.trim(),
          telefone: telefoneInput.value.replace(/\D/g, ''), // Remove formatação
          senha: senhaInput.value,
          cpf: cpfInput.value ? cpfInput.value.replace(/\D/g, '') : null,
          rg: rgInput.value ? rgInput.value.replace(/\D/g, '') : null
        };

        console.log('Enviando dados de cadastro:', {
          ...userData,
          senha: '***' // Não loga senha
        });

        // Chama serviço de registro
        const response = await AuthService.register(userData);

        console.log('Cadastro bem-sucedido:', response);

        // Limpa formulário
        formCadastro.reset();
        UIHelper.clearInputErrors(formCadastro);

        // Exibe modal de sucesso
        if (modalSucesso) {
          modalSucesso.classList.add('active');
        } else {
          UIHelper.showSuccess(response.message);
          
          // Redireciona após 2 segundos DIRETO PARA PERFIL (plano gratuito)
          setTimeout(() => {
            window.location.href = '../PerfilMotorista/index.html';
          }, 2000);
        }

      } catch (error) {
        console.error('Erro no cadastro:', error);

        // Exibe mensagem de erro
        UIHelper.showError(error.message || 'Erro ao cadastrar usuário');

        // Marca campos com erro se disponível
        if (error.error && error.error.data) {
          markFieldErrors(error.error.data);
        }

      } finally {
        // Remove loading
        UIHelper.setButtonLoading(btnSubmit, false);
      }
    });
  }

  // Handler do botão "Começar" do modal
  if (btnComecar) {
    btnComecar.addEventListener('click', function() {
      // Fecha modal
      if (modalSucesso) {
        modalSucesso.classList.remove('active');
      }

      // Redireciona para Perfil do Motorista (plano gratuito)
      window.location.href = '../PerfilMotorista/index.html';
    });
  }

  // Validação em tempo real dos campos
  setupFieldValidation();

  // Máscaras de formatação (mantém as existentes)
  setupFieldMasks();

  /**
   * Configura validação em tempo real
   */
  function setupFieldValidation() {
    // Validação do nome
    if (nomeInput) {
      nomeInput.addEventListener('blur', function() {
        const valor = this.value.trim();
        if (valor.length >= 3 && valor.includes(' ')) {
          UIHelper.setInputValid(this);
        } else if (valor.length > 0) {
          UIHelper.setInputError(this, 'Digite seu nome completo');
        }
      });
    }

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
    }

    // Validação do telefone
    if (telefoneInput) {
      telefoneInput.addEventListener('blur', function() {
        const digitos = this.value.replace(/\D/g, '');
        if (digitos.length >= 10) {
          UIHelper.setInputValid(this);
        } else if (digitos.length > 0) {
          UIHelper.setInputError(this, 'Telefone inválido');
        }
      });
    }

    // Validação da senha
    if (senhaInput) {
      senhaInput.addEventListener('blur', function() {
        const valor = this.value;
        if (valor.length >= 6) {
          UIHelper.setInputValid(this);
        } else if (valor.length > 0) {
          UIHelper.setInputError(this, 'Mínimo 6 caracteres');
        }
      });
    }
  }

  /**
   * Configura máscaras de formatação (mantém as existentes do HTML)
   */
  function setupFieldMasks() {
    // Máscara de telefone já existe no HTML
    // Máscara de CPF já existe no HTML
    // Máscara de RG já existe no HTML
    // Mantém as implementações existentes
  }

  /**
   * Marca campos com erro baseado na resposta da API
   */
  function markFieldErrors(errorData) {
    // Implementação pode variar baseado no formato de erro da API
    if (errorData.field) {
      const input = document.getElementById(errorData.field);
      if (input) {
        UIHelper.setInputError(input, errorData.message);
      }
    }
  }

  console.log('✅ Integração de cadastro carregada');
});