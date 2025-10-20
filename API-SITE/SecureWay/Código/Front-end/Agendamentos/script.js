// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const appointmentsList = document.getElementById('appointmentsList');
    
    // Dados de exemplo para agendamentos
    const appointments = [
        {
            company: 'Lon Mar Transportes',
            address: 'Av. Conselheiro Rodrigues Alves, 50m do Porto - Macuco, Santos - SP',
            datetime: '17/10/2025 às 08:30',
            location: { lat: -23.9459, lng: -46.3240 }
        },
        {
            company: 'RodoQuick Transportes',
            address: 'Rua da Constituição, 512 - Centro, Santos - SP',
            datetime: '17/10/2025 às 11:00',
            location: { lat: -23.9364, lng: -46.3327 }
        },
        {
            company: 'Corporate Logistics do Brasil',
            address: 'Av. Bernardino de Campos, 98 - José Menino, Santos - SP',
            datetime: '18/10/2025 às 09:15',
            location: { lat: -23.9618, lng: -46.3322 }
        },
        {
            company: 'Decklog Transportes',
            address: 'Rua Frei Gaspar, 365 - Vila Mathias, Santos - SP',
            datetime: '18/10/2025 às 14:00',
            location: { lat: -23.9525, lng: -46.3287 }
        },
        {
            company: 'EMSAPORT Logística',
            address: 'Av. Francisco Glicério, 280 - Paquetá, Santos - SP',
            datetime: '19/10/2025 às 10:30',
            location: { lat: -23.9297, lng: -46.3386 }
        },
        {
            company: 'All Ships Logística',
            address: 'Rua General Câmara, 154 - Centro, Santos - SP',
            datetime: '20/10/2025 às 13:45',
            location: { lat: -23.9356, lng: -46.3263 }
        }
    ];
    
    // Função para gerar cards de agendamentos
    function generateAppointmentCards() {
        if (appointments.length === 0) {
            appointmentsList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <h3>Nenhum agendamento</h3>
                    <p>Você não possui agendamentos no momento.</p>
                </div>
            `;
            return;
        }

        const cardsHTML = appointments.map((appointment, index) => `
            <div class="appointment-card" data-index="${index}" style="animation-delay: ${index * 0.1}s">
                <div class="appointment-info">
                    <div class="company-name">${appointment.company}</div>
                    <div class="appointment-details">
                        <div class="detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span class="address">${appointment.address}</span>
                        </div>
                        <div class="detail-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span class="datetime">${appointment.datetime}</span>
                        </div>
                    </div>
                </div>
                <button class="location-btn" data-index="${index}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                </button>
            </div>
        `).join('');

        appointmentsList.innerHTML = cardsHTML;
        
        // Adiciona event listeners após criar os cards
        attachEventListeners();
    }
    
    // Função para adicionar event listeners
    function attachEventListeners() {
        // Botões de localização
        const locationBtns = document.querySelectorAll('.location-btn');
        locationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                openLocation(index);
            });
        });
        
        // Clique nos cards
        const appointmentCards = document.querySelectorAll('.appointment-card');
        appointmentCards.forEach(card => {
            card.addEventListener('click', () => {
                const index = parseInt(card.dataset.index);
                showAppointmentDetails(index);
            });
        });
    }
    
    // Função para abrir localização
    function openLocation(index) {
        const appointment = appointments[index];
        if (appointment) {
            console.log('Abrindo localização:', appointment);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${appointment.location.lat},${appointment.location.lng}`;
            
            // Descomente a linha abaixo para abrir o Google Maps de verdade
            // window.open(mapsUrl, '_blank');
            
            alert(`📍 Abrindo localização:\n\n${appointment.company}\n${appointment.address}\n\nAbrindo Google Maps...`);
        }
    }
    
    // Função para mostrar detalhes do agendamento
    function showAppointmentDetails(index) {
        const appointment = appointments[index];
        if (appointment) {
            console.log('Agendamento selecionado:', appointment);
            alert(`📅 Detalhes do Agendamento\n\n` +
                  `Empresa: ${appointment.company}\n` +
                  `Endereço: ${appointment.address}\n` +
                  `Data/Hora: ${appointment.datetime}\n\n` +
                  `Clique no ícone de localização para ver no mapa.`);
        }
    }
    
    // Gera os cards ao carregar
    generateAppointmentCards();
    
    console.log('SecureWay - Lista de Agendamentos carregada com sucesso!');
    console.log(`Total de agendamentos: ${appointments.length}`);
});