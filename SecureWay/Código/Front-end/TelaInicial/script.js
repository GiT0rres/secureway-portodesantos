document.addEventListener('DOMContentLoaded', function() {
    // Botão de login principal
    const loginBtn = document.getElementById('loginBtn');
    const loginLink = document.querySelector('.login-link');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = '../CadastroDeCaminhão/index.html';
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../CadastroDeCaminhão/index.html';
        });
    }
    
    // Navegação dos botões do header
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach((btn) => {
        btn.addEventListener('click', function() {
            // Remove active de todos os botões
            navBtns.forEach(b => b.classList.remove('active'));
            
            // Adiciona active ao botão clicado
            this.classList.add('active');
            
            // Pega o atributo data-page para identificar qual botão foi clicado
            const page = this.getAttribute('data-page');
            
            // Log para debug
            console.log('Navegação alterada para:', page);
            
            // Aqui você pode adicionar a lógica de navegação específica
            switch(page) {
                case 'menu':
                    console.log('Menu clicado - Abrir menu de navegação');
                    // Adicione sua lógica aqui
                    break;
                case 'inicio':
                    console.log('Início clicado - Página inicial');
                    // Adicione sua lógica aqui
                    break;
                case 'perfil':
                    console.log('Perfil clicado - Ir para perfil do usuário');
                    // Adicione sua lógica aqui
                    break;
            }
        });
    });
    
    console.log('✅ SecureWay - Tela Inicial carregada com sucesso!');
    console.log('📊 Botões de navegação:', navBtns.length);
});