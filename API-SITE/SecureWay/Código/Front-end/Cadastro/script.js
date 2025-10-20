// Configuração da API
const API_URL = 'http://localhost:3034/api';

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const formCadastro = document.getElementById('formCadastro');
    const btnHome = document.getElementById('btnHome');
    const telefoneInput = document.getElementById('telefone');
    const cpfInput = document.getElementById('CPF');
    const rgInput = document.getElementById('RG');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const navBtns = document.querySelectorAll('.nav-btn');
    const modalSucesso = document.getElementById('modalSucesso');
    const btnComecar = document.getElementById('btnComecar');
    
    // Máscara de Telefone (11) 98765-4321
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }
            
            if (valor.length <= 11) {
                valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            
            e.target.value = valor;
        });

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

    // Máscara de CPF (555.555.555-55)
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }
            
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            
            e.target.value = valor;
        });

        cpfInput.addEventListener('blur', function() {
            const valor = this.value.replace(/\D/g, '');
            if (valor.length === 11 && validarCPF(valor)) {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (valor.length > 0) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        cpfInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    }

    // Máscara de RG (12.345.678-9)
    if (rgInput) {
        rgInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 9) {
                valor = valor.slice(0, 9);
            }
            
            valor = valor.replace(/(\d{2})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1})$/, '$1-$2');
            
            e.target.value = valor;
        });

        rgInput.addEventListener('blur', function() {
            const valor = this.value.replace(/\D/g, '');
            if (valor.length >= 8) {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (valor.length > 0) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        rgInput.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    }

    // Validação do CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false;
        }
        
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
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
        if (modalSucesso) {
            modalSucesso.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Função para esconder o modal
    function esconderModal() {
        if (modalSucesso) {
            modalSucesso.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Botão "Ir para Login" do modal
    if (btnComecar) {
        btnComecar.addEventListener('click', function() {
            esconderModal();
            setTimeout(() => {
                window.location.href = '../Login/index.html';
            }, 300);
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

    // Função para verificar se email, CPF ou RG já existem
    async function verificarDuplicatas(email, cpf, rg) {
        try {
            console.log('🔍 Verificando duplicatas...');
            
            const response = await fetch(`${API_URL}/users`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar usuários');
            }
            
            const usuarios = await response.json();
            console.log('📥 Total de usuários:', usuarios.length);
            
            const cpfNumerico = parseInt(cpf);
            const emailLower = email.toLowerCase();
            const rgLimpo = rg.replace(/\D/g, '');
            
            // Verifica email duplicado
            const emailExiste = usuarios.find(u => u.email.toLowerCase() === emailLower);
            if (emailExiste) {
                return { 
                    duplicado: true, 
                    campo: 'E-mail',
                    mensagem: 'Este e-mail já está cadastrado no sistema!' 
                };
            }
            
            // Verifica CPF duplicado
            const cpfExiste = usuarios.find(u => u.cpf === cpfNumerico);
            if (cpfExiste) {
                return { 
                    duplicado: true, 
                    campo: 'CPF',
                    mensagem: 'Este CPF já está cadastrado no sistema!' 
                };
            }
            
            // Verifica RG duplicado
            const rgExiste = usuarios.find(u => u.rg === rgLimpo);
            if (rgExiste) {
                return { 
                    duplicado: true, 
                    campo: 'RG',
                    mensagem: 'Este RG já está cadastrado no sistema!' 
                };
            }
            
            console.log('✅ Nenhuma duplicata encontrada');
            return { duplicado: false };
            
        } catch (error) {
            console.error('❌ Erro ao verificar duplicatas:', error);
            throw error;
        }
    }

    // Função para cadastrar usuário na API
    async function cadastrarUsuario(dados) {
        try {
            console.log('📤 Enviando para:', `${API_URL}/users`);
            console.log('📦 Dados:', {
                ...dados,
                senha: '***'
            });

            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            const data = await response.json();
            console.log('📥 Resposta:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao cadastrar usuário');
            }

            return { success: true, data };
        } catch (error) {
            console.error('❌ Erro na API:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Envio do formulário
    if (formCadastro) {
        formCadastro.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const nome = nomeInput.value.trim();
            const email = emailInput.value.trim();
            const telefone = telefoneInput.value.replace(/\D/g, '');
            const senha = senhaInput.value;
            const cpf = cpfInput.value.replace(/\D/g, '');
            const rg = rgInput.value.replace(/\D/g, '');
            
            // Validações
            let erros = [];
            
            if (nome.length < 3 || !nome.includes(' ')) {
                erros.push('Por favor, insira seu nome completo.');
                nomeInput.classList.add('error');
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                erros.push('Por favor, insira um e-mail válido.');
                emailInput.classList.add('error');
            }
            
            if (telefone.length < 10) {
                erros.push('Por favor, insira um telefone válido com DDD.');
                telefoneInput.classList.add('error');
            }
            
            if (senha.length < 6) {
                erros.push('A senha deve ter no mínimo 6 caracteres.');
                senhaInput.classList.add('error');
            }

            if (!cpf || cpf.length !== 11) {
                erros.push('Por favor, insira um CPF válido.');
                cpfInput.classList.add('error');
            } else if (!validarCPF(cpf)) {
                erros.push('CPF inválido.');
                cpfInput.classList.add('error');
            }

            if (!rg || rg.length < 8) {
                erros.push('Por favor, insira um RG válido (mínimo 8 dígitos).');
                rgInput.classList.add('error');
            }
            
            // Se houver erros, exibe alerta
            if (erros.length > 0) {
                alert('Por favor, corrija os seguintes erros:\n\n' + erros.join('\n'));
                return;
            }
            
            // Feedback visual no botão
            const btnEnviar = formCadastro.querySelector('.btn-primary');
            const textoOriginal = btnEnviar.textContent;
            
            btnEnviar.disabled = true;
            btnEnviar.textContent = '⏳ Verificando...';
            
            try {
                // Verifica duplicatas antes de cadastrar
                const verificacao = await verificarDuplicatas(email, cpf, rg);
                
                if (verificacao.duplicado) {
                    alert(`❌ ${verificacao.mensagem}\n\nCampo: ${verificacao.campo}\n\nPor favor, utilize informações diferentes.`);
                    btnEnviar.textContent = textoOriginal;
                    btnEnviar.disabled = false;
                    return;
                }
                
                btnEnviar.textContent = '✓ Cadastrando...';
                
                // Prepara os dados para enviar à API
                const dadosAPI = {
                    nome: nome,
                    email: email,
                    telefone: parseInt(telefone),
                    senha: senha,
                    cpf: parseInt(cpf),
                    rg: rg
                };

                // Envia para a API
                const resultado = await cadastrarUsuario(dadosAPI);

                // Restaura o botão
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;

                if (resultado.success) {
                    console.log('✅ Cadastro realizado com sucesso!', resultado.data);
                    
                    // Limpa o formulário
                    formCadastro.reset();
                    
                    // Remove classes de validação
                    document.querySelectorAll('.form-group input').forEach(input => {
                        input.classList.remove('valid', 'error');
                    });
                    
                    // Mostra o modal de sucesso
                    mostrarModal();
                    
                } else {
                    console.error('❌ Erro no cadastro:', resultado.error);
                    alert(`Erro ao cadastrar: ${resultado.error}`);
                }
            } catch (error) {
                console.error('❌ Erro:', error);
                alert('Erro ao processar cadastro. Verifique sua conexão e tente novamente.');
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            }
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
    
    console.log('✅ SecureWay - Cadastro de Motorista carregado!');
    console.log('📡 API URL:', API_URL);
});