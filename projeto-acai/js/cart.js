/* ========================================
   CART.JS - Carrinho de Compras
   ======================================== */

// ========================================
// VARIÁVEIS DE ESTADO
// ========================================

let cart = [];
const CART_STORAGE_KEY = 'acaiPremiumCart';

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initCart();
});

/* ========================================
   INICIALIZAÇÃO DO CARRINHO
   ======================================== */

function initCart() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Update cart count on load
    updateCartCount();
}

/* ========================================
   ADICIONAR AO CARRINHO
   ======================================== */

/**
 * Adiciona produto ao carrinho
 */
function addToCart(product) {
    const cartItem = {
        id: product.id || generateId(),
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        image: product.image || 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=100&q=80',
        customizations: product.customizations || null
    };
    
    // Check if product already exists
    const existingIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        JSON.stringify(item.customizations) === JSON.stringify(cartItem.customizations)
    );
    
    if (existingIndex > -1) {
        cart[existingIndex].quantity++;
    } else {
        cart.push(cartItem);
    }
    
    saveCart();
    updateCartUI();
    
    // Show notification
    showNotification(`${cartItem.name} adicionado ao carrinho!`);
}

/**
 * Remove item do carrinho
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

/**
 * Atualiza quantidade de um item
 */
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    saveCart();
    updateCartUI();
}

/**
 * Limpa o carrinho
 */
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

/* ========================================
   ATUALIZAÇÃO DA UI
   ======================================== */

function updateCartUI() {
    updateCartCount();
    updateCartDropdown();
    updateCartTotal();
}

/**
 * Atualiza contador do carrinho
 */
function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
    
    // Animate
    if (totalItems > 0) {
        countEl.style.transform = 'scale(1.2)';
        setTimeout(() => {
            countEl.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Atualiza dropdown do carrinho
 */
function updateCartDropdown() {
    const cartItemsEl = document.getElementById('cartItems');
    if (!cartItemsEl) return;
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="cart-empty">
                <i class="ph-fill ph-shopping-cart"></i>
                <p>Carrinho vazio</p>
            </div>
        `;
        return;
    }
    
    cartItemsEl.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                <span class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                ${item.customizations ? `<div class="cart-item-custom">${item.customizations}</div>` : ''}
            </div>
            <div class="cart-item-actions">
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">
                    <i class="ph-bold ph-minus"></i>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">
                    <i class="ph-bold ph-plus"></i>
                </button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">
                <i class="ph-bold ph-trash"></i>
            </button>
        </div>
    `).join('');
}

/**
 * Atualiza total do carrinho
 */
function updateCartTotal() {
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalEl) {
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

/* ========================================
   CHECKOUT
   ======================================== */

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Carrinho vazio!', 'error');
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create WhatsApp message
    let message = '🫐 *PEDIDO - Açaí Premium*\n\n';
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name}\n`;
        message += `   Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
        if (item.customizations) {
            message += `   ${item.customizations}\n`;
        }
        message += `   Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📍 Entregar no endereço cadastrado`;
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after order
    clearCart();
    showNotification('Pedido enviado com sucesso!');
}

/* ========================================
   LOCAL STORAGE
   ======================================== */

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
            cart = JSON.parse(saved);
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        cart = [];
    }
}

/* ========================================
   NOTIFICAÇÕES
   ======================================== */

/**
 * Mostra notificação toast
 */
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <i class="ph-bold ph-${type === 'success' ? 'check-circle' : 'warning-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ========================================
   HELPERS
   ======================================== */

function generateId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Formata preço
 */
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

/**
 * Obtém carrinho atual
 */
function getCart() {
    return cart;
}

/**
 * Obtém total do carrinho
 */
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/* ========================================
   EXPORTAR FUNÇÕES
   ======================================== */

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.getCart = getCart;
window.getCartTotal = getCartTotal;
window.proceedToCheckout = proceedToCheckout;

// Add notification styles dynamically
const notificationStyles = `
    .notification-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--bg-medium);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-md) var(--spacing-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--text-white);
        font-weight: 500;
        z-index: 10001;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-lg);
    }
    
    .notification-toast.show {
        transform: translateX(0);
    }
    
    .notification-toast.success {
        border-color: var(--success);
    }
    
    .notification-toast.success i {
        color: var(--success);
    }
    
    .notification-toast.error {
        border-color: var(--error);
    }
    
    .notification-toast.error i {
        color: var(--error);
    }
    
    .cart-item-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }
    
    .qty-btn {
        width: 24px;
        height: 24px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-sm);
        color: var(--text-white);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        transition: var(--transition-fast);
    }
    
    .qty-btn:hover {
        background: var(--primary);
        border-color: var(--primary);
    }
    
    .qty-value {
        min-width: 24px;
        text-align: center;
        font-weight: 600;
    }
    
    .cart-item-custom {
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-top: 2px;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

