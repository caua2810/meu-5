// DADOS DOS SNEAKERS
const sneakers = [
    {
        id: 1,
        name: "Air Jordan 1 Retro High",
        brand: "Jordan",
        price: 1899.00,
        image: "https://i.pinimg.com/1200x/46/e9/87/46e9878151f23c277515aa567058345c.jpg",
        tag: "Mais Vendido",
        rating: 5,
        reviews: 234
    },
    {
        id: 2,
        name: "Yeezy Boost 350 V2",
        brand: "Yeezy",
        price: 1599.00,
        image: "https://i.pinimg.com/1200x/3b/f0/5b/3bf05b86a4c7423aa32d009e4b98d618.jpg",
        tag: "Edição Limitada",
        rating: 4,
        reviews: 189
    },
    {
        id: 3,
        name: "Dunk Low Retro",
        brand: "Nike",
        price: 899.00,
        image: "https://i.pinimg.com/1200x/ca/d2/82/cad28240cb2809bfaab373f91a1db13b.jpg",
        tag: "Novo",
        rating: 5,
        reviews: 567
    },
    {
        id: 4,
        name: "Air Force 1 '07",
        brand: "Nike",
        price: 799.00,
        image: "https://i.pinimg.com/1200x/ba/74/5a/ba745a552c35baee4be4200988d50788.jpg",
        tag: "Clássico",
        rating: 5,
        reviews: 892
    },
    {
        id: 5,
        name: "Jordan 4 Retro",
        brand: "Jordan",
        price: 2199.00,
        image: "https://i.pinimg.com/736x/2e/78/05/2e780574f17a4f10df6e89225afbcf6a.jpg",
        tag: "Colecionador",
        rating: 5,
        reviews: 145
    },
    {
        id: 6,
        name: "Yeezy Slide",
        brand: "Yeezy",
        price: 499.00,
        image: "https://i.pinimg.com/736x/29/dc/b2/29dcb21030baa9bf79bd28b6e0c915df.jpg",
        tag: "Conforto",
        rating: 4,
        reviews: 423
    },
    {
        id: 7,
        name: "New Balance 550",
        price: 699.00,
        image: "https://i.pinimg.com/736x/b0/0a/93/b00a93e63e62dc2194c2077fbb27a6b4.jpg",
        tag: "Tendência",
        rating: 4,
        reviews: 234
    },
    {
        id: 8,
        name: "Air Max 90",
        brand: "Nike",
        price: 749.00,
        image: "https://i.pinimg.com/1200x/35/e1/a1/35e1a1f505077c16bd45cf2efdf2e47e.jpg",
        tag: "Retro",
        rating: 4,
        reviews: 678
    }
];

// ESTADO GLOBAL
let currentUser = null;
let cart = [];
let users = JSON.parse(localStorage.getItem('kicks_users')) || [];
let passwords = JSON.parse(localStorage.getItem('kicks_passwords')) || {};
let demand = 1247;
let demandInterval = null;

// ADMIN CONFIG
const ADMIN_USER = 'adm';
const ADMIN_PASS = '281011';

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    if (currentUser) {
        enterStore();
    }
    
    // ADICIONAR EVENT LISTENERS AOS BOTÕES DE TAB
    setupTabButtons();
});

// CONFIGURAR BOTÕES DE TAB
function setupTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab') || (this.textContent.includes('Entrar') ? 'login' : 'register');
            showTab(tab);
        });
    });
}

// AUTENTICAÇÃO - CORRIGIDO
function showTab(tab) {
    // Remover active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(f => f.classList.remove('active'));
    
    // Adicionar active ao botão clicado
    const buttons = document.querySelectorAll('.tab-btn');
    if (tab === 'login') {
        buttons[0].classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else {
        buttons[1].classList.add('active');
        document.getElementById('register-form').classList.add('active');
    }
}

function doRegister() {
    const user = document.getElementById('reg-user').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const err = document.getElementById('reg-err');

    // LIMPAR ERRO ANTERIOR
    err.textContent = '';

    // VALIDAÇÕES
    if (!user || !email || !pass) {
        err.textContent = 'Preencha todos os campos!';
        return;
    }

    if (pass.length < 4) {
        err.textContent = 'A senha deve ter pelo menos 4 caracteres!';
        return;
    }

    // VERIFICAR SE USUÁRIO JÁ EXISTE
    if (users.find(u => u.username === user)) {
        err.textContent = 'Usuário já existe! Escolha outro nome.';
        return;
    }

    // VERIFICAR SE EMAIL JÁ EXISTE
    if (users.find(u => u.email === email)) {
        err.textContent = 'E-mail já cadastrado!';
        return;
    }

    // CRIAR NOVO USUÁRIO
    const newUser = { 
        username: user, 
        email: email, 
        isAdmin: false 
    };
    
    users.push(newUser);
    passwords[user] = pass;  // SALVAR SENHA INDIVIDUAL
    
    // SALVAR NO LOCALSTORAGE
    localStorage.setItem('kicks_users', JSON.stringify(users));
    localStorage.setItem('kicks_passwords', JSON.stringify(passwords));

    // LIMPAR CAMPOS
    document.getElementById('reg-user').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-pass').value = '';

    // MOSTRAR MENSAGEM DE SUCESSO E MUDAR PARA LOGIN
    alert('✅ Conta criada com sucesso! Faça login para continuar.');
    showTab('login');
}

function doLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const err = document.getElementById('login-err');

    // LIMPAR ERRO ANTERIOR
    err.textContent = '';

    if (!user || !pass) {
        err.textContent = 'Preencha todos os campos!';
        return;
    }

    // LOGIN ADMIN
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        currentUser = { 
            username: 'Administrador', 
            isAdmin: true 
        };
        saveSession();
        enterStore();
        return;
    }

    // LOGIN USUÁRIO NORMAL
    const found = users.find(u => u.username === user);
    
    if (!found) {
        err.textContent = 'Usuário não encontrado!';
        return;
    }

    if (passwords[user] !== pass) {
        err.textContent = 'Senha incorreta!';
        return;
    }

    // LOGIN BEM-SUCEDIDO
    currentUser = found;
    saveSession();
    enterStore();
}

function saveSession() {
    localStorage.setItem('kicks_current', JSON.stringify(currentUser));
}

function checkSession() {
    const saved = localStorage.getItem('kicks_current');
    if (saved) {
        currentUser = JSON.parse(saved);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('kicks_current');
    stopDemandSimulation();
    
    // MOSTRAR TELA DE LOGIN
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('main-store').classList.add('hidden');
    document.getElementById('admin-bar').classList.add('hidden');
    
    // LIMPAR CAMPOS DE LOGIN
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-err').textContent = '';
}

// ENTRAR NA LOJA
function enterStore() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-store').classList.remove('hidden');
    document.getElementById('welcome-user').textContent = currentUser.username;
    
    // MOSTRAR BARRA DE ADMIN SE FOR ADMIN
    if (currentUser.isAdmin) {
        document.getElementById('admin-bar').classList.remove('hidden');
        startDemandSimulation();
    }
    
    renderSneakers();
}

// DEMANDA AUTOMÁTICA (AUMENTA A CADA 10 SEGUNDOS)
function startDemandSimulation() {
    updateDemandDisplay();
    
    demandInterval = setInterval(() => {
        // Aumenta entre 5 e 25 pedidos a cada 10 segundos
        const increase = Math.floor(Math.random() * 21) + 5;
        demand += increase;
        updateDemandDisplay();
        
        // Atualiza no painel admin se estiver aberto
        const liveDemand = document.getElementById('live-demand');
        if (liveDemand) {
            liveDemand.textContent = demand.toLocaleString();
            animateChart();
        }
        
        console.log(`📈 Demanda aumentou em ${increase}. Total: ${demand}`);
    }, 10000); // 10 SEGUNDOS
}

function stopDemandSimulation() {
    if (demandInterval) {
        clearInterval(demandInterval);
        demandInterval = null;
    }
}

function updateDemandDisplay() {
    const display = document.getElementById('demand-counter');
    if (display) {
        display.textContent = demand.toLocaleString();
    }
}

function animateChart() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            const randomHeight = Math.floor(Math.random() * 60) + 40;
            bar.style.height = randomHeight + '%';
        }, index * 100);
    });
}

// RENDERIZAR PRODUTOS
function renderSneakers(list = sneakers) {
    const grid = document.getElementById('sneakers-grid');
    const noResults = document.getElementById('no-sneakers');
    
    if (list.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    
    grid.innerHTML = list.map(s => `
        <div class="sneaker-card" onclick="openProduct(${s.id})">
            <div class="sneaker-img">
                <img src="${s.image}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/250x180/ff4757/ffffff?text=${encodeURIComponent(s.name)}'">
                <span class="sneaker-tag">${s.tag}</span>
            </div>
            <div class="sneaker-info">
                <div class="sneaker-brand">${s.brand}</div>
                <h3 class="sneaker-name">${s.name}</h3>
                <div class="sneaker-price">R$ ${s.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <button class="sneaker-btn" onclick="event.stopPropagation(); addToCart(${s.id})">
                    <i class="fas fa-plus"></i> Adicionar
                </button>
            </div>
        </div>
    `).join('');
}

// FILTROS E BUSCA
function filterCategory(cat) {
    event.preventDefault();
    if (cat === 'all') {
        renderSneakers();
    } else {
        const filtered = sneakers.filter(s => s.brand.toLowerCase() === cat);
        renderSneakers(filtered);
    }
}

function searchSneakers() {
    const query = document.getElementById('search-sneakers').value.toLowerCase();
    const filtered = sneakers.filter(s => 
        s.name.toLowerCase().includes(query) || 
        s.brand.toLowerCase().includes(query)
    );
    renderSneakers(filtered);
}

function scrollToProducts() {
    document.getElementById('products-area').scrollIntoView({ behavior: 'smooth' });
}

// CARRINHO
function addToCart(id) {
    const item = sneakers.find(s => s.id === id);
    cart.push(item);
    updateCartBadge();
    
    // Animação no botão
    const btn = event.target.closest('.sneaker-btn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    btn.style.background = '#2ed573';
    
    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
    }, 1500);
}

function updateCartBadge() {
    document.getElementById('cart-badge').textContent = cart.length;
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    const list = document.getElementById('cart-items-list');
    
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:40px; color:#747d8c;"><i class="fas fa-shopping-bag" style="font-size:3em; display:block; margin-bottom:15px;"></i>Seu carrinho está vazio</p>';
    } else {
        list.innerHTML = cart.map((item, idx) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/70?text=SNK'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <button onclick="removeFromCart(${idx})" title="Remover item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total-price').textContent = 
        'R$ ' + total.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    
    modal.classList.remove('hidden');
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    updateCartBadge();
    openCart();
}

function closeCart() {
    document.getElementById('cart-modal').classList.add('hidden');
}

function finishOrder() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`🎉 Pedido finalizado com sucesso!\n\nTotal: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n\nObrigado por comprar na KicksCauã!`);
    cart = [];
    updateCartBadge();
    closeCart();
}

// MODAL PRODUTO
function openProduct(id) {
    const s = sneakers.find(x => x.id === id);
    const modal = document.getElementById('product-modal');
    const content = document.getElementById('product-detail-content');
    
    content.innerHTML = `
        <div class="product-detail">
            <div class="product-img-large">
                <img src="${s.image}" alt="${s.name}" onerror="this.src='https://via.placeholder.com/400/ff4757/ffffff?text=${encodeURIComponent(s.name)}'">
            </div>
            <div class="product-info-large">
                <div class="product-brand-large">${s.brand}</div>
                <h2>${s.name}</h2>
                <div class="product-price-large">R$ ${s.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                <p class="product-desc">Edição exclusiva disponível em quantidade limitada. Autenticidade garantida com certificado oficial. Envio para todo o Brasil.</p>
                <div class="size-selector">
                    <label>Selecione o tamanho:</label>
                    <select id="size-select">
                        <option value="">Escolha...</option>
                        <option value="38">38</option>
                        <option value="39">39</option>
                        <option value="40">40</option>
                        <option value="41">41</option>
                        <option value="42">42</option>
                        <option value="43">43</option>
                        <option value="44">44</option>
                    </select>
                </div>
                <button class="btn-main" onclick="addToCartFromModal(${s.id})">
                    <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function addToCartFromModal(id) {
    const size = document.getElementById('size-select').value;
    if (!size) {
        alert('Por favor, selecione um tamanho!');
        return;
    }
    addToCart(id);
    closeProductModal();
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// PAINEL ADMINISTRATIVO
function openAdminPanel() {
    document.getElementById('admin-panel-modal').classList.remove('hidden');
    updateAdminStats();
    switchAdminTab('demand');
}

function closeAdminPanel() {
    document.getElementById('admin-panel-modal').classList.add('hidden');
}

function updateAdminStats() {
    // Simular dados dinâmicos
    const sales = Math.floor(Math.random() * 50000) + 100000;
    const deliveries = Math.floor(Math.random() * 50) + 100;
    const investment = Math.floor(Math.random() * 100000) + 300000;
    const rating = (Math.random() * 0.5 + 4.5).toFixed(1);
    
    document.getElementById('stat-sales').textContent = 'R$ ' + sales.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('stat-deliveries').textContent = deliveries;
    document.getElementById('stat-investment').textContent = 'R$ ' + investment.toLocaleString('pt-BR', {minimumFractionDigits: 2});
    document.getElementById('stat-rating').textContent = rating;
    
    // Atualizar demanda em tempo real
    const liveDemand = document.getElementById('live-demand');
    if (liveDemand) {
        liveDemand.textContent = demand.toLocaleString();
    }
}

function switchAdminTab(tab) {
    // Remover active de todas as tabs
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    
    // Adicionar active na tab clicada
    const tabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    
    const tabIndex = {
        'demand': 0,
        'deliveries': 1,
        'comments': 2,
        'investment': 3
    };
    
    if (tabs[tabIndex[tab]]) {
        tabs[tabIndex[tab]].classList.add('active');
    }
    
    const content = document.getElementById(`tab-${tab}`);
    if (content) {
        content.classList.add('active');
    }
    
    // Carregar conteúdo específico
    if (tab === 'deliveries') loadDeliveries();
    if (tab === 'comments') loadComments();
}

function loadDeliveries() {
    const deliveries = [
        { id: '#4521', client: 'João Silva', status: 'delivered', date: '19/03/2026', total: 'R$ 1.899,00' },
        { id: '#4522', client: 'Maria Santos', status: 'transit', date: '19/03/2026', total: 'R$ 2.398,00' },
        { id: '#4523', client: 'Pedro Costa', status: 'pending', date: '20/03/2026', total: 'R$ 899,00' },
        { id: '#4524', client: 'Ana Paula', status: 'transit', date: '20/03/2026', total: 'R$ 3.098,00' },
        { id: '#4525', client: 'Lucas Mendes', status: 'delivered', date: '18/03/2026', total: 'R$ 1.598,00' },
        { id: '#4526', client: 'Fernanda Lima', status: 'delivered', date: '18/03/2026', total: 'R$ 799,00' }
    ];
    
    const statusClass = {
        delivered: 'status-delivered',
        transit: 'status-transit',
        pending: 'status-pending'
    };
    
    const statusText = {
        delivered: 'Entregue',
        transit: 'Em Trânsito',
        pending: 'Pendente'
    };
    
    document.getElementById('deliveries-list').innerHTML = deliveries.map(d => `
        <div class="list-item">
            <div>
                <strong>${d.id}</strong> - ${d.client}
                <div style="font-size:0.85em; color:#747d8c;">${d.date} • ${d.total}</div>
            </div>
            <span class="status-badge ${statusClass[d.status]}">${statusText[d.status]}</span>
        </div>
    `).join('');
}

function loadComments() {
    const comments = [
        { user: 'Carlos Eduardo', text: 'Tênis incrível, chegou super rápido! Recomendo demais.', rating: 5, product: 'Air Jordan 1' },
        { user: 'Fernanda Lima', text: 'Qualidade excelente, original mesmo. Voltarei a comprar!', rating: 5, product: 'Yeezy Boost 350' },
        { user: 'Bruno Gomes', text: 'Tamanho perfeito, muito confortável para o dia a dia.', rating: 4, product: 'Dunk Low' },
        { user: 'Rafael Souza', text: 'Embalagem premium, produto 100% original. Nota 10!', rating: 5, product: 'Air Force 1' },
        { user: 'Amanda Ribeiro', text: 'Demorou um pouco mas valeu a espera. Lindo demais!', rating: 4, product: 'Jordan 4' }
    ];
    
    document.getElementById('comments-list').innerHTML = comments.map(c => `
        <div class="list-item" style="flex-direction: column; align-items: flex-start; gap: 8px;">
            <div style="display: flex; justify-content: space-between; width: 100%;">
                <strong>${c.user}</strong>
                <span style="font-size: 0.85em; color: #747d8c;">${c.product}</span>
            </div>
            <div style="color: #ffa502; font-size: 1.1em;">${'★'.repeat(c.rating)}${'☆'.repeat(5-c.rating)}</div>
            <p style="color: #2f3542; line-height: 1.5;">"${c.text}"</p>
        </div>
    `).join('');
}

function openDeliveries() {
    openAdminPanel();
    setTimeout(() => switchAdminTab('deliveries'), 100);
}

function openComments() {
    openAdminPanel();
    setTimeout(() => switchAdminTab('comments'), 100);
}

// FECHAR MODAIS AO CLICAR FORA
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
}

// TECLA ESC PARA FECHAR MODAIS
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }
});// FRASES DE CARREGAMENTO (30 frases variadas)
const loadingPhrases = [
    "Inicializando sistema...",
    "Carregando produtos exclusivos...",
    "Preparando seu estilo...",
    "Conectando aos servidores...",
    "Verificando autenticidade dos sneakers...",
    "Organizando o estoque...",
    "Sincronizando dados...",
    "Carregando coleção limitada...",
    "Preparando as melhores ofertas...",
    "Otimizando sua experiência...",
    "Buscando lançamentos...",
    "Carregando imagens em alta resolução...",
    "Verificando disponibilidade de tamanhos...",
    "Atualizando preços...",
    "Preparando seu carrinho...",
    "Carregando avaliações de clientes...",
    "Sincronizando formas de pagamento...",
    "Calculando frete...",
    "Verificando cupons disponíveis...",
    "Carregando histórico de pedidos...",
    "Preparando recomendações...",
    "Atualizando tendências...",
    "Carregando drops exclusivos...",
    "Verificando autenticidade...",
    "Preparando envio expresso...",
    "Sincronizando com armazéns...",
    "Carregando novidades da semana...",
    "Verificando estoque em tempo real...",
    "Preparando sua jornada sneakerhead...",
    "Quase lá... Bem-vindo à KicksCauã!"
];

// FUNÇÃO DE LOGIN COM CARREGAMENTO
function doLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value;
    const err = document.getElementById('login-err');

    // LIMPAR ERRO ANTERIOR
    err.textContent = '';

    if (!user || !pass) {
        err.textContent = 'Preencha todos os campos!';
        return;
    }

    // VERIFICAR CREDENCIAIS PRIMEIRO
    let isValid = false;
    let isAdmin = false;

    // LOGIN ADMIN
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        isValid = true;
        isAdmin = true;
        currentUser = { username: 'Administrador', isAdmin: true };
    } else {
        // LOGIN USUÁRIO NORMAL
        const found = users.find(u => u.username === user);
        if (!found) {
            err.textContent = 'Usuário não encontrado!';
            return;
        }
        if (passwords[user] !== pass) {
            err.textContent = 'Senha incorreta!';
            return;
        }
        isValid = true;
        currentUser = found;
    }

    if (isValid) {
        // MOSTRAR TELA DE CARREGAMENTO
        showLoadingScreen();
        
        // INICIAR CARREGAMENTO DE 10 SEGUNDOS
        startLoadingAnimation(() => {
            // CALLBACK APÓS 10 SEGUNDOS
            saveSession();
            hideLoadingScreen();
            enterStore();
        });
    }
}

// MOSTRAR TELA DE CARREGAMENTO
function showLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('hidden');
    document.getElementById('auth-screen').classList.add('hidden');
}

// ESCONDER TELA DE CARREGAMENTO
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        loadingScreen.classList.remove('fade-out');
    }, 500);
}

// ANIMAÇÃO DE CARREGAMENTO (10 SEGUNDOS)
function startLoadingAnimation(callback) {
    const progressBar = document.getElementById('progress-bar');
    const percentageText = document.getElementById('loading-percentage');
    const textElement = document.getElementById('loading-text');
    
    let progress = 0;
    const duration = 10000; // 10 SEGUNDOS
    const interval = 100; // Atualizar a cada 100ms
    const increment = 100 / (duration / interval);
    
    let phraseIndex = 0;
    
    // MUDAR FRASE A CADA 333ms (aproximadamente 30 frases em 10s)
    const phraseInterval = setInterval(() => {
        if (phraseIndex < loadingPhrases.length) {
            textElement.textContent = loadingPhrases[phraseIndex];
            textElement.style.animation = 'none';
            setTimeout(() => {
                textElement.style.animation = 'textGlow 2s ease-in-out infinite';
            }, 10);
            phraseIndex++;
        }
    }, 333);

    // ANIMAÇÃO DA BARRA DE PROGRESSO
    const progressInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            clearInterval(phraseInterval);
            
            // ÚLTIMA FRASE
            textElement.textContent = "Pronto! Redirecionando...";
            
            // AGUARDAR UM POUCO E CHAMAR CALLBACK
            setTimeout(() => {
                if (callback) callback();
            }, 500);
        }
        
        // ATUALIZAR UI
        progressBar.style.width = progress + '%';
        percentageText.textContent = Math.floor(progress) + '%';
        
        // MUDAR COR DO PERCENTUAL BASEADO NO PROGRESSO
        if (progress < 30) {
            percentageText.style.color = '#ff4757';
        } else if (progress < 70) {
            percentageText.style.color = '#ffa502';
        } else {
            percentageText.style.color = '#2ed573';
        }
        
    }, interval);
}

// FUNÇÃO DE REGISTRO TAMBÉM COM CARREGAMENTO
function doRegister() {
    const user = document.getElementById('reg-user').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const err = document.getElementById('reg-err');

    // LIMPAR ERRO ANTERIOR
    err.textContent = '';

    // VALIDAÇÕES
    if (!user || !email || !pass) {
        err.textContent = 'Preencha todos os campos!';
        return;
    }

    if (pass.length < 4) {
        err.textContent = 'A senha deve ter pelo menos 4 caracteres!';
        return;
    }

    if (users.find(u => u.username === user)) {
        err.textContent = 'Usuário já existe! Escolha outro nome.';
        return;
    }

    if (users.find(u => u.email === email)) {
        err.textContent = 'E-mail já cadastrado!';
        return;
    }

    // CRIAR NOVO USUÁRIO
    const newUser = { 
        username: user, 
        email: email, 
        isAdmin: false 
    };
    
    users.push(newUser);
    passwords[user] = pass;
    
    // SALVAR NO LOCALSTORAGE
    localStorage.setItem('kicks_users', JSON.stringify(users));
    localStorage.setItem('kicks_passwords', JSON.stringify(passwords));

    // LIMPAR CAMPOS
    document.getElementById('reg-user').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-pass').value = '';

    // MOSTRAR TELA DE CARREGAMENTO PARA REGISTRO TAMBÉM
    showLoadingScreen();
    
    // FRASES ESPECÍFICAS PARA REGISTRO
    const registerPhrases = [
        "Criando sua conta...",
        "Verificando disponibilidade do usuário...",
        "Criptografando sua senha...",
        "Salvando seus dados...",
        "Preparando seu perfil...",
        "Configurando preferências...",
        "Quase pronto...",
        "Bem-vindo à KicksCauã!"
    ];
    
    // SUBSTITUIR FRASES TEMPORARIAMENTE
    const originalPhrases = [...loadingPhrases];
    for (let i = 0; i < registerPhrases.length; i++) {
        loadingPhrases[i] = registerPhrases[i];
    }
    
    startLoadingAnimation(() => {
        // RESTAURAR FRASES ORIGINAIS
        for (let i = 0; i < originalPhrases.length; i++) {
            loadingPhrases[i] = originalPhrases[i];
        }
        
        currentUser = newUser;
        saveSession();
        hideLoadingScreen();
        enterStore();
        alert(`🎉 Bem-vindo, ${user}! Sua conta foi criada com sucesso!`);
    });
}