/* ========================================
   MODAL.JS - Controle dos Modais
   ======================================== */

// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let currentProduct = {
    name: null,
    price: null,
    id: null
};

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initModal();
    initOrderButtons();
    initAuthToggle();
});

/* ========================================
   MODAL PRINCIPAL
   ======================================== */

function initModal() {
    const overlay = document.getElementById('modalOverlay');
    const container = document.getElementById('modalContainer');
    const closeBtn = document.getElementById('modalClose');
    
    if (!overlay) return;
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Click outside to close
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Focus trap
    if (container) {
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                trapFocus(e, container);
            }
        });
    }
}

/**
 * Abre o modal de cadastro/login
 */
function openModal(productName = null, productPrice = null, productId = null) {
    const overlay = document.getElementById('modalOverlay');
    const productNameEl = document.getElementById('modalProductName');
    const productPriceEl = document.getElementById('modalProductPrice');
    const successMessage = document.getElementById('successMessage');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    // Store product info
    currentProduct = {
        name: productName || 'Açaí Personalizado',
        price: productPrice || '18,00',
        id: productId || 'custom'
    };
    
    // Update product info in modal
    if (productNameEl) productNameEl.textContent = currentProduct.name;
    if (productPriceEl) productPriceEl.textContent = `R$ ${currentProduct.price}`;
    
    // Reset forms
    if (registerForm) registerForm.reset();
    if (loginForm) loginForm.reset();
    
    // Hide success message, show forms
    if (successMessage) successMessage.classList.add('hidden');
    if (registerForm) registerForm.classList.remove('hidden');
    if (loginForm) loginForm.classList.add('hidden');
    
    // Show modal
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        const firstInput = overlay.querySelector('input:not([type="hidden"])');
        if (firstInput) firstInput.focus();
    }, 300);
}

/**
 * Fecha o modal
 */
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear product info
    currentProduct = { name: null, price: null, id: null };
}

/**
 * Focus trap for accessibility
 */
function trapFocus(e, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.shiftKey) {
        if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

/* ========================================
   BOTÕES DE PEDIDO
   ======================================== */

function initOrderButtons() {
    // Header order button
    const headerOrderBtn = document.getElementById('headerOrderBtn');
    if (headerOrderBtn) {
        headerOrderBtn.addEventListener('click', () => {
            openModal('Açaí 500ml', '18,00', 'acai-500');
        });
    }
    
    // Hero order button
    const heroOrderBtn = document.getElementById('heroOrderBtn');
    if (heroOrderBtn) {
        heroOrderBtn.addEventListener('click', () => {
            openModal('Açaí 500ml', '18,00', 'acai-500');
        });
    }
    
    // Final CTA button
    const finalOrderBtn = document.getElementById('finalOrderBtn');
    if (finalOrderBtn) {
        finalOrderBtn.addEventListener('click', () => {
            openModal('Açaí 500ml', '18,00', 'acai-500');
        });
    }
    
    // Product buttons (handled by main.js, but we ensure they work here too)
    document.querySelectorAll('.product-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = btn.dataset.name || 'Açaí Personalizado';
            const price = btn.dataset.price || '18,00';
            const id = btn.dataset.product || 'custom';
            openModal(name, price, id);
        });
    });
}

/* ========================================
   TOGGLE LOGIN/CADASTRO
   ======================================== */

function initAuthToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    
    if (!toggleButtons.length) return;
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const form = btn.dataset.form;
            
            // Update toggle buttons
            toggleButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide forms
            if (form === 'register') {
                registerForm?.classList.remove('hidden');
                loginForm?.classList.add('hidden');
                if (modalTitle) modalTitle.textContent = 'Criar Conta';
                if (modalSubtitle) modalSubtitle.textContent = 'Preencha seus dados para continuar';
            } else {
                registerForm?.classList.add('hidden');
                loginForm?.classList.remove('hidden');
                if (modalTitle) modalTitle.textContent = 'Entrar';
                if (modalSubtitle) modalSubtitle.textContent = 'Faça login para continuar';
            }
        });
    });
}

/* ========================================
   FORMULÁRIO DE CADASTRO
   ======================================== */

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    
    // Register form submit
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate form
            if (!validateRegisterForm()) {
                return;
            }
            
            // Show loading
            const submitBtn = registerForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Cadastrando...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            registerForm.classList.add('hidden');
            if (successMessage) successMessage.classList.remove('hidden');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Add to cart
            if (typeof addToCart === 'function') {
                addToCart(currentProduct);
            }
        });
    }
    
    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading
            const submitBtn = loginForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner"></span> Entrando...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success
            loginForm.classList.add('hidden');
            if (successMessage) successMessage.classList.remove('hidden');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Add to cart
            if (typeof addToCart === 'function') {
                addToCart(currentProduct);
            }
        });
    }
    
    // Close success button
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', closeModal);
    }
});

/**
 * Valida o formulário de cadastro
 */
function validateRegisterForm() {
    let isValid = true;
    
    // Required fields
    const requiredFields = [
        { id: 'fullName', name: 'Nome' },
        { id: 'email', name: 'Email' },
        { id: 'phone', name: 'Telefone' },
        { id: 'cpf', name: 'CPF' },
        { id: 'cep', name: 'CEP' },
        { id: 'address', name: 'Endereço' },
        { id: 'number', name: 'Número' },
        { id: 'neighborhood', name: 'Bairro' },
        { id: 'city', name: 'Cidade' },
        { id: 'password', name: 'Senha' }
    ];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const wrapper = input?.closest('.input-wrapper');
        
        if (input && !input.value.trim()) {
            showError(field.id, `${field.name} é obrigatório`);
            wrapper?.classList.add('input-error');
            wrapper?.classList.remove('input-success');
            isValid = false;
        } else if (input && input.value.trim()) {
            wrapper?.classList.remove('input-error');
            wrapper?.classList.add('input-success');
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError('email', 'Email inválido');
            isValid = false;
        }
    }
    
    // CPF validation
    const cpf = document.getElementById('cpf');
    if (cpf && cpf.value) {
        if (!validateCPF(cpf.value)) {
            showError('cpf', 'CPF inválido');
            isValid = false;
        }
    }
    
    // Password validation
    const password = document.getElementById('password');
    if (password && password.value.length < 6) {
        showError('password', 'Senha deve ter pelo menos 6 caracteres');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Valida CPF
 */
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Check for known invalid CPFs
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validate digits
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    if (parseInt(cpf.charAt(9)) !== digit1) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return parseInt(cpf.charAt(10)) === digit2;
}

/**
 * Mostra mensagem de erro
 */
function showError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (errorEl) {
        errorEl.textContent = message;
    }
}

/**
 * Limpa mensagem de erro
 */
function clearError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    if (errorEl) {
        errorEl.textContent = '';
    }
}

/* ========================================
   EXPORTAR FUNÇÕES
   ======================================== */

window.openModal = openModal;
window.closeModal = closeModal;

