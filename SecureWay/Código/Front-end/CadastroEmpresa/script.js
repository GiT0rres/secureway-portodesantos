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

    // Indicador de força da senha
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

    // Função para mostrar notificação
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

    // Submit do formulário
    formCadastro.addEventListener('submit', function(e) {
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

        // Validações
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

        // Se tudo OK, cadastra
        console.log('✅ Cadastro realizado com sucesso!');
        console.log({
            nomeEmpresa,
            email,
            telefone,
            cnpj,
            senha: '***'
        });

        mostrarNotificacao('✓ Cadastro realizado com sucesso! Redirecionando...', 'success');

        // Redireciona após 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });

    // Link de Login
    linkLogin.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../Login/index.html';
    });

    console.log('🚀 SecureWay - Página de Cadastro Desktop carregada!');
});