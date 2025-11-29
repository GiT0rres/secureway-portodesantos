// esp-service.js
// Serviço de ESP (Leitores)

const ESPService = {
  /**
   * Lista todos os ESPs
   */
  async getAll() {
    try {
      const response = await apiClient.get('/esp');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar ESPs:', error);
      throw { success: false, message: 'Erro ao buscar leitores' };
    }
  },

  /**
   * Busca ESP por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/esp/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar ESP:', error);
      throw { success: false, message: 'Leitor não encontrado' };
    }
  },

  /**
   * Cria novo ESP
   * @param {Object} data { nome, local }
   */
  async create(data) {
    try {
      if (!data.nome || !data.local) {
        throw { message: 'Nome e local são obrigatórios' };
      }

      const response = await apiClient.post('/esp', {
        nome: data.nome,
        local: data.local
      });

      return {
        success: true,
        data: response.data,
        message: 'Leitor cadastrado com sucesso!'
      };
    } catch (error) {
      console.error('Erro ao criar ESP:', error);
      throw { success: false, message: error.message || 'Erro ao cadastrar leitor' };
    }
  },

  /**
   * Atualiza ESP
   */
  async update(id, data) {
    try {
      const response = await apiClient.patch(`/esp/${id}`, data);
      return {
        success: true,
        data: response.data,
        message: 'Leitor atualizado!'
      };
    } catch (error) {
      console.error('Erro ao atualizar ESP:', error);
      throw { success: false, message: 'Erro ao atualizar' };
    }
  },

  /**
   * Deleta ESP
   */
  async delete(id) {
    try {
      await apiClient.delete(`/esp/${id}`);
      return {
        success: true,
        message: 'Leitor deletado!'
      };
    } catch (error) {
      console.error('Erro ao deletar ESP:', error);
      throw { success: false, message: 'Erro ao deletar' };
    }
  }
};

window.ESPService = ESPService;