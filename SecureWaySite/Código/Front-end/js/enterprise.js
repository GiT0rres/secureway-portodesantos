// enterprise.js
// Serviço de Empresas - Login, Registro e Gerenciamento

const Enterprise = {
  /**
   * Login de empresa
   * @param {string} email - Email da empresa
   * @param {string} senha - Senha da empresa
   * @returns {Promise<Object>} Dados da empresa e token
   */
  async login(email, senha) {
    try {
      const response = await apiClient.post('/enterprise/login', {
        email,
        senha
      });
      
      console.log('✅ Login empresa:', response.data);
      
      // Salva token
      if (response.data['access-token']) {
        TokenManager.setToken(response.data['access-token']);
      }
      
      // Salva dados da empresa no localStorage
      if (response.data.enterprise) {
        localStorage.setItem('enterprise', JSON.stringify(response.data.enterprise));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro no login empresa:', error);
      throw error;
    }
  },

  /**
   * Registro de nova empresa
   * @param {Object} enterpriseData - Dados da empresa
   * @returns {Promise<Object>} Empresa criada
   */
  async register(enterpriseData) {
    try {
      const response = await apiClient.post('/enterprise', {
        nomeEmpresa: enterpriseData.nomeEmpresa,
        email: enterpriseData.email,
        senha: enterpriseData.senha,
        telefone: enterpriseData.telefone,
        cnpj: enterpriseData.cnpj
      });
      
      console.log('✅ Empresa cadastrada:', response.data);
      
      // Salva token
      if (response.data['access-token']) {
        TokenManager.setToken(response.data['access-token']);
      }
      
      // Salva dados da empresa
      if (response.data.enterprise) {
        localStorage.setItem('enterprise', JSON.stringify(response.data.enterprise));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao cadastrar empresa:', error);
      throw error;
    }
  },

  /**
   * Lista todas as empresas
   * @returns {Promise<Array>} Lista de empresas
   */
  async getAll() {
    try {
      const response = await apiClient.get('/enterprise');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar empresas:', error);
      throw error;
    }
  },

  /**
   * Busca empresa por ID
   * @param {number} id - ID da empresa
   * @returns {Promise<Object>} Dados da empresa
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/enterprise/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar empresa:', error);
      throw error;
    }
  },

  /**
   * Atualiza dados da empresa
   * @param {number} id - ID da empresa
   * @param {Object} data - Dados para atualizar
   * @returns {Promise<Object>} Empresa atualizada
   */
  async update(id, data) {
    try {
      const response = await apiClient.patch(`/enterprise/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar empresa:', error);
      throw error;
    }
  },

  /**
   * Deleta empresa
   * @param {number} id - ID da empresa
   * @returns {Promise<Object>} Confirmação
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/enterprise/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao deletar empresa:', error);
      throw error;
    }
  },

  /**
   * Logout da empresa
   */
  logout() {
    TokenManager.removeToken();
    localStorage.removeItem('enterprise');
  }
};

// Exporta globalmente
window.Enterprise = Enterprise;