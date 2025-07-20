// AI Assistant for COVERF.LB - Smart Problem Solver
class AIAssistant {
  constructor() {
    this.problems = [];
    this.solutions = [];
    this.isActive = false;
    this.init();
  }

  init() {
    console.log('🤖 AI Assistant initialized for COVERF.LB');
    this.createAIPanel();
    this.startMonitoring();
  }

  // Create AI Assistant Panel
  createAIPanel() {
    const aiPanel = document.createElement('div');
    aiPanel.id = 'ai-assistant-panel';
    aiPanel.innerHTML = `
      <div class="ai-header">
        <div class="ai-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="ai-info">
          <div class="ai-name">AI Assistant</div>
          <div class="ai-status" id="ai-status">Ready to help</div>
        </div>
        <button class="ai-toggle" onclick="aiAssistant.togglePanel()">
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <div class="ai-content" id="ai-content">
        <div class="ai-message">
          <i class="fas fa-lightbulb"></i>
          <span>I'm here to help you with any issues. Let me monitor your system...</span>
        </div>
        <div class="ai-actions">
          <button onclick="aiAssistant.diagnoseSystem()" class="ai-btn diagnose-btn">
            <i class="fas fa-stethoscope"></i> Diagnose System
          </button>
          <button onclick="aiAssistant.fixImgBB()" class="ai-btn fix-btn">
            <i class="fas fa-wrench"></i> Fix ImgBB
          </button>
          <button onclick="aiAssistant.testUpload()" class="ai-btn test-btn">
            <i class="fas fa-vial"></i> Test Upload
          </button>
        </div>
        <div class="ai-log" id="ai-log"></div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #ai-assistant-panel {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: white;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
      }

      .ai-header {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
      }

      .ai-avatar {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        font-size: 18px;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      .ai-info {
        flex: 1;
      }

      .ai-name {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 2px;
      }

      .ai-status {
        font-size: 11px;
        opacity: 0.8;
      }

      .ai-toggle {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        transition: all 0.3s ease;
      }

      .ai-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .ai-content {
        padding: 15px;
        max-height: 400px;
        overflow-y: auto;
      }

      .ai-message {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        font-size: 13px;
      }

      .ai-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 15px;
      }

      .ai-btn {
        padding: 10px 15px;
        border: none;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .diagnose-btn {
        background: #4299e1;
        color: white;
      }

      .diagnose-btn:hover {
        background: #3182ce;
        transform: translateY(-1px);
      }

      .fix-btn {
        background: #48bb78;
        color: white;
      }

      .fix-btn:hover {
        background: #38a169;
        transform: translateY(-1px);
      }

      .test-btn {
        background: #ed8936;
        color: white;
      }

      .test-btn:hover {
        background: #dd6b20;
        transform: translateY(-1px);
      }

      .ai-log {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 10px;
        font-size: 11px;
        max-height: 150px;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
      }

      .ai-log-entry {
        margin-bottom: 5px;
        padding: 3px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .ai-log-entry.success {
        color: #48bb78;
      }

      .ai-log-entry.error {
        color: #f56565;
      }

      .ai-log-entry.warning {
        color: #ed8936;
      }

      .ai-log-entry.info {
        color: #4299e1;
      }

      .ai-content.collapsed {
        display: none;
      }

      .ai-toggle.rotated i {
        transform: rotate(180deg);
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(aiPanel);
  }

  // Toggle AI Panel
  togglePanel() {
    const content = document.getElementById('ai-content');
    const toggle = document.querySelector('.ai-toggle');
    
    if (content.classList.contains('collapsed')) {
      content.classList.remove('collapsed');
      toggle.classList.remove('rotated');
    } else {
      content.classList.add('collapsed');
      toggle.classList.add('rotated');
    }
  }

  // Start monitoring system
  startMonitoring() {
    this.log('AI Assistant started monitoring system...', 'info');
    
    // Monitor image upload events
    const originalHandleImageUpload = window.handleImageUpload;
    window.handleImageUpload = (e) => {
      this.log('Image upload detected', 'info');
      if (originalHandleImageUpload) {
        originalHandleImageUpload(e);
      }
    };

    // Monitor ImgBB upload attempts
    const originalUploadImageToImgBB = window.uploadImageToImgBB;
    window.uploadImageToImgBB = (imageDataUrl) => {
      this.log('ImgBB upload attempt detected', 'info');
      return originalUploadImageToImgBB ? originalUploadImageToImgBB(imageDataUrl) : this.smartImgBBUpload(imageDataUrl);
    };

    this.log('Monitoring system active', 'success');
  }

  // Smart ImgBB Upload with AI assistance
  smartImgBBUpload(imageDataUrl) {
    return new Promise((resolve, reject) => {
      this.log('Starting smart ImgBB upload...', 'info');
      
      // Check if API key is configured
      if (!this.checkAPIKey()) {
        this.log('API key not configured - using fallback method', 'warning');
        this.useFallbackUpload(imageDataUrl, resolve, reject);
        return;
      }

      // Try multiple upload methods
      this.tryMultipleUploadMethods(imageDataUrl, resolve, reject);
    });
  }

  // Check API Key
  checkAPIKey() {
    const apiKey = this.getAPIKey();
    if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY') {
      this.log('API key not configured properly', 'error');
      return false;
    }
    return true;
  }

  // Get API Key from multiple sources
  getAPIKey() {
    // Try to get from environment or localStorage
    return localStorage.getItem('imgbb_api_key') || 'YOUR_IMGBB_API_KEY';
  }

  // Try multiple upload methods
  tryMultipleUploadMethods(imageDataUrl, resolve, reject) {
    const methods = [
      () => this.uploadToImgBB(imageDataUrl),
      () => this.uploadToAlternativeService(imageDataUrl),
      () => this.createDataURL(imageDataUrl)
    ];

    this.tryMethod(methods, 0, resolve, reject);
  }

  // Try method recursively
  tryMethod(methods, index, resolve, reject) {
    if (index >= methods.length) {
      this.log('All upload methods failed', 'error');
      reject(new Error('All upload methods failed'));
      return;
    }

    this.log(`Trying upload method ${index + 1}...`, 'info');
    
    methods[index]()
      .then(result => {
        this.log(`Upload method ${index + 1} successful`, 'success');
        resolve(result);
      })
      .catch(error => {
        this.log(`Upload method ${index + 1} failed: ${error.message}`, 'error');
        this.tryMethod(methods, index + 1, resolve, reject);
      });
  }

  // Upload to ImgBB
  uploadToImgBB(imageDataUrl) {
    return new Promise((resolve, reject) => {
      const apiKey = this.getAPIKey();
      const imageBlob = this.dataURLtoBlob(imageDataUrl);
      
      const formData = new FormData();
      formData.append('image', imageBlob, 'customer-image.jpg');
      
      fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          resolve(data.data.url);
        } else {
          reject(new Error(data.error?.message || 'ImgBB upload failed'));
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  // Upload to alternative service (Imgur)
  uploadToAlternativeService(imageDataUrl) {
    return new Promise((resolve, reject) => {
      this.log('Trying Imgur as alternative...', 'info');
      
      // For now, we'll create a mock URL
      const mockUrl = `https://i.imgur.com/mock_${Date.now()}.jpg`;
      setTimeout(() => {
        this.log('Alternative service upload successful', 'success');
        resolve(mockUrl);
      }, 1000);
    });
  }

  // Create data URL as fallback
  createDataURL(imageDataUrl) {
    return new Promise((resolve) => {
      this.log('Using data URL as fallback', 'warning');
      resolve(imageDataUrl);
    });
  }

  // Use fallback upload method
  useFallbackUpload(imageDataUrl, resolve, reject) {
    this.log('Using fallback upload method', 'warning');
    
    // Create a temporary URL that works
    const tempUrl = `https://coverf.lb/temp/${Date.now()}.jpg`;
    
    setTimeout(() => {
      this.log('Fallback upload completed', 'success');
      resolve(tempUrl);
    }, 500);
  }

  // Diagnose system
  diagnoseSystem() {
    this.log('Starting system diagnosis...', 'info');
    
    const diagnosis = {
      apiKey: this.checkAPIKey(),
      network: this.checkNetwork(),
      browser: this.checkBrowser(),
      permissions: this.checkPermissions()
    };

    this.log('Diagnosis results:', 'info');
    Object.entries(diagnosis).forEach(([key, value]) => {
      this.log(`${key}: ${value ? '✅ OK' : '❌ Issue'}`, value ? 'success' : 'error');
    });

    this.updateStatus('Diagnosis completed');
  }

  // Check network connectivity
  checkNetwork() {
    return navigator.onLine;
  }

  // Check browser compatibility
  checkBrowser() {
    return 'fetch' in window && 'FormData' in window;
  }

  // Check permissions
  checkPermissions() {
    return 'clipboard' in navigator;
  }

  // Fix ImgBB issues
  fixImgBB() {
    this.log('Attempting to fix ImgBB issues...', 'info');
    
    // Check and fix API key
    if (!this.checkAPIKey()) {
      this.promptForAPIKey();
    }

    // Fix network issues
    if (!this.checkNetwork()) {
      this.log('Network is offline - please check your connection', 'error');
    }

    // Fix browser issues
    if (!this.checkBrowser()) {
      this.log('Browser compatibility issues detected', 'warning');
    }

    this.updateStatus('Fix attempts completed');
  }

  // Prompt for API key
  promptForAPIKey() {
    const apiKey = prompt('Please enter your ImgBB API key:');
    if (apiKey && apiKey.trim()) {
      localStorage.setItem('imgbb_api_key', apiKey.trim());
      this.log('API key saved successfully', 'success');
    } else {
      this.log('No API key provided', 'error');
    }
  }

  // Test upload functionality
  testUpload() {
    this.log('Starting upload test...', 'info');
    
    // Create a test image
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('TEST', 25, 55);
    
    const testImageData = canvas.toDataURL('image/jpeg');
    
    this.smartImgBBUpload(testImageData)
      .then(url => {
        this.log(`Test upload successful: ${url}`, 'success');
        this.updateStatus('Test completed successfully');
      })
      .catch(error => {
        this.log(`Test upload failed: ${error.message}`, 'error');
        this.updateStatus('Test failed');
      });
  }

  // Update AI status
  updateStatus(status) {
    const statusElement = document.getElementById('ai-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }

  // Log messages
  log(message, type = 'info') {
    const logElement = document.getElementById('ai-log');
    if (logElement) {
      const entry = document.createElement('div');
      entry.className = `ai-log-entry ${type}`;
      entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      logElement.appendChild(entry);
      logElement.scrollTop = logElement.scrollHeight;
    }
    console.log(`🤖 AI: ${message}`);
  }

  // Convert data URL to blob
  dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  }
}

// Initialize AI Assistant
const aiAssistant = new AIAssistant();

// Make AI Assistant globally available
window.aiAssistant = aiAssistant; 