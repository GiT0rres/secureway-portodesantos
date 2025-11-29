// auth-service.js
// Serviço de autenticação - Integração com a API

const AuthService = {
  /**
   * Registra novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} Resposta da API
   */
  async register(userData) {
    try {
      // Valida dados antes de enviar
      this.validateRegisterData(userData);

      // Envia requisição para API
      const response = await apiClient.post('/users', {
        nome: userData.nome,
        email: userData.email,
        senha: userData.senha,
        telefone: userData.telefone,
        cpf: userData.cpf || null,
        rg: userData.rg || null
      });

      // Se a API retornar token, salva
      if (response.data['access-token']) {
        TokenManager.setToken(response.data['access-token']);
      }

      return {
        success: true,
        data: response.data,
        message: 'Cadastro realizado com sucesso!'
      };

    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw {
        success: false,
        message: this.getErrorMessage(error),
        error: error
      };
    }
  },

  /**
   * Faz login do usuário
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   * @returns {Promise<Object>} Resposta da API com token
   */
  async login(email, senha) {
    try {
      // Valida dados
      if (!email || !senha) {
        throw { message: 'Email e senha são obrigatórios' };
      }

      // Envia requisição para API
      const response = await apiClient.post('/users/login', {
        email,
        senha
      });

      // Salva token no localStorage
      if (response.data['access-token']) {
        TokenManager.setToken(response.data['access-token']);
      } else {
        throw { message: 'Token não recebido da API' };
      }

      return {
        success: true,
        data: response.data,
        message: 'Login realizado com sucesso!'
      };

    } catch (error) {
      console.error('Erro no login:', error);
      throw {
        success: false,
        message: this.getErrorMessage(error),
        error: error
      };
    }
  },

  /**
   * Faz logout do usuário
   * @returns {Promise<Object>} Confirmação de logout
   */
  async logout() {
    try {
      // Tenta chamar endpoint de logout se existir
      try {
        await apiClient.post('/user/logout');
      } catch (e) {
        // Ignora erro do backend, logout local é o importante
        console.warn('Erro ao chamar logout no backend:', e);
      }

      // Remove token local
      TokenManager.removeToken();

      return {
        success: true,
        message: 'Logout realizado com sucesso!'
      };

    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, remove token local
      TokenManager.removeToken();
      
      return {
        success: true,
        message: 'Logout realizado localmente'
      };
    }
  },

  /**
   * Verifica se usuário está autenticado
   * @returns {boolean} True se autenticado
   */
  isAuthenticated() {
    return TokenManager.hasToken();
  },

  /**
   * Valida dados de registro
   * @param {Object} data - Dados para validar
   * @throws {Error} Se dados inválidos
   */
  validateRegisterData(data) {
    const errors = [];

    if (!data.nome || data.nome.length < 3) {
      errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    if (!data.nome.includes(' ')) {
      errors.push('Digite seu nome completo');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Email inválido');
    }

    if (!data.senha || data.senha.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!data.telefone) {
      errors.push('Telefone é obrigatório');
    }

    if (errors.length > 0) {
      throw { message: errors.join('\n') };
    }
  },

  /**
   * Valida formato de email
   * @param {string} email - Email para validar
   * @returns {boolean} True se válido
   */
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  /**
   * Extrai mensagem de erro amigável
   * @param {Object} error - Objeto de erro
   * @returns {string} Mensagem de erro
   */
  getErrorMessage(error) {
    if (error.message) {
      return error.message;
    }

    if (error.status === 401) {
      return 'Email ou senha incorretos';
    }

    if (error.status === 400) {
      return 'Dados inválidos. Verifique os campos.';
    }

    if (error.status === 409) {
      return 'Email já cadastrado';
    }

    if (error.status === 0) {
      return 'Erro de conexão. Verifique sua internet.';
    }

    return 'Erro ao processar solicitação. Tente novamente.';
  }
};

// Exporta para uso global
window.AuthService = AuthService;