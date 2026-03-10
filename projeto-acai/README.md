# 🍇 Açaí Premium - Landing Page

Landing page premium 100% funcional para uma loja de açaí, desenvolvida com HTML5, CSS3 e JavaScript Vanilla.

![Açaí Premium](https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80)

## ✨ Funcionalidades

### 🎯 Sistema de Cadastro/Login
- Modal interativo com validação em tempo real
- Campos: Nome, Email, Telefone, CPF, Endereço, CEP
- Más Telefone e CEP
- Busca automática de endereço via APIcaras para CPF, ViaCEP
- Toggle entre criar conta e login
- Feedback visual com bordas coloridas

### 🥣 Configurador de Açaí
- Seletor de tamanho (300ml, 500ml, 700ml)
- Escolha de sabor base (Tradicional, Guaraná, Zero Açúcar)
- Grid de coberturas com preços
- Preview visual do copo
- Preço em tempo real
- Limite de coberturas por tamanho
- LocalStorage para persistência

### 📋 Cardápio
- 8 produtos variados
- Filtros por categoria
- Cards com glassmorphism
- Badges de destaque

### 🛒 Carrinho
- Dropdown com itens
- Quantidade ajustável
- Cálculo automático de total
- Integração com WhatsApp para pedidos

### 📱 Design Responsivo
- Mobile-first
- Breakpoints: 320px, 768px, 1024px, 1440px
- Menu hamburger mobile
- Touch-friendly

### 🎨 Design System
- Tema roxo escuro premium
- Cores: Roxo Açaí (#4B0082), Roxo Vibrante (#8B00FF), Dourado (#FFD700)
- Tipografia: Poppins, Inter, Roboto Mono
- Efeitos: Glassmorphism, glows, partículas

## 📁 Estrutura de Arquivos

```
projeto-acai/
├── index.html              # Página principal
├── html/
│   ├── cadastro.html       # Página de cadastro
│   ├── cardapio.html      # Cardápio completo
│   └── sobre.html         # Sobre nós
├── css/
│   ├── style.css          # Estilos principais
│   ├── modal.css          # Estilos dos modais
│   ├── configurator.css   # Configurador de açaí
│   └── responsive.css    # Media queries
├── js/
│   ├── main.js            # Script principal
│   ├── modal.js           # Controle de modais
│   ├── configurator.js   # Lógica do configurador
│   ├── validation.js      # Validação de formulários
│   └── cart.js           # Carrinho de compras
├── assets/
│   ├── images/           # Imagens
│   └── icons/            # Ícones
└── README.md             # Este arquivo
```

## 🚀 Como Executar

1. Clone ou baixe este repositório
2. Navegue até a pasta `projeto-acai`
3. Abra o arquivo `index.html` no seu navegador

```bash
# Ou use um servidor local
npx serve projeto-acai
# ou
cd projeto-acai && python -m http.server 8000
```

## 🔧 Tecnologias

- **HTML5** - Semântica e estrutura
- **CSS3** - Estilização moderna com variáveis
- **JavaScript Vanilla** - Sem frameworks
- **GSAP** - Animações (via CDN)
- **Phosphor Icons** - Ícones (via CDN)
- **Font Awesome** - Ícones (via CDN)
- **ViaCEP API** - Busca de endereço

## 📱 Compatibilidade

- Chrome/Edge (últimas versões)
- Firefox (últimas versões)
- Safari (últimas versões)
- Mobile: iOS Safari, Chrome Android

## 🎨 Capturas de Tela

### Hero Section
- Vídeo/imagem parallax de fundo
- Título "AÇAÍ PREMIUM"
- Botões de CTA com animações

### Cardápio
- Grid responsivo de produtos
- Filtros por categoria
- Cards com hover effects

### Configurador
- Passo a passo interativo
- Preview visual do copo
- Preço em tempo real

### Modal de Cadastro
- Formulário completo
- Validação em tempo real
- Busca de CEP automática

## 📄 Licença

Este projeto é apenas para fins educacionais.

---

Desenvolvido com ❤️ e muito açaí!

