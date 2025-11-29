// user.js
// Serviço de Usuários (Motoristas) - SOMENTE LEITURA
// Empresas consultam motoristas para fazer agendamentos

const Users = {
  /**
   * Busca todos os usuários (motoristas)
   * @returns {Promise<Array>} Lista de usuários
   */
  async getAll() {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      throw error;
    }
  },

  /**
   * Busca usuário por ID
   * @param {number} id - ID do usuário
   * @returns {Promise<Object>} Dados do usuário
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
      throw error;
    }
  },

  /**
   * Atualiza usuário
   * @param {number} id - ID do usuário
   * @param {Object} updates - Dados para atualizar
   * @returns {Promise<Object>} Usuário atualizado
   */
  async update(id, updates) {
    try {
      const response = await apiClient.patch(`/users/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  /**
   * Deleta usuário
   * @param {number} id - ID do usuário
   * @returns {Promise<Object>} Confirmação
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error);
      throw error;
    }
  }
};

// Exporta para uso global
window.Users = Users;