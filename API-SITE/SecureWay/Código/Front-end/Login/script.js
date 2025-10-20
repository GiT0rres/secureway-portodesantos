// Configuração da API
        const API_URL = 'http://localhost:3034/api';

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

            // Função para fazer login na API
            async function fazerLogin(email, senha) {
                try {
                    console.log('📤 Tentando login para:', email);

                    // Busca todos os usuários
                    const response = await fetch(`${API_URL}/users`);
                    
                    if (!response.ok) {
                        throw new Error('Erro ao conectar com o servidor');
                    }

                    const usuarios = await response.json();
                    console.log('📥 Usuários recebidos:', usuarios.length);

                    // Procura usuário com email e senha correspondentes
                    const usuario = usuarios.find(u => 
                        u.email === email && u.senhaHash === senha
                    );

                    if (usuario) {
                        console.log('✅ Usuário encontrado:', usuario);
                        return { 
                            success: true, 
                            usuario: usuario 
                        };
                    } else {
                        console.log('❌ Usuário não encontrado ou senha incorreta');
                        return { 
                            success: false, 
                            error: 'E-mail ou senha incorretos' 
                        };
                    }

                } catch (error) {
                    console.error('❌ Erro no login:', error);
                    return { 
                        success: false, 
                        error: 'Erro ao conectar com o servidor. Verifique se a API está rodando.' 
                    };
                }
            }
            
            // Envio do formulário de login
            if (loginForm) {
                loginForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    // Coleta os dados do formulário
                    const email = emailInput.value.trim();
                    const senha = senhaInput.value;
                    
                    // Validações
                    let erros = [];
                    
                    // Valida E-mail
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        erros.push('Por favor, insira um e-mail válido.');
                        emailInput.classList.add('error');
                    }
                    
                    // Valida Senha
                    if (senha.length < 6) {
                        erros.push('A senha deve ter no mínimo 6 caracteres.');
                        senhaInput.classList.add('error');
                    }
                    
                    // Se houver erros, exibe alerta
                    if (erros.length > 0) {
                        alert('Por favor, corrija os seguintes erros:\n\n' + erros.join('\n'));
                        return;
                    }
                    
                    // Feedback visual no botão
                    const btnLogin = loginForm.querySelector('.btn-login');
                    const textoOriginal = btnLogin.textContent;
                    
                    btnLogin.disabled = true;
                    btnLogin.textContent = 'Entrando...';
                    
                    // Faz o login na API
                    const resultado = await fazerLogin(email, senha);
                    
                    if (resultado.success) {
                        btnLogin.textContent = '✓ Login realizado!';
                        btnLogin.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                        
                        console.log('✅ Login realizado com sucesso!');
                        console.log('👤 Usuário:', resultado.usuario);
                        
                        // Salva os dados do usuário no localStorage
                        localStorage.setItem('usuarioLogado', JSON.stringify(resultado.usuario));
                        localStorage.setItem('userId', resultado.usuario.id);
                        
                        console.log('💾 Dados salvos no localStorage');
                        console.log('🔄 Redirecionando para perfil...');
                        
                        // AJUSTE O CAMINHO AQUI DE ACORDO COM SUA ESTRUTURA DE PASTAS
                        // Opções comuns:
                        // '../PerfilMotorista/index.html'
                        // '../perfil-motorista/index.html'
                        // '../Perfil/index.html'
                        
                        setTimeout(() => {
                            window.location.href = '../PerfilMotorista/index.html';
                        }, 1000);
                        
                    } else {
                        // Login falhou
                        btnLogin.textContent = '✗ Erro no login';
                        btnLogin.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                        
                        alert(resultado.error || 'E-mail ou senha incorretos. Tente novamente.');
                        
                        // Restaura o botão após 2 segundos
                        setTimeout(() => {
                            btnLogin.textContent = textoOriginal;
                            btnLogin.style.background = '';
                            btnLogin.disabled = false;
                        }, 2000);
                    }
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
            console.log('📡 API URL:', API_URL);
        });