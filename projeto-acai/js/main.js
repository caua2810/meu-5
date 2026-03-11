/* ========================================
   AÇAÍ PREMIUM - main.js
   Funcionalidades Principais
   ======================================== */

// Menu Products Data
const menuProducts = [
    {
        id: 1,
        name: 'Açaí 300ml',
        description: 'Porção individual perfeita para matar a fome',
        price: 12.00,
        image: 'https://i.pinimg.com/736x/a5/cc/6b/a5cc6bc77c5d554e80620d77271a94c0.jpg',
        category: 'copos',
        badge: null
    },
    {
        id: 2,
        name: 'Açaí 500ml',
        description: 'O tamanho mais pedido, com bastante espaço para coberturas',
        price: 18.00,
        image: 'https://i.pinimg.com/736x/51/52/a2/5152a2d0d8be8ecca3661eb346e62a04.jpg',
        category: 'copos',
        badge: null
    },
    {
        id: 3,
        name: 'Açaí 700ml',
        description: 'Para quem quer muito açaí e coberturas',
        price: 25.00,
        image: 'https://i.pinimg.com/1200x/3a/0a/9a/3a0a9a5fd33e7885cc4a1d505ae41818.jpg',
        category: 'copos',
        badge: 'Mais Vendido'
    },
    {
        id: 4,
        name: 'Açaí Zero 500ml',
        description: 'Açaí sem açúcar adicionado e com bananas ',
        price: 20.00,
        image: 'https://i.pinimg.com/1200x/75/7f/95/757f9567e0a94b9726a4c8edfee025b0.jpg',
        category: 'zero',
        badge: 'Zero Açúcar'
    },
    {
        id: 5,
        name: 'Combo Açaí',
        description: 'Açaí 500ml + mais um que sai de graça  + bônus de cobertura',
        price: 22.00,
        image: 'https://i.pinimg.com/736x/cc/a3/8f/cca38f4b12db664c250bf25a3112b2c2.jpg',
        category: 'combos',
        badge: 'Combo'
    },
    {
        id: 6,
        name: 'Combo Família 1L',
        description: 'Perfeito para compartilhar em família ou com amigos',
        price: 45.00,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE6nrW3JfhZp3U2rSE8nDf-8zSA2gKuBDjfQ&s',
        category: 'combos',
        badge: 'Família'
    },
    {
        id: 7,
        name: 'Açaí na Tigela',
        description: 'A experiência completa com frutas e granola',
        price: 28.00,
        image: 'https://i.pinimg.com/1200x/b3/e0/a5/b3e0a5678eccd90997a85adb6bbcbbfc.jpg',
        category: 'bowls',
        badge: 'Premium'
    },
    {
        id: 8,
        name: 'Açaí com Frutas',
        description: 'Açaí cremoso acompanhado de frutas frescas selecionadas e com granola crocante',
        price: 26.00,
        image: 'https://i.pinimg.com/736x/c6/4d/e0/c64de099c26da30db2ef3d52676650da.jpg',
        category: 'bowls',
        badge: null
    },
    {
        id: 9,
        name: 'Açaí com Granola',
        description: 'Açaí com granola crocante e banana e mel ',
        price: 24.00,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_p2PWOMpNDMDo-363S-Kc64RPyZF_PjWgug&s',
        category: 'bowls',
        badge: null
    },
    {
        id: 10,
        name: 'Smoothie de Açaí',
        description: 'Bebida gelada e refrescante com açaí',
        price: 15.00,
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=400&h=400&fit=crop',
        category: 'bebidas',
        badge: null
    }
];

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.createElement('div');
cartOverlay.className = 'cart-overlay';

// Add overlay to body
document.body.appendChild(cartOverlay);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderMenuProducts('all');
    initScrollEffects();
    initMobileMenu();
    initCartEvents();
    initGSAPAnimations();
});

// Render Menu Products
function renderMenuProducts(filter) {
    const filteredProducts = filter === 'all' 
        ? menuProducts 
        : menuProducts.filter(product => product.category === filter);
    
    menuGrid.innerHTML = filteredProducts.map((product, index) => `
        <div class="menu-item" style="animation-delay: ${index * 0.1}s">
            <div class="menu-item-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="menu-item-badge ${product.category === 'zero' ? 'zero' : ''}">${product.badge}</span>` : ''}
            </div>
            <div class="menu-item-content">
                <h3 class="menu-item-title">${product.name}</h3>
                <p class="menu-item-description">${product.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button class="menu-item-btn" onclick="openRegisterModal('${product.name} - R$ ${product.price.toFixed(2).replace('.', ',')}')">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter Buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMenuProducts(btn.dataset.filter);
    });
});

// Scroll Effects
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        });
        
        cartOverlay.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            cartOverlay.classList.remove('active');
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                cartOverlay.classList.remove('active');
            });
        });
    }
}

// Cart Events
function initCartEvents() {
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
        
        if (cartClose) {
            cartClose.addEventListener('click', closeCart);
        }
        
        cartOverlay.addEventListener('click', closeCart);
    }
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
}

// GSAP Animations
function initGSAPAnimations() {
    if (typeof gsap !== 'undefined') {
        // Hero animations
        gsap.from('.hero-title', {
            duration: 1,
            y: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            delay: 0.3,
            ease: 'power3.out'
        });
        
        gsap.from('.hero-buttons', {
            duration: 0.8,
            y: 20,
            opacity: 0,
            delay: 0.6,
            ease: 'power3.out'
        });
        
        // Section animations
        gsap.from('.section-header', {
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%'
            },
            duration: 0.8,
            y: 30,
            opacity: 0,
            ease: 'power3.out'
        });
    }
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Open Register Modal (called from HTML)
function openRegisterModal(productInfo = '') {
    const modal = document.getElementById('registerModal');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductDetails = document.getElementById('modalProductDetails');
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (productInfo) {
            modalProductName.textContent = productInfo.split(' - ')[0];
            modalProductDetails.innerHTML = `
                <span>Preço: ${productInfo.split(' - ')[1] || ''}</span>
            `;
        } else {
            modalProductName.textContent = 'Açaí Premium';
        }
    }
}

// Update Cart Count
function updateCartCount(count) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

// Format Price
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
}

