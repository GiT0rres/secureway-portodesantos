// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const appointmentsList = document.getElementById('appointmentsList');
    
    // Dados de exemplo para agendamentos
    const appointments = [
        {
            company: 'Transportadora ABC Logística',
            address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
            datetime: '15/10/2025 às 14:00',
            location: { lat: -23.550520, lng: -46.633308 }
        },
        {
            company: 'Logística Express Brasil',
            address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
            datetime: '16/10/2025 às 09:30',
            location: { lat: -23.561414, lng: -46.655881 }
        },
        {
            company: 'Cargas Rápidas Transportes',
            address: 'Rua do Comércio, 456 - Centro, São Paulo - SP',
            datetime: '17/10/2025 às 11:00',
            location: { lat: -23.540520, lng: -46.623308 }
        },
        {
            company: 'Distribuidora Sul Entregas',
            address: 'Av. dos Estados, 789 - Santo André - SP',
            datetime: '18/10/2025 às 16:30',
            location: { lat: -23.663421, lng: -46.530544 }
        },
        {
            company: 'Transportes Norte Express',
            address: 'Rua Silva Bueno, 321 - Ipiranga, São Paulo - SP',
            datetime: '19/10/2025 às 10:15',
            location: { lat: -23.587320, lng: -46.610181 }
        },
        {
            company: 'Mega Transportadora Ltda',
            address: 'Av. Tiradentes, 654 - Bom Retiro, São Paulo - SP',
            datetime: '20/10/2025 às 13:45',
            location: { lat: -23.527520, lng: -46.633308 }
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
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Gera os cards ao carregar
    generateAppointmentCards();
    
    console.log('SecureWay - Lista de Agendamentos carregada com sucesso!');
    console.log(`Total de agendamentos: ${appointments.length}`);
});