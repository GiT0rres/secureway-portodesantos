// read-service.js
// Serviço de Leituras (Read)

const ReadService = {
  /**
   * Lista todas as leituras
   */
  async getAll() {
    try {
      const response = await apiClient.get('/read');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
      throw { success: false, message: 'Erro ao buscar leituras' };
    }
  },

  /**
   * Busca leitura por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/read/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar leitura:', error);
      throw { success: false, message: 'Leitura não encontrada' };
    }
  },

  /**
   * Cria nova leitura
   * @param {Object} data { readKey, idEsp }
   */
  async create(data) {
    try {
      if (!data.readKey || !data.idEsp) {
        throw { message: 'Chave e ESP são obrigatórios' };
      }

      const response = await apiClient.post('/read', {
        readKey: data.readKey,
        idEsp: data.idEsp
      });

      return {
        success: true,
        data: response.data,
        message: 'Leitura registrada!'
      };
    } catch (error) {
      console.error('Erro ao criar leitura:', error);
      throw { success: false, message: error.message || 'Erro ao registrar leitura' };
    }
  },

  /**
   * Atualiza leitura
   */
  async update(id, data) {
    try {
      const response = await apiClient.patch(`/read/${id}`, data);
      return {
        success: true,
        data: response.data,
        message: 'Leitura atualizada!'
      };
    } catch (error) {
      console.error('Erro ao atualizar leitura:', error);
      throw { success: false, message: 'Erro ao atualizar' };
    }
  },

  /**
   * Deleta leitura
   */
  async delete(id) {
    try {
      await apiClient.delete(`/read/${id}`);
      return {
        success: true,
        message: 'Leitura deletada!'
      };
    } catch (error) {
      console.error('Erro ao deletar leitura:', error);
      throw { success: false, message: 'Erro ao deletar' };
    }
  }
};

window.ReadService = ReadService;