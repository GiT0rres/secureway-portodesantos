// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const btnHome = document.getElementById('btnHome');
    const navBtns = document.querySelectorAll('.nav-button');
    const locationBtns = document.querySelectorAll('.location-btn');
    const appointmentCards = document.querySelectorAll('.appointment-card');
    
    // Dados de exemplo para agendamentos
    const appointments = [
        {
            company: 'Empresa tal',
            address: 'endereço',
            datetime: 'data e horário',
            location: { lat: -23.550520, lng: -46.633308 }
        },
        {
            company: 'Transportadora ABC',
            address: 'Rua das Flores, 123',
            datetime: '15/10/2025 - 14:00',
            location: { lat: -23.560520, lng: -46.643308 }
        },
        {
            company: 'Logística Express',
            address: 'Av. Paulista, 1000',
            datetime: '16/10/2025 - 09:30',
            location: { lat: -23.570520, lng: -46.653308 }
        },
        {
            company: 'Cargas Rápidas',
            address: 'Rua do Comércio, 456',
            datetime: '17/10/2025 - 11:00',
            location: { lat: -23.540520, lng: -46.623308 }
        },
        {
            company: 'Distribuidora Sul',
            address: 'Av. dos Estados, 789',
            datetime: '18/10/2025 - 16:30',
            location: { lat: -23.580520, lng: -46.663308 }
        }
    ];
    
    // Botões de localização
    locationBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const appointment = appointments[index];
            if (appointment) {
                console.log('Abrindo localização:', appointment);
                // Simula abertura do Google Maps
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${appointment.location.lat},${appointment.location.lng}`;
                // window.open(mapsUrl, '_blank');
                alert(`Abrindo localização:\n${appointment.company}\n${appointment.address}`);
            }
        });
    });
    
    // Clique nos cards de agendamento
    appointmentCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const appointment = appointments[index];
            if (appointment) {
                console.log('Agendamento selecionado:', appointment);
                alert(`Detalhes do Agendamento:\n\nEmpresa: ${appointment.company}\nEndereço: ${appointment.address}\nData/Hora: ${appointment.datetime}`);
            }
        });
    });
    
    // Botão Home - volta para index.html
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Navegação inferior
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (btn.id !== 'btnHome') {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log('Navegação alterada:', index);
            }
        });
    });
    
    // Animação de entrada dos cards
    appointmentCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    console.log('SecureWay - Lista de Agendamentos carregada com sucesso!');
    console.log(`Total de agendamentos: ${appointments.length}`);
});