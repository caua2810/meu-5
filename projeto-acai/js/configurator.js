/* ========================================
   CONFIGURATOR.JS - Lógica do Monte Seu Açaí
   ======================================== */

// ========================================
// VARIÁVEIS DE ESTADO
// ========================================

const configuratorState = {
    currentStep: 1,
    totalSteps: 4,
    size: {
        value: '500',
        price: 18,
        limit: 5
    },
    flavor: {
        value: 'tradicional',
        name: 'Açaí Tradicional'
    },
    toppings: [],
    basePrice: 18,
    totalPrice: 18
};

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initConfigurator();
});

/* ========================================
   INICIALIZAÇÃO DO CONFIGURADOR
   ======================================== */

function initConfigurator() {
    initSizeSelector();
    initFlavorSelector();
    initToppingsSelector();
    initNavigation();
    updatePreview();
    updatePrice();
    loadFromLocalStorage();
}

/* ========================================
   SELETOR DE TAMANHO
   ======================================== */

function initSizeSelector() {
    const sizeOptions = document.querySelectorAll('input[name="size"]');
    
    sizeOptions.forEach(option => {
        option.addEventListener('change', () => {
            // Update state
            configuratorState.size = {
                value: option.value,
                price: parseFloat(option.dataset.price),
                limit: parseInt(option.dataset.limit)
            };
            
            // Update base price
            configuratorState.basePrice = configuratorState.size.price;
            
            // Update visual selection
            sizeOptions.forEach(opt => {
                const card = opt.closest('.size-card');
                if (card) {
                    card.classList.toggle('selected', opt.checked);
                }
            });
            
            // Check toppings limit
            checkToppingsLimit();
            
            // Update preview
            updateSizeLabel();
            updatePrice();
            updateSummary();
            
            // Save to localStorage
            saveToLocalStorage();
        });
    });
}

/* ========================================
   SELETOR DE SABOR
   ======================================== */

function initFlavorSelector() {
    const flavorOptions = document.querySelectorAll('input[name="flavor"]');
    
    flavorOptions.forEach(option => {
        option.addEventListener('change', () => {
            // Update state
            configuratorState.flavor = {
                value: option.value,
                name: option.dataset.name
            };
            
            // Update visual selection
            flavorOptions.forEach(opt => {
                const card = opt.closest('.flavor-card');
                if (card) {
                    card.classList.toggle('selected', opt.checked);
                }
            });
            
            // Update preview
            updateFlavorPreview();
            updateSummary();
            
            // Save to localStorage
            saveToLocalStorage();
        });
    });
}

/* ========================================
   SELETOR DE COBERTURAS
   ======================================== */

function initToppingsSelector() {
    const toppingOptions = document.querySelectorAll('input[name="topping"]');
    
    toppingOptions.forEach(option => {
        option.addEventListener('change', () => {
            const toppingName = option.dataset.name;
            const toppingPrice = parseFloat(option.dataset.price);
            
            if (option.checked) {
                // Check limit
                if (configuratorState.toppings.length >= configuratorState.size.limit) {
                    option.checked = false;
                    showToppingLimitMessage();
                    return;
                }
                
                // Add topping
                configuratorState.toppings.push({
                    name: toppingName,
                    price: toppingPrice,
                    value: option.value
                });
            } else {
                // Remove topping
                configuratorState.toppings = configuratorState.toppings.filter(
                    t => t.name !== toppingName
                );
            }
            
            // Update visual selection
            updateToppingsVisual();
            
            // Update price
            updatePrice();
            
            // Update summary
            updateSummary();
            
            // Save to localStorage
            saveToLocalStorage();
        });
    });
}

/**
 * Verifica limite de coberturas e desmarca se necessário
 */
function checkToppingsLimit() {
    const toppingOptions = document.querySelectorAll('input[name="topping"]:checked');
    const limit = configuratorState.size.limit;
    
    if (toppingOptions.length > limit) {
        // Uncheck excess toppings
        Array.from(toppingOptions).slice(limit).forEach(option => {
            option.checked = false;
            
            // Remove from state
            const toppingName = option.dataset.name;
            configuratorState.toppings = configuratorState.toppings.filter(
                t => t.name !== toppingName
            );
        });
        
        showToppingLimitMessage();
    }
    
    // Update limit display
    const limitEl = document.getElementById('toppingsLimit');
    if (limitEl) {
        limitEl.textContent = `Selecione até ${limit} coberturas`;
    }
}

/**
 * Mostra mensagem de limite atingido
 */
function showToppingLimitMessage() {
    const limitEl = document.getElementById('toppingsLimit');
    if (!limitEl) return;
    
    const originalText = limitEl.textContent;
    limitEl.style.background = 'rgba(255, 68, 68, 0.2)';
    limitEl.style.borderColor = 'var(--error)';
    limitEl.textContent = `Limite máximo de ${configuratorState.size.limit} coberturas atingido!`;
    
    setTimeout(() => {
        limitEl.style.background = '';
        limitEl.style.borderColor = '';
        limitEl.textContent = originalText;
    }, 2000);
}

/**
 * Atualiza visual das coberturas selecionadas
 */
function updateToppingsVisual() {
    const selectedList = document.getElementById('selectedToppings');
    if (!selectedList) return;
    
    // Clear current
    selectedList.innerHTML = '';
    
    if (configuratorState.toppings.length === 0) {
        selectedList.innerHTML = '<span class="empty-msg">Nenhuma cobertura selecionada</span>';
        return;
    }
    
    // Add selected toppings
    configuratorState.toppings.forEach(topping => {
        const tag = document.createElement('span');
        tag.className = 'selected-tag';
        tag.innerHTML = `
            ${topping.name}
            <i class="ph-bold ph-x" data-value="${topping.value}"></i>
        `;
        
        // Add remove handler
        tag.querySelector('i').addEventListener('click', () => {
            removeTopping(topping.value);
        });
        
        selectedList.appendChild(tag);
    });
}

/**
 * Remove uma cobertura
 */
function removeTopping(value) {
    // Uncheck option
    const option = document.querySelector(`input[name="topping"][value="${value}"]`);
    if (option) {
        option.checked = false;
    }
    
    // Remove from state
    configuratorState.toppings = configuratorState.toppings.filter(
        t => t.value !== value
    );
    
    // Update visuals
    updateToppingsVisual();
    updatePrice();
    updateSummary();
    saveToLocalStorage();
}

/* ========================================
   NAVEGAÇÃO DOS PASSOS
   ======================================== */

function initNavigation() {
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevStep);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextStep);
    }
    
    updateNavigationButtons();
}

function nextStep() {
    if (configuratorState.currentStep < configuratorState.totalSteps) {
        configuratorState.currentStep++;
        updateStepDisplay();
        updateNavigationButtons();
    } else {
        // Final step - open modal
        if (typeof openModal === 'function') {
            openModal(
                `Açaí ${configuratorState.size.value}ml - ${configuratorState.flavor.name}`,
                configuratorState.totalPrice.toFixed(2).replace('.', ','),
                'custom-acai'
            );
        }
    }
}

function prevStep() {
    if (configuratorState.currentStep > 1) {
        configuratorState.currentStep--;
        updateStepDisplay();
        updateNavigationButtons();
    }
}

function updateStepDisplay() {
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === configuratorState.currentStep) {
            step.classList.add('active');
        } else if (stepNum < configuratorState.currentStep) {
            step.classList.add('completed');
        }
    });
    
    // Update config steps
    document.querySelectorAll('.config-step').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.toggle('active', stepNum === configuratorState.currentStep);
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (prevBtn) {
        prevBtn.disabled = configuratorState.currentStep === 1;
    }
    
    if (nextBtn) {
        const isLastStep = configuratorState.currentStep === configuratorState.totalSteps;
        nextBtn.innerHTML = isLastStep 
            ? 'Finalizar <i class="ph-bold ph-check"></i>'
            : 'Próximo <i class="ph-bold ph-arrow-right"></i>';
    }
}

/* ========================================
   PREVIEW DO COPO
   ======================================== */

function updatePreview() {
    updateSizeLabel();
    updateFlavorPreview();
    updateToppingsPreview();
}

function updateSizeLabel() {
    const sizeLabel = document.getElementById('sizeLabel');
    if (sizeLabel) {
        sizeLabel.textContent = `${configuratorState.size.value}ml`;
    }
}

function updateFlavorPreview() {
    const cupAcai = document.getElementById('cupAcai');
    if (cupAcai) {
        // Update flavor color
        let color;
        switch (configuratorState.flavor.value) {
            case 'guarana':
                color = '#6B2D00';
                break;
            case 'zero':
                color = '#2D0052';
                break;
            default:
                color = '#4B0082';
        }
        
        cupAcai.style.background = `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`;
        cupAcai.classList.add('filled');
    }
}

function updateToppingsPreview() {
    const cupToppings = document.getElementById('cupToppings');
    if (!cupToppings) return;
    
    // Clear current
    cupToppings.innerHTML = '';
    
    // Add topping visuals
    const colors = {
        'banana': '#FFE135',
        'morango': '#FC5A8D',
        'kiwi': '#8DB600',
        'abacaxi': '#F7C600',
        'uva': '#6B2D75',
        'manga': '#FF8C00',
        'granola-tradicional': '#C4A35A',
        'granola-crocante': '#D4A84B',
        'leite-po': '#FFFEF0',
        'leite-condensado': '#FFFEF0',
        'chocolate': '#3D1C02',
        'calda-morango': '#FF6B8A',
        'caramelo': '#C68A00',
        'pacoca': '#C4A35A',
        'farinha-lactea': '#FFF8DC',
        'coco-ralado': '#FFFEF0',
        'chocoball': '#3D1C02',
        'nutella': '#5D3A00',
        'amendoin': '#D2691E'
    };
    
    configuratorState.toppings.slice(0, 8).forEach((topping, index) => {
        const visual = document.createElement('div');
        visual.className = 'topping-visual';
        visual.style.background = colors[topping.value] || '#FFD700';
        visual.style.animationDelay = `${index * 0.1}s`;
        cupToppings.appendChild(visual);
    });
}

/* ========================================
   PREÇO
   ======================================== */

function updatePrice() {
    // Calculate total
    const toppingsTotal = configuratorState.toppings.reduce(
        (sum, t) => sum + t.price, 0
    );
    configuratorState.totalPrice = configuratorState.basePrice + toppingsTotal;
    
    // Update display
    const priceEl = document.getElementById('configPrice');
    if (priceEl) {
        priceEl.textContent = `R$ ${configuratorState.totalPrice.toFixed(2).replace('.', ',')}`;
    }
}

/* ========================================
   RESUMO DO PEDIDO
   ======================================== */

function updateSummary() {
    // Size
    const summarySize = document.getElementById('summarySize');
    if (summarySize) {
        summarySize.textContent = `${configuratorState.size.value}ml`;
    }
    
    // Flavor
    const summaryFlavor = document.getElementById('summaryFlavor');
    if (summaryFlavor) {
        summaryFlavor.textContent = configuratorState.flavor.name;
    }
    
    // Toppings
    const summaryToppings = document.getElementById('summaryToppings');
    if (summaryToppings) {
        if (configuratorState.toppings.length === 0) {
            summaryToppings.innerHTML = '<li class="empty">Nenhuma</li>';
        } else {
            summaryToppings.innerHTML = configuratorState.toppings
                .map(t => `<li>${t.name} (+R$ ${t.price.toFixed(2)})</li>`)
                .join('');
        }
    }
    
    // Total price
    const summaryPrice = document.getElementById('summaryPrice');
    if (summaryPrice) {
        summaryPrice.textContent = `R$ ${configuratorState.totalPrice.toFixed(2).replace('.', ',')}`;
    }
}

/* ========================================
   LOCAL STORAGE
   ======================================== */

function saveToLocalStorage() {
    const data = {
        size: configuratorState.size,
        flavor: configuratorState.flavor,
        toppings: configuratorState.toppings,
        basePrice: configuratorState.basePrice,
        totalPrice: configuratorState.totalPrice,
        step: configuratorState.currentStep
    };
    
    localStorage.setItem('acaiConfigurator', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('acaiConfigurator');
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        
        // Restore size
        if (data.size) {
            configuratorState.size = data.size;
            const sizeOption = document.querySelector(`input[name="size"][value="${data.size.value}"]`);
            if (sizeOption) {
                sizeOption.checked = true;
                sizeOption.closest('.size-card')?.classList.add('selected');
            }
        }
        
        // Restore flavor
        if (data.flavor) {
            configuratorState.flavor = data.flavor;
            const flavorOption = document.querySelector(`input[name="flavor"][value="${data.flavor.value}"]`);
            if (flavorOption) {
                flavorOption.checked = true;
                flavorOption.closest('.flavor-card')?.classList.add('selected');
            }
        }
        
        // Restore toppings
        if (data.toppings && Array.isArray(data.toppings)) {
            configuratorState.toppings = data.toppings;
            data.toppings.forEach(topping => {
                const option = document.querySelector(`input[name="topping"][value="${topping.value}"]`);
                if (option) {
                    option.checked = true;
                }
            });
        }
        
        // Restore step
        if (data.step) {
            configuratorState.currentStep = data.step;
            updateStepDisplay();
            updateNavigationButtons();
        }
        
        // Update all displays
        updatePreview();
        updatePrice();
        updateSummary();
        checkToppingsLimit();
        
    } catch (e) {
        console.error('Error loading configurator state:', e);
    }
}

/**
 * Limpa configuração
 */
function resetConfigurator() {
    // Reset state
    configuratorState.currentStep = 1;
    configuratorState.size = { value: '500', price: 18, limit: 5 };
    configuratorState.flavor = { value: 'tradicional', name: 'Açaí Tradicional' };
    configuratorState.toppings = [];
    configuratorState.basePrice = 18;
    configuratorState.totalPrice = 18;
    
    // Reset UI
    document.querySelectorAll('input[name="size"]').forEach(opt => {
        opt.checked = opt.value === '500';
        opt.closest('.size-card')?.classList.toggle('selected', opt.value === '500');
    });
    
    document.querySelectorAll('input[name="flavor"]').forEach(opt => {
        opt.checked = opt.value === 'tradicional';
        opt.closest('.flavor-card')?.classList.toggle('selected', opt.value === 'tradicional');
    });
    
    document.querySelectorAll('input[name="topping"]').forEach(opt => {
        opt.checked = false;
    });
    
    // Update displays
    updatePreview();
    updatePrice();
    updateSummary();
    updateStepDisplay();
    updateNavigationButtons();
    
    // Clear localStorage
    localStorage.removeItem('acaiConfigurator');
}

/* ========================================
   EXPORTAR FUNÇÕES
   ======================================== */

window.configuratorState = configuratorState;
window.resetConfigurator = resetConfigurator;

