// esp.js - Serviço de ESPs (Leitores RFID)
// Usa o apiClient do seu api-config.js

const ESP = {
  /**
   * Lista todos os ESPs
   */
  async getAll() {
    const response = await apiClient.get('/esp');
    return response.data;
  },

  /**
   * Busca ESP por ID
   */
  async getById(id) {
    const response = await apiClient.get(`/esp/${id}`);
    return response.data;
  },

  /**
   * Cria novo ESP
   */
  async create(data) {
    const response = await apiClient.post('/esp', {
      nome: data.nome,
      local: data.local
    });
    return response.data;
  },

  /**
   * Atualiza ESP
   */
  async update(id, data) {
    const response = await apiClient.patch(`/esp/${id}`, data);
    return response.data;
  },

  /**
   * Deleta ESP
   */
  async delete(id) {
    const response = await apiClient.delete(`/esp/${id}`);
    return response.data;
  }
};

// Exporta globalmente
window.ESP = ESP;