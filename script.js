// Elements
const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalAmount = document.getElementById('totalAmount');
const sendToWhatsAppBtn = document.getElementById('sendToWhatsApp');
const clearCartBtn = document.getElementById('clearCart');
const englishBtn = document.getElementById('englishBtn');
const arabicBtn = document.getElementById('arabicBtn');

// States
let currentLang = 'ar';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize language
function initLanguage() {
    const savedLang = localStorage.getItem('lang') || 'ar';
    currentLang = savedLang;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateTranslations();
    updateProductDisplay();
    updateCartDisplay();
    toggleLanguageButtons();
}

// Update all translations
function updateTranslations() {
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        element.textContent = translations[currentLang][key];
    });
}

// Switch language
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateTranslations();
    updateProductDisplay();
    updateCartDisplay();
    toggleLanguageButtons();
}

// Show/Hide language buttons
function toggleLanguageButtons() {
    if (currentLang === 'ar') {
        arabicBtn.style.display = 'none';
        englishBtn.style.display = 'block';
    } else {
        englishBtn.style.display = 'none';
        arabicBtn.style.display = 'block';
    }
}

// Display products
function updateProductDisplay() {
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name[currentLang]}" class="product-image">
            <div class="product-info">
                <h3>${product.name[currentLang]}</h3>
                <p class="description">${product.description[currentLang]}</p>
                <p class="price">${product.price} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</p>
                <button onclick="addToCart(${product.id})">
                    ${translations[currentLang].addToCart}
                </button>
            </div>
        </div>
    `).join('');
}

// Manage cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    calculateTotal();
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    if (cartItems) {
        renderCartItems();
        calculateTotal();
    }
}

function renderCartItems() {
    if (!cartItems) return;
    
    cartItems.innerHTML = cart.map(item => `
        <li class="cart-item">
            <img src="${item.image}" class="cart-item-image" alt="${item.name[currentLang]}">
            <div class="cart-item-details">
                <h3>${item.name[currentLang]}</h3>
                <p>${translations[currentLang].quantity}: ${item.quantity}</p>
                <p class="price">${item.price * item.quantity} ${currentLang === 'ar' ? 'ريال' : 'SAR'}</p>
                <div class="quantity-controls">
                    <button onclick="adjustQuantity(${item.id}, 'decrease')">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="adjustQuantity(${item.id}, 'increase')">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    ${translations[currentLang].remove}
                </button>
            </div>
        </li>
    `).join('');
}

function adjustQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity++;
    } else {
        item.quantity = Math.max(1, item.quantity - 1);
    }
    updateCart();
}

function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function calculateTotal() {
    if (!totalAmount) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `${total} ${currentLang === 'ar' ? 'ريال' : 'SAR'}`;
}
// Clear cart
clearCartBtn?.addEventListener('click', () => {
    cart = [];
    updateCart();
    alert(translations[currentLang].cart_cleared);
});

// Checkout via WhatsApp
sendToWhatsAppBtn?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert(translations[currentLang].cart_empty);
        return;
    }

    let message = `${translations[currentLang].confirm_order}\n\n`;
    cart.forEach(item => {
        message += `${item.name[currentLang]} (${item.quantity}) - ${item.price * item.quantity} ${currentLang === 'ar' ? 'ريال' : 'SAR'}\n`;
    });
    message += `\n${translations[currentLang].total}: ${totalAmount.textContent}`;
    
    const whatsappURL = `https://wa.me/96176896910?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

// Navigate to cart
function goToCart() {
    window.location.href = 'cart.html';
}

// Hide header on scroll down
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.style.top = '-100px'; // إخفاء الرأس عند التمرير للأسفل
    } else {
        header.style.top = '0'; // إظهار الرأس عند التمرير للأعلى
    }
    lastScrollTop = scrollTop;
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        updateProductDisplay();
    }
    updateCartDisplay();
});

// Language switch buttons
englishBtn?.addEventListener('click', () => switchLanguage('en'));
arabicBtn?.addEventListener('click', () => switchLanguage('ar'));
