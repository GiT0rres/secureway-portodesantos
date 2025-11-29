// user-service.js
// Serviço de usuários - Operações de perfil e dados do usuário

const UserService = {
  /**
   * Busca dados do usuário autenticado
   * @returns {Promise<Object>} Dados do usuário
   */
  async getProfile() {
    try {
      // Verifica se está autenticado
      if (!AuthService.isAuthenticated()) {
        throw { message: 'Usuário não autenticado' };
      }

      // Busca dados do perfil
      const response = await apiClient.get('/user/getname');

      return {
        success: true,
        data: response.data,
        message: 'Perfil carregado com sucesso'
      };

    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      
      // Se token inválido, faz logout
      if (error.status === 401) {
        TokenManager.removeToken();
        throw {
          success: false,
          message: 'Sessão expirada. Faça login novamente.',
          error: error,
          requireLogin: true
        };
      }

      throw {
        success: false,
        message: 'Erro ao carregar perfil. Tente novamente.',
        error: error
      };
    }
  },

  /**
   * Busca usuário por ID
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw {
        success: false,
        message: 'Erro ao carregar dados do usuário',
        error: error
      };
    }
  },

  /**
   * Atualiza dados do usuário
   * @param {number} userId - ID do usuário
   * @param {Object} updateData - Dados para atualizar
   * @returns {Promise<Object>} Dados atualizados
   */
  async updateProfile(userId, updateData) {
    try {
      // Valida dados
      if (!userId) {
        throw { message: 'ID do usuário não fornecido' };
      }

      // Remove campos vazios ou null
      const cleanData = this.cleanUpdateData(updateData);

      if (Object.keys(cleanData).length === 0) {
        throw { message: 'Nenhum dado para atualizar' };
      }

      // Envia atualização
      const response = await apiClient.patch(`/users/${userId}`, cleanData);

      return {
        success: true,
        data: response.data,
        message: 'Perfil atualizado com sucesso!'
      };

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      
      if (error.status === 401) {
        TokenManager.removeToken();
        throw {
          success: false,
          message: 'Sessão expirada. Faça login novamente.',
          error: error,
          requireLogin: true
        };
      }

      throw {
        success: false,
        message: error.message || 'Erro ao atualizar perfil',
        error: error
      };
    }
  },

  /**
   * Verifica status de autenticação
   * @returns {Promise<Object>} Status de autenticação
   */
  async checkAuth() {
    try {
      const response = await apiClient.get('/user/isAuthed');

      return {
        success: true,
        authenticated: response.data.authenticated || true
      };

    } catch (error) {
      return {
        success: false,
        authenticated: false
      };
    }
  },

  /**
   * Verifica se usuário pode acessar (rota do sistema antigo)
   * @param {number} userId - ID do usuário
   * @returns {Promise<Object>} Resultado da verificação
   */
  async checkAccess(userId) {
    try {
      const response = await apiClient.get(`/canAccess/${userId}`);

      return {
        success: true,
        data: response.data
      };

    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      throw {
        success: false,
        message: error.message || 'Erro ao verificar acesso',
        error: error
      };
    }
  },

  /**
   * Adiciona chave ao usuário (rota do sistema antigo)
   * @param {number} userId - ID do usuário
   * @param {number} espId - ID do ESP
   * @returns {Promise<Object>} Resultado da operação
   */
  async addKeyToUser(userId, espId) {
    try {
      const response = await apiClient.patch(`/addKeytoUser/${userId}/${espId}`);

      return {
        success: true,
        data: response.data,
        message: 'Chave adicionada com sucesso!'
      };

    } catch (error) {
      console.error('Erro ao adicionar chave:', error);
      throw {
        success: false,
        message: error.message || 'Erro ao adicionar chave',
        error: error
      };
    }
  },

  /**
   * Remove campos vazios ou null dos dados de atualização
   * @param {Object} data - Dados para limpar
   * @returns {Object} Dados limpos
   */
  cleanUpdateData(data) {
    const cleaned = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key] = value;
      }
    }

    return cleaned;
  },

  /**
   * Valida formato de telefone brasileiro
   * @param {string} telefone - Telefone para validar
   * @returns {boolean} True se válido
   */
  isValidPhone(telefone) {
    const digits = telefone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  },

  /**
   * Valida formato de CPF
   * @param {string} cpf - CPF para validar
   * @returns {boolean} True se válido
   */
  isValidCPF(cpf) {
    const digits = cpf.replace(/\D/g, '');
    return digits.length === 11;
  }
};

// Exporta para uso global
window.UserService = UserService;