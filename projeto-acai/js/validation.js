/* ========================================
   VALIDATION.JS - Validação de Formulários
   ======================================== */

// ========================================
// MÁSCARAS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initMasks();
    initRealTimeValidation();
});

/* ========================================
   MÁSCARAS DE INPUT
   ======================================== */

function initMasks() {
    // CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            e.target.value = maskCPF(e.target.value);
        });
        cpfInput.addEventListener('blur', (e) => {
            validateField(e.target, 'cpf');
        });
    }
    
    // Telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = maskPhone(e.target.value);
        });
    }
    
    // CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', (e) => {
            e.target.value = maskCEP(e.target.value);
        });
        cepInput.addEventListener('blur', (e) => {
            if (e.target.value.length === 9) {
                searchCEP(e.target.value);
            }
        });
        
        // CEP search button
        const cepSearch = document.getElementById('cepSearch');
        if (cepSearch) {
            cepSearch.addEventListener('click', () => {
                const cep = cepInput.value;
                if (cep.length === 9) {
                    searchCEP(cep);
                }
            });
        }
    }
}

/**
 * Máscara de CPF
 */
function maskCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .slice(0, 14);
}

/**
 * Máscara de Telefone
 */
function maskPhone(value) {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length <= 10) {
        // (00) 0000-0000
        return cleaned
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 14);
    } else {
        // (00) 00000-0000
        return cleaned
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
    }
}

/**
 * Máscara de CEP
 */
function maskCEP(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
}

/* ========================================
   VALIDAÇÃO EM TEMPO REAL
   ======================================== */

function initRealTimeValidation() {
    // Email
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', (e) => {
            validateField(e.target, 'email');
        });
        emailInput.addEventListener('input', (e) => {
            clearError('email');
        });
    }
    
    // Password
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            validatePassword(e.target.value);
        });
    }
    
    // Toggle password visibility
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            
            const icon = passwordToggle.querySelector('i');
            if (icon) {
                icon.className = type === 'password' ? 'ph-bold ph-eye' : 'ph-bold ph-eye-slash';
            }
        });
    }
}

/**
 * Valida um campo específico
 */
function validateField(input, type) {
    const value = input.value.trim();
    const wrapper = input.closest('.input-wrapper');
    
    switch (type) {
        case 'email':
            if (!value) {
                showFieldError('email', 'Email é obrigatório');
                return false;
            }
            if (!isValidEmail(value)) {
                showFieldError('email', 'Email inválido');
                return false;
            }
            showFieldSuccess('email');
            return true;
            
        case 'cpf':
            if (!value) {
                showFieldError('cpf', 'CPF é obrigatório');
                return false;
            }
            if (!validateCPF(value)) {
                showFieldError('cpf', 'CPF inválido');
                return false;
            }
            showFieldSuccess('cpf');
            return true;
            
        case 'phone':
            if (!value) {
                showFieldError('phone', 'Telefone é obrigatório');
                return false;
            }
            if (value.replace(/\D/g, '').length < 10) {
                showFieldError('phone', 'Telefone inválido');
                return false;
            }
            showFieldSuccess('phone');
            return true;
            
        case 'cep':
            if (!value) {
                showFieldError('cep', 'CEP é obrigatório');
                return false;
            }
            if (value.replace(/\D/g, '').length !== 8) {
                showFieldError('cep', 'CEP inválido');
                return false;
            }
            showFieldSuccess('cep');
            return true;
            
        default:
            return true;
    }
}

/**
 * Valida email
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida CPF
 */
function validateCPF(cpf) {
    // Remove non-digits
    cpf = cpf.replace(/\D/g, '');
    
    // Check length
    if (cpf.length !== 11) {
        return false;
    }
    
    // Check for known invalid CPFs
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Validate first digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    if (parseInt(cpf.charAt(9)) !== digit1) {
        return false;
    }
    
    // Validate second digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return parseInt(cpf.charAt(10)) === digit2;
}

/**
 * Valida senha
 */
function validatePassword(password) {
    const errorEl = document.getElementById('passwordError');
    
    if (password.length === 0) {
        showFieldError('password', 'Senha é obrigatória');
        return false;
    }
    
    if (password.length < 6) {
        showFieldError('password', 'Senha deve ter pelo menos 6 caracteres');
        return false;
    }
    
    clearFieldError('password');
    showFieldSuccess('password');
    return true;
}

/* ========================================
   BUSCA DE ENDEREÇO VIA CEP (ViaCEP API)
   ======================================== */

/**
 * Busca endereço pelo CEP
 */
async function searchCEP(cep) {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
        showFieldError('cep', 'CEP inválido');
        return;
    }
    
    // Show loading
    const cepInput = document.getElementById('cep');
    const cepSearch = document.getElementById('cepSearch');
    
    if (cepSearch) {
        cepSearch.disabled = true;
        cepSearch.innerHTML = '<i class="ph-bold ph-spinner ph-spin"></i>';
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showFieldError('cep', 'CEP não encontrado');
            return;
        }
        
        // Fill address fields
        const addressInput = document.getElementById('address');
        const neighborhoodInput = document.getElementById('neighborhood');
        const cityInput = document.getElementById('city');
        
        if (addressInput && data.logradouro) {
            addressInput.value = data.logradouro;
            showFieldSuccess('address');
        }
        
        if (neighborhoodInput && data.bairro) {
            neighborhoodInput.value = data.bairro;
            showFieldSuccess('neighborhood');
        }
        
        if (cityInput && data.localidade) {
            cityInput.value = `${data.localidade} - ${data.uf}`;
            showFieldSuccess('city');
        }
        
        clearError('cep');
        
        // Focus on number field
        const numberInput = document.getElementById('number');
        if (numberInput) {
            numberInput.focus();
        }
        
    } catch (error) {
        console.error('Error fetching CEP:', error);
        showFieldError('cep', 'Erro ao buscar CEP. Tente novamente.');
    } finally {
        // Reset button
        if (cepSearch) {
            cepSearch.disabled = false;
            cepSearch.innerHTML = '<i class="ph-bold ph-magnifying-glass"></i>';
        }
    }
}

/* ========================================
   HELPERS DE VALIDAÇÃO
   ======================================== */

/**
 * Mostra erro no campo
 */
function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const wrapper = input?.closest('.input-wrapper');
    const errorEl = document.getElementById(`${fieldId}Error`);
    
    if (input) {
        input.classList.add('error');
        input.classList.remove('success');
    }
    
    if (wrapper) {
        wrapper.classList.add('input-error');
        wrapper.classList.remove('input-success');
    }
    
    if (errorEl) {
        errorEl.textContent = message;
    }
}

/**
 * Mostra sucesso no campo
 */
function showFieldSuccess(fieldId) {
    const input = document.getElementById(fieldId);
    const wrapper = input?.closest('.input-wrapper');
    const errorEl = document.getElementById(`${fieldId}Error`);
    
    if (input) {
        input.classList.remove('error');
        input.classList.add('success');
    }
    
    if (wrapper) {
        wrapper.classList.remove('input-error');
        wrapper.classList.add('input-success');
    }
    
    if (errorEl) {
        errorEl.textContent = '';
    }
}

/**
 * Limpa erro do campo
 */
function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const wrapper = input?.closest('.input-wrapper');
    const errorEl = document.getElementById(`${fieldId}Error`);
    
    if (input) {
        input.classList.remove('error', 'success');
    }
    
    if (wrapper) {
        wrapper.classList.remove('input-error', 'input-success');
    }
    
    if (errorEl) {
        errorEl.textContent = '';
    }
}

/**
 * Limpa mensagem de erro genérica
 */
function clearError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

/* ========================================
   VALIDAÇÃO COMPLETA DO FORMULÁRIO
   ======================================== */

/**
 * Valida todo o formulário de cadastro
 */
function validateForm() {
    const fields = [
        { id: 'fullName', name: 'Nome completo', required: true },
        { id: 'email', name: 'Email', required: true, type: 'email' },
        { id: 'phone', name: 'Telefone', required: true, type: 'phone' },
        { id: 'cpf', name: 'CPF', required: true, type: 'cpf' },
        { id: 'cep', name: 'CEP', required: true, type: 'cep' },
        { id: 'address', name: 'Endereço', required: true },
        { id: 'number', name: 'Número', required: true },
        { id: 'neighborhood', name: 'Bairro', required: true },
        { id: 'city', name: 'Cidade', required: true },
        { id: 'password', name: 'Senha', required: true, type: 'password' }
    ];
    
    let isValid = true;
    
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input) return;
        
        const value = input.value.trim();
        
        // Check required
        if (field.required && !value) {
            showFieldError(field.id, `${field.name} é obrigatório`);
            isValid = false;
            return;
        }
        
        // Check type
        if (value) {
            switch (field.type) {
                case 'email':
                    if (!isValidEmail(value)) {
                        showFieldError(field.id, `${field.name} inválido`);
                        isValid = false;
                    } else {
                        showFieldSuccess(field.id);
                    }
                    break;
                    
                case 'cpf':
                    if (!validateCPF(value)) {
                        showFieldError(field.id, `${field.name} inválido`);
                        isValid = false;
                    } else {
                        showFieldSuccess(field.id);
                    }
                    break;
                    
                case 'phone':
                    if (value.replace(/\D/g, '').length < 10) {
                        showFieldError(field.id, `${field.name} inválido`);
                        isValid = false;
                    } else {
                        showFieldSuccess(field.id);
                    }
                    break;
                    
                case 'cep':
                    if (value.replace(/\D/g, '').length !== 8) {
                        showFieldError(field.id, `${field.name} inválido`);
                        isValid = false;
                    } else {
                        showFieldSuccess(field.id);
                    }
                    break;
                    
                case 'password':
                    if (value.length < 6) {
                        showFieldError(field.id, 'Senha deve ter pelo menos 6 caracteres');
                        isValid = false;
                    } else {
                        showFieldSuccess(field.id);
                    }
                    break;
                    
                default:
                    showFieldSuccess(field.id);
            }
        }
    });
    
    return isValid;
}

/* ========================================
   EXPORTAR FUNÇÕES
   ======================================== */

window.validateForm = validateForm;
window.validateCPF = validateCPF;
window.isValidEmail = isValidEmail;
window.maskCPF = maskCPF;
window.maskPhone = maskPhone;
window.maskCEP = maskCEP;
window.searchCEP = searchCEP;

