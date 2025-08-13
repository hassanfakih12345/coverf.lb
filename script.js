// Language Management
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.translations = {
                         en: {
                 'logo-text': 'COVERF.LB',
                 'contact-text': 'Instagram',
                 'tiktok-text': 'TikTok',
                 'whatsapp-text': 'WhatsApp',
                'hero-title': 'Discover Amazing Products',
                'hero-subtitle': 'Explore our collection of premium products for 2025',
                'section-title': 'Our Products',
                'view-details': 'View Details',
                'product-1-name': 'Model of the shrine of Sayyid Hassan',
                'product-1-desc': 'Exquisite handcrafted statue with artistic design',
                'product-2-name': 'Wooden board (all sizes)',
                'product-2-desc': 'High-quality wooden boards available in all sizes',
                'product-3-name': 'Custom Image and Phrase (Large Size)',
                'product-3-desc': 'Personalized custom images with phrases in large size',
                'product-4-name': 'Custom phone case',
                'product-4-desc': 'Personalized custom phone cases for all models',
                'product-5-name': 'Custom keychain',
                'product-5-desc': 'Personalized custom keychains with unique designs',
                'product-6-name': 'Custom headband',
                'product-6-desc': 'Personalized custom headbands with unique designs',
                'product-7-name': 'Custom airpods case',
                'product-7-desc': 'Personalized custom airpods cases with unique designs',
                'product-8-name': 'Custom passport holder',
                'product-8-desc': 'Personalized custom passport holders with unique designs',
                'product-9-name': 'Custom printed pin',
                'product-9-desc': 'Personalized custom printed pins with unique designs',
                'footer-title-1': 'Contact Us',
                'footer-text-1': 'Get in touch with us for any inquiries',
                'footer-title-2': 'Follow Us',
                'copyright': '© 2025 COVERF.LB. All rights reserved.'
            },
                         ar: {
                 'logo-text': 'COVERF.LB',
                 'contact-text': 'انستغرام',
                 'tiktok-text': 'تيكتوك',
                 'whatsapp-text': 'واتساب',
                'hero-title': 'اكتشف منتجات رائعة',
                'hero-subtitle': 'استكشف مجموعتنا من المنتجات المميزة لعام ٢٠٢٥',
                'section-title': 'منتجاتنا',
                'view-details': 'عرض التفاصيل',
                'product-1-name': 'مجسم ضريح السيد حسن',
                'product-1-desc': 'مجسم يدوي الصنع بتصميم فني رائع',
                'product-2-name': 'لوحة خشبية (جميع المقاسات)',
                'product-2-desc': 'لوحات خشبية عالية الجودة متوفرة بجميع المقاسات',
                'product-3-name': 'صورة وعبارة مخصصة (مقاس كبير)',
                'product-3-desc': 'صور مخصصة مع عبارات بمقاس كبير',
                'product-4-name': 'كوفر هاتف مخصص',
                'product-4-desc': 'كوفرات هواتف مخصصة لجميع الموديلات',
                'product-5-name': 'تعليقة مخصصة',
                'product-5-desc': 'تعليقات مخصصة بتصاميم فريدة',
                'product-6-name': 'عصابة راس مخصصة',
                'product-6-desc': 'عصابات راس مخصصة بتصاميم فريدة',
                'product-7-name': 'بيت سماعة مخصص',
                'product-7-desc': 'بيوت سماعات مخصصة بتصاميم فريدة',
                'product-8-name': 'حافظة باسبور مخصصة',
                'product-8-desc': 'حافظات باسبور مخصصة بتصاميم فريدة',
                'product-9-name': 'دبوس مطبوع مخصص',
                'product-9-desc': 'دبابيس مطبوعة مخصصة بتصاميم فريدة',
                'footer-title-1': 'اتصل بنا',
                'footer-text-1': 'تواصل معنا لأي استفسارات',
                'footer-title-2': 'تابعنا',
                'copyright': '© ٢٠٢٥ COVERF.LB. جميع الحقوق محفوظة.'
            }
        };
        this.init();
    }

    init() {
        this.setupLanguageSwitcher();
        this.loadSavedLanguage();
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferred-language') || 'en';
        this.switchLanguage(savedLang);
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferred-language', lang);
        
        // Update button states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        // Update document direction
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', lang);

        // Update all translatable elements
        this.updateTranslations();
    }

    updateTranslations() {
        // Update elements with data attributes
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            const key = element.dataset[this.currentLang];
            if (key && this.translations[this.currentLang][key]) {
                element.textContent = this.translations[this.currentLang][key];
            }
        });
        
        // Update product names specifically
        this.updateProductNames();
        
        // Update modal content if it exists
        this.updateModalTranslations();
        
        // Update WhatsApp message language
        this.updateWhatsAppMessage();
    }
    
    updateProductNames() {
        // Update product names using the data attributes
        const productNames = document.querySelectorAll('.product-name[data-en][data-ar]');
        productNames.forEach((element, index) => {
            const productNumber = index + 1;
            const translationKey = `product-${productNumber}-name`;
            if (this.translations[this.currentLang][translationKey]) {
                element.textContent = this.translations[this.currentLang][translationKey];
            }
        });
        
        // Update product descriptions
        const productDescriptions = document.querySelectorAll('.product-description[data-en][data-ar]');
        productDescriptions.forEach((element, index) => {
            const productNumber = index + 1;
            const translationKey = `product-${productNumber}-desc`;
            if (this.translations[this.currentLang][translationKey]) {
                element.textContent = this.translations[this.currentLang][translationKey];
            }
        });
        
        // Update product prices
        const productPrices = document.querySelectorAll('.price[data-en][data-ar]');
        productPrices.forEach((element) => {
            const key = element.dataset[this.currentLang];
            if (key) {
                element.textContent = key;
            }
        });
        
        // Update view details buttons
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn[data-en][data-ar]');
        viewDetailsButtons.forEach((element) => {
            const key = element.dataset[this.currentLang];
            if (key) {
                element.textContent = key;
            }
        });
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-title[data-en][data-ar]');
        if (heroTitle) {
            const key = heroTitle.dataset[this.currentLang];
            if (key) {
                heroTitle.textContent = key;
            }
        }
        
        const heroSubtitle = document.querySelector('.hero-subtitle[data-en][data-ar]');
        if (heroSubtitle) {
            const key = heroSubtitle.dataset[this.currentLang];
            if (key) {
                heroSubtitle.textContent = key;
            }
        }
        
        // Update section title
        const sectionTitle = document.querySelector('.section-title[data-en][data-ar]');
        if (sectionTitle) {
            const key = sectionTitle.dataset[this.currentLang];
            if (key) {
                sectionTitle.textContent = key;
            }
        }
        
        // Update footer elements
        const footerTitles = document.querySelectorAll('.footer-title[data-en][data-ar]');
        footerTitles.forEach((element) => {
            const key = element.dataset[this.currentLang];
            if (key) {
                element.textContent = key;
            }
        });
        
        const footerTexts = document.querySelectorAll('.footer-text[data-en][data-ar]');
        footerTexts.forEach((element) => {
            const key = element.dataset[this.currentLang];
            if (key) {
                element.textContent = key;
            }
        });
        
        const copyright = document.querySelector('.copyright[data-en][data-ar]');
        if (copyright) {
            const key = copyright.dataset[this.currentLang];
            if (key) {
                copyright.textContent = key;
            }
        }
        
        // Update header contact links
        const contactTexts = document.querySelectorAll('.contact-text[data-en][data-ar]');
        contactTexts.forEach((element) => {
            const key = element.dataset[this.currentLang];
            if (key) {
                element.textContent = key;
            }
        });
    }
    
    updateWhatsAppMessage() {
        // Update any WhatsApp links to use the correct language
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
            const currentText = link.textContent.trim();
            if (currentText.includes('WhatsApp') || currentText.includes('واتساب')) {
                link.innerHTML = `<i class="fab fa-whatsapp"></i> <span class="contact-text" data-en="WhatsApp" data-ar="واتساب">${this.translations[this.currentLang]['whatsapp-text']}</span>`;
            }
        });
    }
    
    updateModalTranslations() {
        const modal = document.querySelector('.product-modal');
        if (modal) {
            const modalTitle = modal.querySelector('h2');
            const modalDesc = modal.querySelector('p');
            const modalBtn = modal.querySelector('.modal-whatsapp-btn');
            
            if (modalTitle && modalTitle.textContent) {
                // Find the product name in translations
                for (let i = 1; i <= 9; i++) {
                    const productName = this.translations[this.currentLang][`product-${i}-name`];
                    if (productName && modalTitle.textContent.includes(productName) || 
                        this.translations[this.currentLang === 'en' ? 'ar' : 'en'][`product-${i}-name`] && 
                        modalTitle.textContent.includes(this.translations[this.currentLang === 'en' ? 'ar' : 'en'][`product-${i}-name`])) {
                        modalTitle.textContent = productName;
                        modalDesc.textContent = this.translations[this.currentLang][`product-${i}-desc`];
                        break;
                    }
                }
            }
            
            if (modalBtn) {
                modalBtn.innerHTML = `<i class="fab fa-whatsapp"></i> ${this.currentLang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp'}`;
            }
        }
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupProductAnimations();
        this.setupHeaderAnimation();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-aos]').forEach(element => {
            observer.observe(element);
        });
    }

    setupProductAnimations() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('loading');
            
            setTimeout(() => {
                card.classList.add('loaded');
            }, index * 100);
        });
    }

    setupHeaderAnimation() {
        let lastScrollY = window.scrollY;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Product Manager
class ProductManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupProductInteractions();
    }

    setupProductInteractions() {
        const viewButtons = document.querySelectorAll('.view-details-btn');
        
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProductModal(e.target.closest('.product-card'));
            });
        });
    }

    showProductModal(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const productDesc = productCard.querySelector('.product-description').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('img').src;
        
        // Get current language
        const currentLang = document.documentElement.lang || 'en';
        const orderText = currentLang === 'ar' ? 'اطلب عبر واتساب' : 'Order via WhatsApp';

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img src="${productImage}" alt="${productName}">
                        </div>
                        <div class="modal-info">
                            <h2>${productName}</h2>
                            <p>${productDesc}</p>
                            <div class="modal-price">${productPrice}</div>
                            <button class="modal-whatsapp-btn">
                                <i class="fab fa-whatsapp"></i>
                                ${orderText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add modal styles
        this.addModalStyles();
        
        // Setup modal interactions
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                modal.remove();
            }
        });

        modal.querySelector('.modal-whatsapp-btn').addEventListener('click', () => {
            const currentLang = document.documentElement.lang || 'en';
            const greeting = currentLang === 'ar' ? 'مرحباً! أنا مهتم بـ' : 'Hi! I\'m interested in';
            const message = `${greeting} ${productName} (${productPrice})`;
            const whatsappUrl = `https://wa.me/96176896910?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });

        // Animate modal in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Store modal reference for language updates
        this.currentModal = modal;
    }

    addModalStyles() {
        if (!document.getElementById('modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .product-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 2000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .product-modal.show {
                    opacity: 1;
                }
                
                .modal-overlay {
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    padding: 20px;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    width: 100%;
                    position: relative;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }
                
                .product-modal.show .modal-content {
                    transform: scale(1);
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    z-index: 1;
                }
                
                .modal-body {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    padding: 20px;
                }
                
                .modal-image img {
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 8px;
                }
                
                .modal-info h2 {
                    margin-bottom: 10px;
                    color: #1f2937;
                }
                
                .modal-info p {
                    color: #6b7280;
                    margin-bottom: 15px;
                    line-height: 1.6;
                }
                
                .modal-price {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #6366f1;
                    margin-bottom: 20px;
                }
                
                .modal-whatsapp-btn {
                    background: #25d366;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                }
                
                .modal-whatsapp-btn:hover {
                    background: #128c7e;
                    transform: translateY(-2px);
                }
                
                @media (max-width: 768px) {
                    .modal-body {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
}

// Smooth Scrolling
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Performance Optimizer
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    }

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition', 'none');
        }
    }
}

// Global language manager instance
let languageManager;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    languageManager = new LanguageManager();
    new AnimationManager();
    new ProductManager();
    new SmoothScroller();
    new PerformanceOptimizer();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click ripple effect
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: fixed;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
        z-index: 9999;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);
