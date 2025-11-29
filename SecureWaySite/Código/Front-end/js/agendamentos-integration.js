// agendamentos-integration.js - VERSÃO COMPLETA
// Integração COMPLETA da página de agendamentos

document.addEventListener('DOMContentLoaded', async function() {
  
  if (!AuthService.isAuthenticated()) {
    console.log('❌ Usuário não autenticado');
    alert('Faça login para acessar agendamentos');
    setTimeout(() => window.location.href = '../Login/index.html', 1500);
    return;
  }

  // ========== ELEMENTOS DO HTML ==========
  const appointmentsList = document.getElementById('appointmentsList') || 
                           document.querySelector('.appointments-list') ||
                           document.querySelector('.agendamentos-container');
  
  let btnNovoAgendamento = document.getElementById('btnNovoAgendamento') ||
                           document.querySelector('.btn-novo-agendamento');
  
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  // ========== CRIAR BOTÃO SE NÃO EXISTIR ==========
  if (!btnNovoAgendamento && appointmentsList) {
    const actionBar = document.createElement('div');
    actionBar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;';
    
    btnNovoAgendamento = document.createElement('button');
    btnNovoAgendamento.id = 'btnNovoAgendamento';
    btnNovoAgendamento.className = 'btn-novo-agendamento';
    btnNovoAgendamento.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Novo Agendamento
    `;
    btnNovoAgendamento.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 28px;
      background: linear-gradient(135deg, #4a9eff 0%, #2d7dd2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    `;
    
    actionBar.appendChild(btnNovoAgendamento);
    appointmentsList.parentNode.insertBefore(actionBar, appointmentsList);
  }

  let agendamentos = [];
  let userId = null;

  // ========== CARREGA AGENDAMENTOS ==========
  async function carregarAgendamentos() {
    try {
      console.log('📥 Carregando agendamentos...');
      const response = await apiClient.get('/scheduling');
      agendamentos = response.data || [];
      console.log('✅ Agendamentos carregados:', agendamentos.length);
      renderAgendamentos();
    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
      if (appointmentsList) {
        appointmentsList.innerHTML = '<div style="text-align: center; padding: 40px; color: #fff;"><h3>❌ Erro ao carregar agendamentos</h3></div>';
      }
    }
  }

  // ========== RENDERIZA AGENDAMENTOS ==========
  function renderAgendamentos() {
    if (!appointmentsList) {
      console.warn('⚠️ Container de agendamentos não encontrado');
      return;
    }

    if (!agendamentos || agendamentos.length === 0) {
      appointmentsList.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: white; grid-column: 1 / -1;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 20px; opacity: 0.5;">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h3 style="font-size: 1.5rem; margin-bottom: 10px;">Nenhum agendamento encontrado</h3>
          <p style="color: rgba(255,255,255,0.6); margin-bottom: 20px;">Crie seu primeiro agendamento clicando no botão acima</p>
        </div>
      `;
      return;
    }

    appointmentsList.innerHTML = agendamentos.map((ag, index) => {
      const data = new Date(ag.dataHora);
      const dataFormatada = data.toLocaleDateString('pt-BR');
      const horaFormatada = data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
      const status = ag.finalizado ? 'concluido' : 'pendente';

      return `
        <div class="agendamento-card appointment-card" data-id="${ag.id}" data-status="${status}" style="animation: cardAppear 0.5s ease ${index * 0.1}s backwards;">
          <div class="appointment-info" style="flex: 1;">
            <div class="company-name" style="font-size: 1.3rem; color: white; font-weight: 700; margin-bottom: 10px;">
              ${ag.empresa || 'Empresa'}
            </div>
            <div class="appointment-details" style="display: flex; flex-direction: column; gap: 8px;">
              <div class="detail-row" style="display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85); font-size: 0.95rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>${ag.local || 'Local não informado'}</span>
              </div>
              <div class="detail-row" style="display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85); font-size: 0.95rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>${dataFormatada} às ${horaFormatada}</span>
              </div>
              <div class="detail-row" style="display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85); font-size: 0.95rem;">
                <span><strong>Carga:</strong> ${ag.carga || 'Não informado'}</span>
              </div>
              <div class="detail-row" style="display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.85); font-size: 0.95rem;">
                <span><strong>Status:</strong> ${ag.finalizado ? '✅ Concluído' : '⏳ Pendente'}</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
            ${!ag.finalizado ? `
              <button class="btn-editar" onclick="editarAgendamento(${ag.id})" style="flex: 1; padding: 10px 15px; background: #4a9eff; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: inherit;">✏️ Editar</button>
              <button class="btn-cancelar" onclick="cancelarAgendamento(${ag.id})" style="flex: 1; padding: 10px 15px; background: #dc3545; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: inherit;">🗑️ Cancelar</button>
            ` : `
              <button class="btn-visualizar" onclick="visualizarAgendamento(${ag.id})" style="flex: 1; padding: 10px 15px; background: #17a2b8; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s; font-family: inherit;">👁️ Detalhes</button>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Adiciona animação
    if (!document.getElementById('agendamentos-animation')) {
      const style = document.createElement('style');
      style.id = 'agendamentos-animation';
      style.textContent = `
        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .btn-editar:hover, .btn-cancelar:hover, .btn-visualizar:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ========== EDITAR AGENDAMENTO ==========
  window.editarAgendamento = async (id) => {
    const ag = agendamentos.find(a => a.id === id);
    if (!ag) {
      alert('❌ Agendamento não encontrado');
      return;
    }

    const novoLocal = prompt('📍 Novo local:', ag.local || '');
    if (novoLocal === null) return;

    const novaCarga = prompt('📦 Nova carga:', ag.carga || '');
    if (novaCarga === null) return;

    const updates = {};
    if (novoLocal && novoLocal.trim()) updates.local = novoLocal.trim();
    if (novaCarga && novaCarga.trim()) updates.carga = novaCarga.trim();

    if (Object.keys(updates).length === 0) {
      alert('ℹ️ Nenhuma mudança foi feita');
      return;
    }

    try {
      console.log('📝 Atualizando agendamento...', updates);
      await apiClient.patch(`/scheduling/${id}`, updates);
      alert('✅ Agendamento atualizado com sucesso!');
      await carregarAgendamentos();
    } catch (error) {
      console.error('❌ Erro ao atualizar:', error);
      alert('❌ Erro ao atualizar: ' + (error.data?.error || error.message || 'Tente novamente'));
    }
  };

  // ========== CANCELAR AGENDAMENTO ==========
  window.cancelarAgendamento = async (id) => {
    if (!confirm('⚠️ Tem certeza que deseja CANCELAR este agendamento?\n\nEsta açãonão pode ser desfeita.')) {
return;
}
try {
  console.log('🗑️ Cancelando agendamento...');
  await apiClient.delete(`/scheduling/${id}`);
  alert('✅ Agendamento cancelado com sucesso!');
  await carregarAgendamentos();
} catch (error) {
  console.error('❌ Erro ao cancelar:', error);
  alert('❌ Erro ao cancelar: ' + (error.data?.error || error.message || 'Tente novamente'));
}
};
// ========== VISUALIZAR AGENDAMENTO ==========
window.visualizarAgendamento = (id) => {
const ag = agendamentos.find(a => a.id === id);
if (!ag) {
alert('❌ Agendamento não encontrado');
return;
}
const data = new Date(ag.dataHora);
const dataFormatada = data.toLocaleDateString('pt-BR');
const horaFormatada = data.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
alert(`
📋 DETALHES DO AGENDAMENTO\n\n +
ID: #${id}\n +
🏢 Empresa: ${ag.empresa}\n +
📍 Local: ${ag.local}\n +
📦 Carga: ${ag.carga}\n +
📅 Data/Hora: ${dataFormatada} às ${horaFormatada}\n +
📊 Status: ${ag.finalizado ? '✅ Concluído' : '⏳ Pendente'}\n +
👤 ID Usuário: ${ag.idUsuario}\n +
📡 ID ESP: ${ag.idEsp}
`);
};
// ========== CRIAR NOVO AGENDAMENTO ==========
if (btnNovoAgendamento) {
btnNovoAgendamento.addEventListener('click', async () => {
if (!AuthService.isAuthenticated()) {
alert('❌ Faça login para criar agendamento');
return;
}
const empresa = prompt('🏢 Nome da empresa:');
  if (!empresa) return;

  const local = prompt('📍 Local do agendamento:');
  if (!local) return;

  const carga = prompt('📦 Tipo de carga:');
  if (!carga) return;

  const dataHora = prompt('📅 Data e hora (AAAA-MM-DD HH:MM):\n\nExemplo: 2025-12-25 14:30');
  if (!dataHora) return;

  const idEsp = prompt('📡 ID do ESP (leitor):\n\nDigite um número');
  if (!idEsp) return;

  try {
    console.log('➕ Criando novo agendamento...');
    
    if (isNaN(parseInt(idEsp))) {
      alert('❌ ID do ESP deve ser um número');
      return;
    }

    const dataObj = new Date(dataHora);
    if (isNaN(dataObj.getTime())) {
      alert('❌ Data/hora inválida.\n\nUse formato: AAAA-MM-DD HH:MM\nExemplo: 2025-12-25 14:30');
      return;
    }

    await apiClient.post('/scheduling', {
      empresa: empresa.trim(),
      local: local.trim(),
      carga: carga.trim(),
      dataHora: dataHora,
      finalizado: false,
      idUsuario: userId || 1,
      idEsp: parseInt(idEsp)
    });
    
    alert('✅ Agendamento criado com sucesso!');
    await carregarAgendamentos();
  } catch (error) {
    console.error('❌ Erro ao criar:', error);
    alert('❌ Erro ao criar agendamento:\n\n' + (error.data?.error || error.message || 'Tente novamente'));
  }
});
}
if (menuBtn && sidebar && overlay) {
menuBtn.addEventListener('click', (e) => {
e.preventDefault();
sidebar.classList.toggle('active');
overlay.classList.toggle('active');
});
overlay.addEventListener('click', () => {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }
});
}
// ========== OBTÉM ID DO USUÁRIO ==========
try {
const profileResponse = await UserService.getProfile();
if (profileResponse.success && profileResponse.data) {
userId = profileResponse.data.id;
console.log('👤 Usuário ID:', userId);
}
} catch (error) {
console.warn('⚠️ Não foi possível obter ID do usuário:', error);
userId = 1;
}
// ========== CARREGA DADOS ==========
await carregarAgendamentos();
console.log('✅ Integração COMPLETA de agendamentos carregada');
console.log('📊 Total de agendamentos:', agendamentos.length);
});