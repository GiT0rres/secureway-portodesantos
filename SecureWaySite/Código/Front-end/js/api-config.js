// api-config.js
// Configuração base da API

const API_CONFIG = {
  baseURL: 'http://localhost:3034/api', // Ajuste para sua URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Token Storage Manager
const TokenManager = {
  // Salva token no localStorage
  setToken(token) {
    localStorage.setItem('access-token', token);
  },

  // Recupera token do localStorage
  getToken() {
    return localStorage.getItem('access-token');
  },

  // Remove token do localStorage
  removeToken() {
    localStorage.removeItem('access-token');
  },

  // Verifica se existe token
  hasToken() {
    return !!this.getToken();
  }
};

// HTTP Client com tratamento de erros
class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Monta headers com token se disponível
  getHeaders(customHeaders = {}) {
    const headers = { ...API_CONFIG.headers, ...customHeaders };
    
    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Método GET
  async get(endpoint, customHeaders = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(customHeaders)
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método POST
  async post(endpoint, data, customHeaders = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(customHeaders),
        body: JSON.stringify(data)
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método PATCH
  async patch(endpoint, data, customHeaders = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(customHeaders),
        body: JSON.stringify(data)
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Método DELETE
  async delete(endpoint, customHeaders = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(customHeaders)
      });

      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Processa resposta da API
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || data.message || 'Erro na requisição',
        data: data
      };
    }

    return {
      status: response.status,
      data: data
    };
  }

  // Trata erros de requisição
  handleError(error) {
    if (error.status) {
      // Erro HTTP da API
      return error;
    } else if (error.name === 'TypeError') {
      // Erro de rede
      return {
        status: 0,
        message: 'Erro de conexão. Verifique sua internet.',
        data: null
      };
    } else {
      // Erro desconhecido
      return {
        status: 500,
        message: 'Erro inesperado. Tente novamente.',
        data: error
      };
    }
  }
}

// Instância global do cliente HTTP
const apiClient = new HttpClient(API_CONFIG.baseURL);

// UI Helper - Mensagens de feedback
const UIHelper = {
  // Mostra mensagem de sucesso
  showSuccess(message, duration = 3000) {
    alert(`✅ ${message}`);
    // Você pode substituir por um toast/notification personalizado
  },

  // Mostra mensagem de erro
  showError(message, duration = 4000) {
    alert(`❌ ${message}`);
    // Você pode substituir por um toast/notification personalizado
  },

  // Mostra loading no botão
  setButtonLoading(button, isLoading, originalText = 'Enviar') {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = button.textContent;
      button.textContent = 'Carregando...';
    } else {
      button.disabled = false;
      button.textContent = button.dataset.originalText || originalText;
    }
  },

  // Limpa erros de validação dos inputs
  clearInputErrors(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.remove('error', 'valid');
    });
  },

  // Marca input com erro
  setInputError(input, message) {
    input.classList.add('error');
    input.classList.remove('valid');
    
    // Você pode adicionar uma mensagem de erro abaixo do input
    // Exemplo: criar um span com a mensagem
  },

  // Marca input como válido
  setInputValid(input) {
    input.classList.add('valid');
    input.classList.remove('error');
  }
};

// Exporta para uso global
window.API_CONFIG = API_CONFIG;
window.TokenManager = TokenManager;
window.apiClient = apiClient;
window.UIHelper = UIHelper;