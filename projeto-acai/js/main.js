/* ========================================
   MAIN.JS - Script Principal
   ======================================== */

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa GSAP
    initGSAP();
    
    // Inicializa componentes
    initHeader();
    initParticles();
    initSmoothScroll();
    initGallery();
    initTestimonials();
    initCategoryFilters();
    initProductCards();
    initBackToTop();
});

/* ========================================
   GSAP ANIMATIONS
   ======================================== */

function initGSAP() {
    // Registra ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animações de entrada das seções
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Animações dos cards de produtos
    gsap.utils.toArray('.products-grid').forEach(grid => {
        gsap.from(grid.children, {
            scrollTrigger: {
                trigger: grid,
                start: 'top 80%'
            },
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power3.out'
        });
    });
    
    // Animações da galeria
    gsap.utils.toArray('.gallery-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'back.out(1.7)'
        });
    });
}

/* ========================================
   HEADER
   ======================================== */

function initHeader() {
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    const cartDropdown = document.getElementById('cartDropdown');
    const cartClose = document.getElementById('cartClose');
    
    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartDropdown.classList.toggle('active');
        });
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartDropdown.classList.remove('active');
            });
        }
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartDropdown.contains(e.target) && e.target !== cartBtn) {
                cartDropdown.classList.remove('active');
            }
        });
    }
}

/* ========================================
   PARTÍCULAS FLUTUANTES
   ======================================== */

function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    const colors = ['#4B0082', '#8B00FF', '#FFD700', '#6A0DAD'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   GALERIA / LIGHTBOX
   ======================================== */

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (!galleryItems.length || !lightbox) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img && lightboxImg) {
                lightboxImg.src = img.src.replace('w=400', 'w=1200').replace('w=600', 'w=1200');
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/* ========================================
   DEPOIMENTOS / CARROSSEL
   ======================================== */

function initTestimonials() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!track || !dots.length) return;
    
    let currentIndex = 0;
    let autoplayInterval;
    const cardWidth = 380; // card width + gap
    const totalCards = track.children.length;
    const maxIndex = Math.max(0, totalCards - 1);
    
    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        gsap.to(track, {
            x: -currentIndex * cardWidth,
            duration: 0.5,
            ease: 'power2.out'
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    function nextSlide() {
        goToSlide((currentIndex + 1) % totalCards);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(index);
            startAutoplay();
        });
    });
    
    // Pause on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                goToSlide(Math.min(currentIndex + 1, maxIndex));
            } else {
                goToSlide(Math.max(currentIndex - 1, 0));
            }
        }
    }
    
    // Start autoplay
    startAutoplay();
}

/* ========================================
   FILTROS DE CATEGORIA
   ======================================== */

function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!filterButtons.length || !productsGrid) return;
    
    const productCards = productsGrid.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // Filter products
            productCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        display: 'block'
                    });
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

/* ========================================
   PRODUCT CARDS
   ======================================== */

function initProductCards() {
    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productName = button.dataset.name || 'Açaí Personalizado';
            const productPrice = button.dataset.price || '18.00';
            const productId = button.dataset.product || 'custom';
            
            // Open modal with product info
            if (typeof openModal === 'function') {
                openModal(productName, productPrice, productId);
            }
        });
    });
}

/* ========================================
   BACK TO TOP
   ======================================== */

function initBackToTop() {
    // Create back to top button
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="ph-bold ph-arrow-up"></i>';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    document.body.appendChild(btn);
    
    // Show/hide button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    // Scroll to top
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   EXPORTAR FUNÇÕES GLOBAIS
   ======================================== */

// Função para abrir modal de pedido (chamada por outros scripts)
window.openOrderModal = function(productName = null, productPrice = null, productId = null) {
    if (typeof openModal === 'function') {
        openModal(productName, productPrice, productId);
    }
};

