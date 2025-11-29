// leituras-integration.js
// Integração para visualizar leituras RFID do ESP

document.addEventListener('DOMContentLoaded', async () => {
  if (!AuthService.isAuthenticated()) {
    alert('❌ Faça login para acessar');
    setTimeout(() => window.location.href = '../Login/index.html', 1000);
    return;
  }

  const container = document.getElementById('leiturasContainer') || 
                    document.getElementById('readContainer') ||
                    document.querySelector('.leituras-list') ||
                    document.querySelector('.reads-container');

  if (!container) {
    console.warn('⚠️ Container de leituras não encontrado');
    return;
  }

  let leituras = [];
  let esps = [];

  // Carrega ESPs
  async function carregarESPs() {
    try {
      console.log('📡 Carregando dispositivos ESP...');
      const response = await apiClient.get('/esp');
      esps = response.data || [];
      console.log('✅ ESPs carregados:', esps.length);
    } catch (error) {
      console.error('❌ Erro ao carregar ESPs:', error);
    }
  }

  // Carrega leituras
  async function carregarLeituras() {
    try {
      console.log('📖 Carregando leituras RFID...');
      const response = await apiClient.get('/read');
      leituras = response.data || [];
      console.log('✅ Leituras carregadas:', leituras.length);
      renderLeituras();
    } catch (error) {
      console.error('❌ Erro ao carregar leituras:', error);
      container.innerHTML = '<div style="text-align: center; padding: 40px; color: white;"><h3>❌ Erro ao carregar leituras</h3></div>';
    }
  }

  // Renderiza leituras
  function renderLeituras() {
    if (!leituras || leituras.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: white;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 20px; opacity: 0.5;">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h3>Nenhuma leitura RFID registrada</h3>
          <p style="color: rgba(255,255,255,0.6); margin-top: 10px;">As leituras aparecerão aqui quando o ESP registrar tags</p>
        </div>
      `;
      return;
    }

    container.innerHTML = leituras.map((leitura, index) => {
      const esp = esps.find(e => e.id === leitura.idEsp);
      const data = new Date(leitura.createdAt);
      const dataFormatada = data.toLocaleDateString('pt-BR');
      const horaFormatada = data.toLocaleTimeString('pt-BR');

      return `
        <div class="leitura-card" style="background: rgba(13, 61, 77, 0.6); border-radius: 12px; padding: 20px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 15px; animation: fadeIn 0.5s ease ${index * 0.1}s backwards;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
            <div>
              <h4 style="color: white; font-size: 1.2rem; margin-bottom: 5px;">🔑 Chave: ${leitura.readKey}</h4>
              <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">ID da Leitura: #${leitura.id}</p>
            </div>
            <div style="background: rgba(74, 158, 255, 0.2); color: #4a9eff; padding: 6px 14px; border-radius: 8px; font-weight: 600;">
              📡 ESP #${leitura.idEsp}
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
            <div>
              <div style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 4px;">📍 Local do ESP</div>
              <div style="color: white; font-weight: 600;">${esp?.local || 'Não informado'}</div>
            </div>
            <div>
              <div style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 4px;">📅 Data</div>
              <div style="color: white; font-weight: 600;">${dataFormatada}</div>
            </div>
            <div>
              <div style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin-bottom: 4px;">⏰ Hora</div>
              <div style="color: white; font-weight: 600;">${horaFormatada}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Adiciona animação CSS
    if (!document.getElementById('leituras-animation-css')) {
      const style = document.createElement('style');
      style.id = 'leituras-animation-css';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Carrega dados
  await carregarESPs();
  await carregarLeituras();

  // Atualiza a cada 10 segundos
  setInterval(carregarLeituras, 10000);

  console.log('✅ Integração de Leituras RFID carregada');
});