// empresa-cadastro-integration.js
// Integração do cadastro de empresas - ADAPTADO PARA SUA API

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando integração de cadastro de empresa...');

  // Se já estiver logado, redireciona
  if (TokenManager.hasToken()) {
    console.log('ℹ️ Usuário já autenticado');
    const userType = localStorage.getItem('userType');
    if (userType === 'enterprise') {
      window.location.href = '../PerfilEmpresa/index.html';
      return;
    }
  }

  // Menu sidebar toggle
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    });
  }

  // Password strength indicator
  const senhaInput = document.getElementById('senha');
  const strengthBar = document.getElementById('strengthBar');

  if (senhaInput && strengthBar) {
    senhaInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const strength = calculatePasswordStrength(password);
      
      strengthBar.className = 'password-strength-bar';
      if (password.length > 0) {
        if (strength < 4) {
          strengthBar.classList.add('weak');
        } else if (strength < 7) {
          strengthBar.classList.add('medium');
        } else {
          strengthBar.classList.add('strong');
        }
      }
    });
  }

  function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength += 2;
    if (password.length >= 10) strength += 2;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 2;
    return strength;
  }

  // CNPJ mask
  const cnpjInput = document.getElementById('cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  // Phone mask
  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
      }
    });
  }

  // Form submission
  const form = document.getElementById('formCadastro');
  const toast = document.getElementById('toast');

  if (!form) {
    console.error('❌ Formulário não encontrado!');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Coleta dados do formulário
    const nome = document.getElementById('nomeEmpresa').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
    const senha = document.getElementById('senha').value;
    const cnpj = document.getElementById('cnpj').value.replace(/\D/g, '');

    console.log('📋 Dados coletados:', {
      nome,
      email,
      telefone,
      cnpj: cnpj.substring(0, 4) + '...',
      senhaLength: senha.length
    });

    // Validação
    if (!nome || !email || !telefone || !senha || !cnpj) {
      showToast('❌ Preencha todos os campos obrigatórios!', 'error');
      return;
    }

    if (cnpj.length !== 14) {
      showToast('❌ CNPJ inválido. Deve ter 14 dígitos.', 'error');
      return;
    }

    if (senha.length < 6) {
      showToast('❌ A senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      showToast('❌ E-mail inválido.', 'error');
      return;
    }

    // Pega o botão
    const btn = form.querySelector('.btn-cadastrar');

    try {
      // Mostra loading
      if (btn) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = '⏳ Cadastrando...';
      }

      console.log('📤 Enviando para /api/enterprise...');

      // Payload adaptado para sua API (telefone e cnpj como NUMBER)
      const payload = {
        nome: nome,
        email: email,
        telefone: parseInt(telefone), // ← CONVERTIDO PARA NUMBER
        senha: senha,
        cnpj: parseInt(cnpj)          // ← CONVERTIDO PARA NUMBER
      };

      console.log('📦 Payload:', { ...payload, senha: '***' });

      // Chama a API
      const response = await apiClient.post('/enterprise', payload);

      console.log('📥 Resposta:', response);

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Empresa cadastrada!');
        
        // Salva token se retornar
        if (response.data && response.data['access-token']) {
          TokenManager.setToken(response.data['access-token']);
          localStorage.setItem('userType', 'enterprise');
          
          if (response.data.enterprise) {
            localStorage.setItem('enterprise', JSON.stringify(response.data.enterprise));
          }
        }
        
        showToast('✅ Empresa cadastrada com sucesso!', 'success');

        // Limpa formulário
        form.reset();
        if (strengthBar) {
          strengthBar.className = 'password-strength-bar';
        }

        // Redireciona
        setTimeout(() => {
          // Vai para página de login de empresa
          window.location.href = '../LoginEmpresa/index.html';
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Erro no cadastro:', error);

      let errorMsg = 'Erro ao cadastrar empresa.';
      
      // Interpreta o erro
      if (error.message) {
        errorMsg = error.message;
      }
      
      if (error.status === 400) {
        if (errorMsg.includes('email')) {
          errorMsg = 'Email já cadastrado ou inválido';
        } else if (errorMsg.includes('cnpj')) {
          errorMsg = 'CNPJ já cadastrado ou inválido';
        } else if (errorMsg.includes('Validation')) {
          errorMsg = 'Dados inválidos. Verifique os campos.';
        } else {
          errorMsg = 'Dados inválidos';
        }
      } else if (error.status === 409) {
        errorMsg = 'Email ou CNPJ já cadastrado';
      }

      showToast(`❌ ${errorMsg}`, 'error');

      // Restaura botão
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || 'Criar Conta';
      }
    }
  });

  function showToast(message, type) {
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `notificacao-toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  console.log('✅ Integração carregada');
});