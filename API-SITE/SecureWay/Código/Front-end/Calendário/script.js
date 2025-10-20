// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const calendarDays = document.getElementById('calendarDays');
    const selectedDateEl = document.getElementById('selectedDate');
    const monthYearEl = document.getElementById('monthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const okBtn = document.getElementById('okBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const editBtn = document.getElementById('editBtn');
    const btnHome = document.getElementById('btnHome');
    
    // Estado do calendário
    let currentDate = new Date(2025, 7, 17); // 17 de Agosto de 2025
    let selectedDate = new Date(2025, 7, 17);
    let currentMonth = 7; // Agosto (0-indexed)
    let currentYear = 2025;
    
    // Nomes dos meses e dias
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const monthNamesEn = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Função para gerar o calendário
    function generateCalendar(month, year) {
        calendarDays.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Adiciona células vazias para os dias antes do início do mês
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            calendarDays.appendChild(emptyDay);
        }
        
        // Adiciona os dias do mês
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            dayEl.textContent = day;
            
            // Marca o dia selecionado
            if (day === selectedDate.getDate() && 
                month === selectedDate.getMonth() && 
                year === selectedDate.getFullYear()) {
                dayEl.classList.add('selected');
            }
            
            // Marca o dia atual
            const today = new Date();
            if (day === today.getDate() && 
                month === today.getMonth() && 
                year === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            
            // Adiciona evento de clique
            dayEl.addEventListener('click', () => {
                selectDay(day, month, year);
            });
            
            calendarDays.appendChild(dayEl);
        }
        
        // Atualiza o texto do mês/ano
        monthYearEl.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Função para selecionar um dia
    function selectDay(day, month, year) {
        selectedDate = new Date(year, month, day);
        updateSelectedDateDisplay();
        generateCalendar(month, year);
        
        // Feedback visual
        console.log('Data selecionada:', selectedDate.toLocaleDateString('pt-BR'));
    }
    
    // Função para atualizar a exibição da data selecionada
    function updateSelectedDateDisplay() {
        const dayName = dayNamesEn[selectedDate.getDay()];
        const monthName = monthNamesEn[selectedDate.getMonth()].substring(0, 3);
        const day = selectedDate.getDate();
        
        selectedDateEl.textContent = `${dayName}, ${monthName} ${day}`;
    }
    
    // Navegação entre meses
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
        
        // Adiciona animação suave
        calendarDays.style.animation = 'none';
        setTimeout(() => {
            calendarDays.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
        
        // Adiciona animação suave
        calendarDays.style.animation = 'none';
        setTimeout(() => {
            calendarDays.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    });
    
    // Botão OK - confirma a seleção
    okBtn.addEventListener('click', () => {
        const dateString = selectedDate.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        console.log('Agendamento confirmado para:', dateString);
        
        // Cria uma mensagem personalizada
        const message = `✅ Agendamento Confirmado!\n\n` +
                       `Data: ${dateString}\n` +
                       `Horário: A definir\n\n` +
                       `Você receberá uma confirmação por e-mail em breve.`;
        
        alert(message);
        
        // Aqui você pode adicionar lógica para enviar para o backend
        // Por exemplo: sendAppointment(selectedDate);
    });
    
    // Botão Cancel - cancela a seleção
    cancelBtn.addEventListener('click', () => {
        selectedDate = new Date(2025, 7, 17);
        currentMonth = 7;
        currentYear = 2025;
        updateSelectedDateDisplay();
        generateCalendar(currentMonth, currentYear);
        
        console.log('Seleção cancelada, data resetada para padrão');
    });
    
    // Botão Edit - permite editar a data
    editBtn.addEventListener('click', () => {
        currentMonth = selectedDate.getMonth();
        currentYear = selectedDate.getFullYear();
        generateCalendar(currentMonth, currentYear);
        
        // Scroll suave até o calendário
        document.querySelector('.calendar-card').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        console.log('Modo de edição ativado');
    });
    
    // Botão Home
    if (btnHome) {
        btnHome.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        // Seta esquerda: mês anterior
        if (e.key === 'ArrowLeft') {
            prevMonthBtn.click();
        }
        // Seta direita: próximo mês
        if (e.key === 'ArrowRight') {
            nextMonthBtn.click();
        }
        // Enter: confirmar agendamento
        if (e.key === 'Enter') {
            okBtn.click();
        }
        // Escape: cancelar
        if (e.key === 'Escape') {
            cancelBtn.click();
        }
    });
    
    // Navegação com o teclado nos dias
    let selectedDayIndex = selectedDate.getDate();
    
    // Inicializa o calendário
    generateCalendar(currentMonth, currentYear);
    updateSelectedDateDisplay();
    
    // Adiciona efeito de fade-in aos cards de informação
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.animationDelay = `${0.2 + (index * 0.1)}s`;
    });
    
    console.log('SecureWay - Agendamento carregado com sucesso!');
    console.log(`Data inicial: ${selectedDate.toLocaleDateString('pt-BR')}`);
    console.log('Atalhos de teclado disponíveis:');
    console.log('  ← → : Navegar entre meses');
    console.log('  Enter : Confirmar agendamento');
    console.log('  Esc : Cancelar seleção');
});