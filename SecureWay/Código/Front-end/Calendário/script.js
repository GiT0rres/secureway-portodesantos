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
    const closeBtn = document.getElementById('closeBtn');
    const btnHome = document.getElementById('btnHome');
    const navBtns = document.querySelectorAll('.nav-button');
    
    // Estado do calendário
    let currentDate = new Date(2025, 7, 17); // 17 de Agosto de 2025
    let selectedDate = new Date(2025, 7, 17);
    let currentMonth = 7; // Agosto (0-indexed)
    let currentYear = 2025;
    
    // Nomes dos meses e dias
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
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
    }
    
    // Função para atualizar a exibição da data selecionada
    function updateSelectedDateDisplay() {
        const dayName = dayNames[selectedDate.getDay()];
        const monthName = monthNames[selectedDate.getMonth()].substring(0, 3);
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
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });
    
    // Botão OK - confirma a seleção
    okBtn.addEventListener('click', () => {
        console.log('Data confirmada:', selectedDate);
        alert(`Agendamento confirmado para: ${selectedDateEl.textContent}`);
    });
    
    // Botão Cancel - cancela a seleção
    cancelBtn.addEventListener('click', () => {
        selectedDate = new Date(2025, 7, 17);
        currentMonth = 7;
        currentYear = 2025;
        updateSelectedDateDisplay();
        generateCalendar(currentMonth, currentYear);
    });
    
    // Botão Close - fecha o modal
    closeBtn.addEventListener('click', () => {
        console.log('Modal fechado');
        // Aqui você pode adicionar lógica para fechar/ocultar o modal
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
    
    // Inicializa o calendário
    generateCalendar(currentMonth, currentYear);
    updateSelectedDateDisplay();
    
    console.log('SecureWay - Agendamento carregado com sucesso!');
});