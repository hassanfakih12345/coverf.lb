// Language Management
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.translations = {
            en: {
                'logo-text': 'Modern Store',
                'contact-text': 'Instagram',
                'whatsapp-text': 'WhatsApp',
                'hero-title': 'Discover Amazing Products',
                'hero-subtitle': 'Explore our collection of premium products for 2025',
                'section-title': 'Our Products',
                'view-details': 'View Details',
                'product-1-name': 'Premium Wireless Headphones',
                'product-1-desc': 'High-quality wireless headphones with noise cancellation',
                'product-2-name': 'Smart Watch Pro',
                'product-2-desc': 'Advanced smartwatch with health monitoring features',
                'product-3-name': 'Ultra Comfort Sneakers',
                'product-3-desc': 'Premium comfort sneakers for everyday wear',
                'product-4-name': 'Wireless Charging Pad',
                'product-4-desc': 'Fast wireless charging pad for all devices',
                'product-5-name': 'Portable Bluetooth Speaker',
                'product-5-desc': 'Waterproof portable speaker with amazing sound',
                'product-6-name': 'Premium Sunglasses',
                'product-6-desc': 'Stylish sunglasses with UV protection',
                'footer-title-1': 'Contact Us',
                'footer-text-1': 'Get in touch with us for any inquiries',
                'footer-title-2': 'Follow Us',
                'copyright': '© 2025 Modern Store. All rights reserved.'
            },
            ar: {
                'logo-text': 'المتجر العصري',
                'contact-text': 'انستغرام',
                'whatsapp-text': 'واتساب',
                'hero-title': 'اكتشف منتجات رائعة',
                'hero-subtitle': 'استكشف مجموعتنا من المنتجات المميزة لعام ٢٠٢٥',
                'section-title': 'منتجاتنا',
                'view-details': 'عرض التفاصيل',
                'product-1-name': 'سماعات لاسلكية مميزة',
                'product-1-desc': 'سماعات لاسلكية عالية الجودة مع إلغاء الضوضاء',
                'product-2-name': 'ساعة ذكية برو',
                'product-2-desc': 'ساعة ذكية متقدمة مع ميزات مراقبة الصحة',
                'product-3-name': 'أحذية رياضية فائقة الراحة',
                'product-3-desc': 'أحذية رياضية مريحة للارتداء اليومي',
                'product-4-name': 'وسادة شحن لاسلكية',
                'product-4-desc': 'وسادة شحن لاسلكية سريعة لجميع الأجهزة',
                'product-5-name': 'مكبر صوت بلوتوث محمول',
                'product-5-desc': 'مكبر صوت محمول مقاوم للماء مع صوت رائع',
                'product-6-name': 'نظارات شمسية مميزة',
                'product-6-desc': 'نظارات شمسية أنيقة مع حماية من الأشعة فوق البنفسجية',
                'footer-title-1': 'اتصل بنا',
                'footer-text-1': 'تواصل معنا لأي استفسارات',
                'footer-title-2': 'تابعنا',
                'copyright': '© ٢٠٢٥ المتجر العصري. جميع الحقوق محفوظة.'
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
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(element => {
            const translation = this.translations[this.currentLang][element.dataset[this.currentLang]];
            if (translation) {
                element.textContent = translation;
            }
        });
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
                                Order via WhatsApp
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
            const message = `Hi! I'm interested in ${productName} (${productPrice})`;
            const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });

        // Animate modal in
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
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
