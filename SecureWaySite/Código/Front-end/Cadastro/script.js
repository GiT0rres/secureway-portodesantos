// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const formCadastro = document.getElementById('formCadastro');
    const btnHome = document.getElementById('btnHome');
    const telefoneInput = document.getElementById('telefone');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const navBtns = document.querySelectorAll('.nav-btn');
    const modalSucesso = document.getElementById('modalSucesso');
    const btnComecar = document.getElementById('btnComecar');
    
    // Formatar telefone automaticamente (11) 98765-4321
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }
            
            // Aplica a máscara
            if (valor.length <= 11) {
                valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            
            e.target.value = valor;
        });

        // Validação do telefone
        telefoneInput.addEventListener('blur', function() {
            const valor = this.value.replace(/\D/g, '');
            if (valor.length >= 10) {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (valor.length > 0) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        telefoneInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    }

    // Validação do nome completo
    if (nomeInput) {
        nomeInput.addEventListener('blur', function() {
            const valor = this.value.trim();
            if (valor.length >= 3 && valor.includes(' ')) {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (valor.length > 0) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        nomeInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    }

    // Validação do e-mail
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

    // Validação da senha
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

    // Função para mostrar o modal
    function mostrarModal() {
        modalSucesso.classList.add('show');
        document.body.style.overflow = 'hidden'; // Previne scroll
    }

    // Função para esconder o modal
    function esconderModal() {
        modalSucesso.classList.remove('show');
        document.body.style.overflow = ''; // Restaura scroll
    }

    // Botão "Começar" do modal
    if (btnComecar) {
        btnComecar.addEventListener('click', function() {
            esconderModal();
            // Opcional: redirecionar para outra página
            // window.location.href = '../index.html';
        });
    }

    // Fechar modal ao clicar fora dele
    if (modalSucesso) {
        modalSucesso.addEventListener('click', function(e) {
            if (e.target === modalSucesso) {
                esconderModal();
            }
        });
    }
    
    // Envio do formulário
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const dados = {
                nome: nomeInput.value.trim(),
                email: emailInput.value.trim(),
                telefone: telefoneInput.value,
                senha: senhaInput.value
            };
            
            // Validações
            let erros = [];
            
            if (dados.nome.length < 3 || !dados.nome.includes(' ')) {
                erros.push('Por favor, insira seu nome completo.');
                nomeInput.classList.add('error');
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(dados.email)) {
                erros.push('Por favor, insira um e-mail válido.');
                emailInput.classList.add('error');
            }
            
            const telefoneDigitos = dados.telefone.replace(/\D/g, '');
            if (telefoneDigitos.length < 10) {
                erros.push('Por favor, insira um telefone válido com DDD.');
                telefoneInput.classList.add('error');
            }
            
            if (dados.senha.length < 6) {
                erros.push('A senha deve ter no mínimo 6 caracteres.');
                senhaInput.classList.add('error');
            }
            
            // Se houver erros, exibe alerta
            if (erros.length > 0) {
                alert('Por favor, corrija os seguintes erros:\n\n' + erros.join('\n'));
                return;
            }
            
            // Log dos dados (aqui você pode enviar para um servidor)
            console.log('Dados do usuário cadastrado:', {
                ...dados,
                senha: '***' // Não mostrar senha no console
            });
            
            // Feedback visual no botão
            const btnEnviar = formCadastro.querySelector('.btn-primary');
            const textoOriginal = btnEnviar.textContent;
            
            btnEnviar.disabled = true;
            btnEnviar.textContent = '✓ Enviando...';
            
            // Simula envio para servidor
            setTimeout(() => {
                // Limpa o formulário
                formCadastro.reset();
                
                // Remove classes de validação
                document.querySelectorAll('.form-group input').forEach(input => {
                    input.classList.remove('valid', 'error');
                });
                
                // Restaura o botão
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
                
                // Mostra o modal de sucesso
                mostrarModal();
                
            }, 1000);
        });
    }
    
    // Botão Home - volta para a página principal
    if (btnHome) {
        btnHome.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // Navegação dos botões
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (btn.id !== 'btnHome') {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log('Navegação alterada:', index);
            }
        });
    });
    
    console.log('✅ SecureWay - Cadastro carregado com sucesso!');
    console.log('📋 Validações ativas em todos os campos');
    console.log('🎯 Modal de sucesso configurado');
});