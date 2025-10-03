// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona o elemento do link de login
    const loginLink = document.getElementById('loginLink');
    
    // Adiciona evento de clique ao link de login
    if (loginLink) {
        loginLink.addEventListener('click', function() {
            // Redireciona para a página de cadastro
            window.location.href = 'cadastro.html';
        });
    }
    
    // Adiciona animação de entrada suave
    const title = document.querySelector('.title');
    if (title) {
        setTimeout(() => {
            title.style.opacity = '1';
        }, 100);
    }
    
    // Navegação inferior
    const navBtns = document.querySelectorAll('.nav-button');
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // Não remove active do botão home ao clicar no menu
            if (index !== 0) {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }
            console.log('Navegação alterada:', index);
        });
    });
    
    console.log('SecureWay - Tela Inicial carregada com sucesso!');
});