// ========================================
// CONFIGURAÇÃO DA API
// ========================================
const API_URL = 'http://localhost:3034/api';

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const formCadastro = document.getElementById('formCadastro');
    const inputTelefone = document.getElementById('telefone');
    const inputCNPJ = document.getElementById('cnpj');
    const inputSenha = document.getElementById('senha');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthBar = document.getElementById('strengthBar');
    const linkLogin = document.getElementById('linkLogin');

    // ========================================
    // MÁSCARAS DE INPUT
    // ========================================

    // Máscara de Telefone
    inputTelefone.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        
        e.target.value = value;
    });

    // Máscara de CNPJ
    inputCNPJ.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        
        e.target.value = value;
    });

    // ========================================
    // INDICADOR DE FORÇA DA SENHA
    // ========================================
    inputSenha.addEventListener('input', function(e) {
        const senha = e.target.value;
        
        if (senha.length === 0) {
            passwordStrength.classList.remove('show');
            return;
        }
        
        passwordStrength.classList.add('show');
        
        let forca = 0;
        if (senha.length >= 6) forca++;
        if (senha.length >= 10) forca++;
        if (/[A-Z]/.test(senha)) forca++;
        if (/[0-9]/.test(senha)) forca++;
        if (/[^A-Za-z0-9]/.test(senha)) forca++;
        
        strengthBar.className = 'password-strength-bar';
        
        if (forca <= 2) {
            strengthBar.classList.add('strength-weak');
        } else if (forca <= 4) {
            strengthBar.classList.add('strength-medium');
        } else {
            strengthBar.classList.add('strength-strong');
        }
    });

    // ========================================
    // FUNÇÕES DE VALIDAÇÃO
    // ========================================

    // Validação de CNPJ
    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length !== 14) return false;
        if (/^(\d)\1+$/.test(cnpj)) return false;

        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;

        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }

        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1)) return false;

        return true;
    }

    // Validação de Email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // ========================================
    // FUNÇÃO DE NOTIFICAÇÃO
    // ========================================
    function mostrarNotificacao(mensagem, tipo = 'success') {
        const notificacao = document.createElement('div');
        notificacao.className = 'notificacao-toast';
        notificacao.textContent = mensagem;
        
        const cores = {
            success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            error: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            info: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
        };
        
        notificacao.style.background = cores[tipo] || cores.success;
        notificacao.style.animation = 'slideInRight 0.4s ease';
        
        document.body.appendChild(notificacao);
        
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notificacao.remove(), 400);
        }, 3000);
    }

    // ========================================
    // VERIFICAR DUPLICATAS NA API
    // ========================================
    async function verificarDuplicatas(email, cnpj, telefone) {
        try {
            console.log('🔍 Verificando duplicatas na API...');
            
            const response = await fetch(`${API_URL}/enterprise`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar empresas');
            }
            
            const empresas = await response.json();
            console.log('📥 Total de empresas:', empresas.length);
            
            // Remove máscara do CNPJ e telefone
            const cnpjLimpo = cnpj.replace(/\D/g, '');
            const telefoneLimpo = telefone.replace(/\D/g, '');
            const emailLower = email.toLowerCase();
            
            // Verifica email duplicado
            const emailExiste = empresas.find(e => 
                e.email && e.email.toLowerCase() === emailLower
            );
            if (emailExiste) {
                return { 
                    duplicado: true, 
                    campo: 'email',
                    mensagem: 'Este e-mail já está cadastrado no sistema!' 
                };
            }
            
            // Verifica CNPJ duplicado
            const cnpjExiste = empresas.find(e => 
                e.cnpj && e.cnpj.replace(/\D/g, '') === cnpjLimpo
            );
            if (cnpjExiste) {
                return { 
                    duplicado: true, 
                    campo: 'cnpj',
                    mensagem: 'Este CNPJ já está cadastrado no sistema!' 
                };
            }
            
            // Verifica telefone duplicado
            const telefoneExiste = empresas.find(e => 
                e.telefone && e.telefone.replace(/\D/g, '') === telefoneLimpo
            );
            if (telefoneExiste) {
                return { 
                    duplicado: true, 
                    campo: 'telefone',
                    mensagem: 'Este telefone já está cadastrado no sistema!' 
                };
            }
            
            console.log('✅ Nenhuma duplicata encontrada');
            return { duplicado: false };
            
        } catch (error) {
            console.error('❌ Erro ao verificar duplicatas:', error);
            throw error;
        }
    }

    // ========================================
    // CADASTRAR EMPRESA NA API
    // ========================================
    async function cadastrarEmpresa(dados) {
        try {
            console.log('📤 Enviando para:', `${API_URL}/enterprise`);
            console.log('📦 Dados:', dados);

            const response = await fetch(`${API_URL}/enterprise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dados)
            });

            const data = await response.json();
            console.log('📥 Resposta:', data);

            if (!response.ok) {
                return { success: false, error: data.error, status: response.status };
            }

            return { success: true, data };
        } catch (error) {
            console.error('❌ Erro na API:', error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // SUBMIT DO FORMULÁRIO
    // ========================================
    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Pega os valores
        const nomeEmpresa = document.getElementById('nomeEmpresa').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();
        const senha = document.getElementById('senha').value;

        // Remove erros anteriores
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('input-error');
        });

        // ========================================
        // VALIDAÇÕES FRONTEND
        // ========================================
        let erros = [];

        if (nomeEmpresa.length < 3) {
            erros.push('Nome da empresa muito curto');
            document.getElementById('nomeEmpresa').classList.add('input-error');
        }

        if (!validarEmail(email)) {
            erros.push('E-mail inválido');
            document.getElementById('email').classList.add('input-error');
        }

        if (telefone.replace(/\D/g, '').length < 10) {
            erros.push('Telefone inválido');
            document.getElementById('telefone').classList.add('input-error');
        }

        if (!validarCNPJ(cnpj)) {
            erros.push('CNPJ inválido');
            document.getElementById('cnpj').classList.add('input-error');
        }

        if (senha.length < 6) {
            erros.push('Senha deve ter no mínimo 6 caracteres');
            document.getElementById('senha').classList.add('input-error');
        }

        // Se houver erros, mostra notificação
        if (erros.length > 0) {
            mostrarNotificacao(erros[0], 'error');
            return;
        }

        // ========================================
        // FEEDBACK VISUAL NO BOTÃO
        // ========================================
        const btnCadastrar = formCadastro.querySelector('.btn-cadastrar');
        const textoOriginal = btnCadastrar.textContent;
        
        btnCadastrar.disabled = true;
        btnCadastrar.textContent = '⏳ Verificando...';

        try {
            // ========================================
            // VERIFICAR DUPLICATAS
            // ========================================
            const verificacao = await verificarDuplicatas(email, cnpj, telefone);
            
            if (verificacao.duplicado) {
                mostrarNotificacao(`❌ ${verificacao.mensagem}`, 'error');
                
                // Marca o campo com erro
                if (verificacao.campo === 'email') {
                    document.getElementById('email').classList.add('input-error');
                } else if (verificacao.campo === 'cnpj') {
                    document.getElementById('cnpj').classList.add('input-error');
                } else if (verificacao.campo === 'telefone') {
                    document.getElementById('telefone').classList.add('input-error');
                }
                
                btnCadastrar.textContent = textoOriginal;
                btnCadastrar.disabled = false;
                return;
            }

            // ========================================
            // PREPARAR DADOS PARA API (COMO STRING!)
            // ========================================
            btnCadastrar.textContent = '✓ Cadastrando...';
            
            const dadosAPI = {
                nome: nomeEmpresa,
                email: email,
                telefone: telefone.replace(/\D/g, ''), // Remove máscara, envia como STRING
                cnpj: cnpj.replace(/\D/g, ''),         // Remove máscara, envia como STRING
                senhaHash: senha
            };

            console.log('📋 Dados preparados:', dadosAPI);

            // ========================================
            // ENVIAR PARA API
            // ========================================
            const resultado = await cadastrarEmpresa(dadosAPI);

            // Restaura o botão
            btnCadastrar.textContent = textoOriginal;
            btnCadastrar.disabled = false;

            if (resultado.success) {
                console.log('✅ Cadastro realizado com sucesso!', resultado.data);
                
                mostrarNotificacao('✓ Cadastro realizado com sucesso! Redirecionando...', 'success');
                
                // Limpa o formulário
                formCadastro.reset();
                passwordStrength.classList.remove('show');
                
                // Remove classes de validação
                document.querySelectorAll('input').forEach(input => {
                    input.classList.remove('input-error');
                });
                
                // Redireciona após 2 segundos
                setTimeout(() => {
                    window.location.href = '../Login/index.html';
                }, 2000);
                
            } else {
                console.error('❌ Erro no cadastro:', resultado.error);
                mostrarNotificacao(`❌ Erro: ${resultado.error}`, 'error');
            }

        } catch (error) {
            console.error('❌ Erro:', error);
            mostrarNotificacao('❌ Erro ao processar cadastro. Verifique sua conexão.', 'error');
            btnCadastrar.textContent = textoOriginal;
            btnCadastrar.disabled = false;
        }
    });

    // ========================================
    // LINK DE LOGIN
    // ========================================
    if (linkLogin) {
        linkLogin.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../Login/index.html';
        });
    }

    console.log('🚀 SecureWay - Cadastro de Empresa carregado!');
    console.log('📡 API URL:', API_URL);
});