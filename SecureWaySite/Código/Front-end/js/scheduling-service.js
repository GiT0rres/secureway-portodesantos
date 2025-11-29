// scheduling-service.js
// Serviço de Agendamentos

const SchedulingService = {
  /**
   * Lista todos os agendamentos
   */
  async getAll() {
    try {
      const response = await apiClient.get('/scheduling');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw { success: false, message: error.message || 'Erro ao buscar agendamentos' };
    }
  },

  /**
   * Busca agendamento por ID
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/scheduling/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      throw { success: false, message: 'Agendamento não encontrado' };
    }
  },

  /**
   * Cria novo agendamento
   * @param {Object} data { local, empresa, carga, dataHora, idUsuario, idEsp }
   */
  async create(data) {
    try {
      if (!data.local || !data.empresa || !data.carga || !data.dataHora || !data.idUsuario || !data.idEsp) {
        throw { message: 'Dados incompletos' };
      }

      const response = await apiClient.post('/scheduling', {
        local: data.local,
        empresa: data.empresa,
        carga: data.carga,
        dataHora: data.dataHora,
        finalizado: data.finalizado || false,
        idUsuario: data.idUsuario,
        idEsp: data.idEsp
      });

      return {
        success: true,
        data: response.data,
        message: 'Agendamento criado com sucesso!'
      };
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw { success: false, message: error.message || 'Erro ao criar agendamento' };
    }
  },

  /**
   * Atualiza agendamento
   */
  async update(id, data) {
    try {
      const response = await apiClient.patch(`/scheduling/${id}`, data);
      return {
        success: true,
        data: response.data,
        message: 'Agendamento atualizado!'
      };
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw { success: false, message: error.message || 'Erro ao atualizar' };
    }
  },

  /**
   * Deleta agendamento
   */
  async delete(id) {
    try {
      await apiClient.delete(`/scheduling/${id}`);
      return {
        success: true,
        message: 'Agendamento deletado!'
      };
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      throw { success: false, message: 'Erro ao deletar' };
    }
  }
};

window.SchedulingService = SchedulingService;