// auth.js - Serviço de Autenticação
// Usa o apiClient do seu api-config.js

const Auth = {
  /**
   * Login de usuário
   */
  async login(email, senha) {
    const response = await apiClient.post('/users/login', {email, senha});
    
    if (response.data['access-token']) {
      TokenManager.setToken(response.data['access-token']);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  /**
   * Registro de novo usuário
   */
  async register(userData) {
    const response = await apiClient.post('/users', {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      telefone: userData.telefone,
      cpf: userData.cpf || null,
      rg: userData.rg || null
    });
    
    if (response.data['access-token']) {
      TokenManager.setToken(response.data['access-token']);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  /**
   * Logout do usuário
   */
  async logout() {
    try {
      await apiClient.post('/user/logout');
    } catch (e) {
      console.warn('Erro ao fazer logout no servidor:', e);
    }
    TokenManager.removeToken();
    localStorage.removeItem('user');
  },

  /**
   * Busca perfil do usuário autenticado
   */
  async getProfile() {
    const response = await apiClient.get('/user/getname');
    return response.data;
  },

  /**
   * Verifica se usuário está autenticado
   */
  async isAuthed() {
    const response = await apiClient.get('/user/isAuthed');
    return response.data;
  },

  /**
   * Verifica acesso do usuário
   */
  async checkAccess(userId) {
    const response = await apiClient.get(`/canAccess/${userId}`);
    return response.data;
  },

  /**
   * Adiciona chave ao usuário
   */
  async addKeyToUser(userId, espId) {
    const response = await apiClient.patch(`/addKeytoUser/${userId}/${espId}`);
    return response.data;
  },

  /**
   * Verifica se está logado localmente
   */
  isLoggedIn() {
    return TokenManager.hasToken();
  },

  /**
   * Retorna dados do usuário do localStorage
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Exporta globalmente
window.Auth = Auth;