// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const navBtns = document.querySelectorAll('.nav-btn');
    
    // Validação do e-mail em tempo real
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const valor = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(valor)) {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (valor.length > 0) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        emailInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    }

    // Validação da senha em tempo real
    if (senhaInput) {
        senhaInput.addEventListener('blur', function() {
            const valor = this.value;
            
            if (valor.length >= 6) {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (valor.length > 0) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        senhaInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    }
    
    // Envio do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const dados = {
                email: emailInput.value.trim(),
                senha: senhaInput.value
            };
            
            // Validações
            let erros = [];
            
            // Valida E-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dados.email)) {
                erros.push('Por favor, insira um e-mail válido.');
                emailInput.classList.add('error');
            }
            
            // Valida Senha
            if (dados.senha.length < 6) {
                erros.push('A senha deve ter no mínimo 6 caracteres.');
                senhaInput.classList.add('error');
            }
            
            // Se houver erros, exibe alerta
            if (erros.length > 0) {
                alert('Por favor, corrija os seguintes erros:\n\n' + erros.join('\n'));
                return;
            }
            
            // Log dos dados (aqui você faria a autenticação no servidor)
            console.log('Tentativa de login:', {
                email: dados.email,
                senha: '***' // Não mostrar senha no console
            });
            
            // Feedback visual no botão
            const btnLogin = loginForm.querySelector('.btn-login');
            const textoOriginal = btnLogin.textContent;
            
            btnLogin.disabled = true;
            btnLogin.textContent = 'Entrando...';
            
            // Simula autenticação no servidor
            setTimeout(() => {
                // Aqui você verificaria as credenciais com o backend
                const loginSucesso = true; // Simulação
                
                if (loginSucesso) {
                    btnLogin.textContent = '✓ Login realizado!';
                    btnLogin.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                    
                    console.log('✅ Login realizado com sucesso!');
                    
                    // Redireciona para a página principal após 1.5 segundos
                    setTimeout(() => {
                        window.location.href = '../home/index.html';
                    }, 1500);
                    
                } else {
                    // Login falhou
                    btnLogin.textContent = '✗ Erro no login';
                    btnLogin.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                    
                    alert('E-mail ou senha incorretos. Tente novamente.');
                    
                    // Restaura o botão após 2 segundos
                    setTimeout(() => {
                        btnLogin.textContent = textoOriginal;
                        btnLogin.style.background = '';
                        btnLogin.disabled = false;
                    }, 2000);
                }
            }, 1500);
        });
    }
    
    // Navegação dos botões do header
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            console.log('Navegação alterada:', index);
        });
    });

    // Permitir login com Enter
    if (senhaInput) {
        senhaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    console.log('✅ SecureWay - Login carregado com sucesso!');
    console.log('🔐 Sistema de autenticação pronto');
});