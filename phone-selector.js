// Get references to key elements
const tabButtons = document.querySelectorAll('.tab-btn');
const phoneCategories = document.querySelectorAll('.phone-category');
const phoneCards = document.querySelectorAll('.phone-card');
const selectedPhoneInfo = document.getElementById('selected-phone-info');
const selectedPhoneImg = document.getElementById('selected-phone-img');
const selectedPhoneName = document.getElementById('selected-phone-name');
const selectedPhoneSpecs = document.getElementById('selected-phone-specs');
const header = document.querySelector("header");

// Header scroll functionality
let lastScrollTop = 0;
let scrollThreshold = 10;

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down - hide header
      header.classList.add("hidden");
    } else {
      // Scrolling up - show header
      header.classList.remove("hidden");
    }
    lastScrollTop = scrollTop;
  }
});

// Tab switching functionality
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    
    // Remove active class from all tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked tab
    button.classList.add('active');
    
    // Hide all phone categories
    phoneCategories.forEach(category => category.classList.remove('active'));
    
    // Show selected category
    document.getElementById(category).classList.add('active');
    
    // Clear phone selection when switching tabs
    clearPhoneSelection();
  });
});

// Phone card selection functionality
phoneCards.forEach(card => {
  card.addEventListener('click', () => {
    // Remove selected class from all cards
    phoneCards.forEach(c => c.classList.remove('selected'));
    
    // Add selected class to clicked card
    card.classList.add('selected');
    
    // Get phone details
    const phoneImage = card.querySelector('.phone-image img').src;
    const phoneName = card.querySelector('.phone-info h3').textContent;
    const phoneSpecs = card.querySelector('.phone-info p').textContent;
    const phoneModel = card.getAttribute('data-model');
    
    // Update selected phone info
    selectedPhoneImg.src = phoneImage;
    selectedPhoneName.textContent = phoneName;
    selectedPhoneSpecs.textContent = phoneSpecs;
    
    // Show selected phone info
    selectedPhoneInfo.style.display = 'block';
    
    // Scroll to selected phone info
    selectedPhoneInfo.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    
    // Store selected phone data
    localStorage.setItem('selectedPhone', JSON.stringify({
      model: phoneModel,
      name: phoneName,
      specs: phoneSpecs,
      image: phoneImage
    }));
  });
});

// Clear phone selection
function clearPhoneSelection() {
  phoneCards.forEach(card => card.classList.remove('selected'));
  selectedPhoneInfo.style.display = 'none';
  localStorage.removeItem('selectedPhone');
}

// Start design function
function startDesign() {
  const selectedPhone = localStorage.getItem('selectedPhone');
  
  if (selectedPhone) {
    const phoneData = JSON.parse(selectedPhone);
    
    // Redirect to design page with phone data
    const params = new URLSearchParams({
      model: phoneData.model,
      name: phoneData.name,
      specs: phoneData.specs,
      image: phoneData.image
    });
    
    // Redirect to the main design page
    window.location.href = `main-design.html?${params.toString()}`;
  } else {
    alert('Please select a phone model first');
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth animations
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease-in-out';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Add hover effects for phone cards
  phoneCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('selected')) {
        card.style.transform = 'translateY(-5px) scale(1.02)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('selected')) {
        card.style.transform = 'translateY(0) scale(1)';
      }
    });
  });
  
  // Add keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      clearPhoneSelection();
    }
  });
  
  // Add touch support for mobile
  let touchStartY = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  });
  
  document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe up - could be used for additional functionality
        console.log('Swipe up detected');
      } else {
        // Swipe down - could be used for additional functionality
        console.log('Swipe down detected');
      }
    }
  }
  
  // Add loading animation for images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';
  });
  
  // Add ripple effect for buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add CSS for ripple effect
  const style = document.createElement('style');
  style.textContent = `
    button {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Check if there's a selected phone from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const model = urlParams.get('model');
  
  if (model) {
    // Auto-select the phone if model is provided in URL
    const targetCard = document.querySelector(`[data-model="${model}"]`);
    if (targetCard) {
      targetCard.click();
    }
  }
  
  // Add smooth scrolling for better UX
  const smoothScrollElements = document.querySelectorAll('a[href^="#"]');
  smoothScrollElements.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe phone cards for animation
  phoneCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
  });
});

// Add window resize handler
window.addEventListener('resize', () => {
  // Recalculate any dynamic layouts if needed
  const phoneGrid = document.querySelector('.phone-grid');
  if (phoneGrid) {
    // Force reflow for grid layout
    phoneGrid.style.display = 'none';
    phoneGrid.offsetHeight; // Force reflow
    phoneGrid.style.display = '';
  }
});

// Add error handling for images
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    console.warn('Image failed to load:', e.target.src);
    // You could set a fallback image here
    // e.target.src = 'fallback-image.png';
  }
}, true); 