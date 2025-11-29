// read.js - Serviço de Leituras RFID
// Usa o apiClient do seu api-config.js

const Read = {
  async getAll() {
    const response = await apiClient.get('/read');
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/read/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await apiClient.post('/read', {
      readKey: data.readKey,
      idEsp: data.idEsp
    });
    return response.data;
  },

  async update(id, data) {
    const response = await apiClient.patch(`/read/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await apiClient.delete(`/read/${id}`);
    return response.data;
  }
};


// ========================
// FUNÇÃO DE CARREGAR HISTÓRICO
// ========================

async function carregarHistorico() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
        console.error("Usuário não autenticado");
        return;
    }

    try {
        const response = await apiClient.get(`/read/history/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        const container = document.getElementById("historicoContainer");
        container.innerHTML = "";

        if (!data.length) {
            container.innerHTML = `<p>Nenhum histórico encontrado.</p>`;
            return;
        }

        data.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("historico-item");

            div.innerHTML = `
                <div class="historico-icon ${item.status === 'success' ? 'success' : 'info'}">
                    ✔
                </div>
                <div class="historico-info">
                    <h4>${item.titulo}</h4>
                    <p>${item.descricao}</p>
                    <span class="historico-data">${new Date(item.data).toLocaleString('pt-BR')}</span>
                </div>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
}

document.addEventListener("DOMContentLoaded", carregarHistorico);

// Exporta globalmente
window.Read = Read;