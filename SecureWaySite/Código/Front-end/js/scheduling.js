// scheduling.js
// Serviço de Agendamentos - CRUD completo

const Scheduling = {
  /**
   * Lista todos os agendamentos
   * @returns {Promise<Array>} Lista de agendamentos
   */
  async getAll() {
    try {
      const response = await apiClient.get('/scheduling');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamentos:', error);
      throw error;
    }
  },

  /**
   * Busca agendamento por ID
   * @param {number} id - ID do agendamento
   * @returns {Promise<Object>} Dados do agendamento
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/scheduling/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar agendamento:', error);
      throw error;
    }
  },

  /**
   * Cria novo agendamento
   * @param {Object} schedulingData - Dados do agendamento
   * @returns {Promise<Object>} Agendamento criado
   */
  async create(schedulingData) {
    try {
      const response = await apiClient.post('/scheduling', {
        local: schedulingData.local,
        empresa: schedulingData.empresa,
        carga: schedulingData.carga,
        dataHora: schedulingData.dataHora,
        finalizado: schedulingData.finalizado || false,
        idUsuario: schedulingData.idUsuario,
        idEsp: schedulingData.idEsp
      });
      
      console.log('✅ Agendamento criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
      throw error;
    }
  },

  /**
   * Atualiza agendamento
   * @param {number} id - ID do agendamento
   * @param {Object} updates - Dados para atualizar
   * @returns {Promise<Object>} Agendamento atualizado
   */
  async update(id, updates) {
    try {
      const response = await apiClient.patch(`/scheduling/${id}`, updates);
      console.log('✅ Agendamento atualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao atualizar agendamento:', error);
      throw error;
    }
  },

  /**
   * Deleta agendamento
   * @param {number} id - ID do agendamento
   * @returns {Promise<Object>} Confirmação
   */
  async delete(id) {
    try {
      const response = await apiClient.delete(`/scheduling/${id}`);
      console.log('✅ Agendamento deletado');
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao deletar agendamento:', error);
      throw error;
    }
  }
};

// Exporta globalmente
window.Scheduling = Scheduling;