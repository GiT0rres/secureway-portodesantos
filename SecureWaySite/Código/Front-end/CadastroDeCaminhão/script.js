// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos
    const formCadastro = document.getElementById('formCadastro');
    const btnHome = document.getElementById('btnHome');
    const placaInput = document.getElementById('placa');
    const navBtns = document.querySelectorAll('.nav-button');
    
    // Formatar placa automaticamente (ABC-1234 ou ABC1D234)
    if (placaInput) {
        placaInput.addEventListener('input', function(e) {
            let valor = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            
            if (valor.length > 3) {
                // Formato antigo: ABC-1234
                if (valor.length <= 7) {
                    valor = valor.substring(0, 3) + '-' + valor.substring(3);
                } else {
                    valor = valor.substring(0, 3) + '-' + valor.substring(3, 7);
                }
            }
            
            e.target.value = valor;
        });
    }
    
    // Envio do formulário
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const dados = {
                marca: document.getElementById('marca').value,
                modelo: document.getElementById('modelo').value,
                cor: document.getElementById('cor').value,
                placa: document.getElementById('placa').value,
                etiqueta: document.getElementById('etiqueta').value
            };
            
            // Log dos dados (aqui você pode enviar para um servidor)
            console.log('Dados do caminhão cadastrado:', dados);
            
            // Feedback visual
            const btnEnviar = formCadastro.querySelector('.btn-enviar');
            const textoOriginal = btnEnviar.textContent;
            
            btnEnviar.textContent = '✓ Enviado!';
            btnEnviar.style.background = 'rgba(93, 213, 213, 0.7)';
            
            // Limpa o formulário após 1.5 segundos
            setTimeout(() => {
                formCadastro.reset();
                btnEnviar.textContent = textoOriginal;
                btnEnviar.style.background = '';
                
                // Opcionalmente, redireciona para outra página
                // window.location.href = '../home/index.html';
            }, 1500);
        });
    }
    
    // Botão Home - volta para a página principal
    if (btnHome) {
        btnHome.addEventListener('click', function() {
            window.location.href = '../home/index.html';
        });
    }
    
    // Navegação inferior
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // O botão Home já tem seu próprio handler
            if (btn.id !== 'btnHome') {
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log('Navegação alterada:', index);
            }
        });
    });
    
    console.log('SecureWay - Cadastro carregado com sucesso!');
});