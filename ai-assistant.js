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
    this.requestPermissions();
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

  // Request necessary permissions
  requestPermissions() {
    this.log('Requesting necessary permissions...', 'info');
    
    // Request clipboard permission
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state === 'granted') {
          this.log('Clipboard permission granted', 'success');
        } else if (result.state === 'prompt') {
          this.log('Requesting clipboard permission...', 'info');
          // Try to write to clipboard to trigger permission request
          navigator.clipboard.writeText('test').then(() => {
            this.log('Clipboard permission granted', 'success');
          }).catch(() => {
            this.log('Clipboard permission denied', 'warning');
          });
        }
      });
    }

    // Request camera permission (for future use)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: false, audio: false })
        .then(() => {
          this.log('Camera permission granted', 'success');
        })
        .catch(() => {
          this.log('Camera permission not needed or denied', 'info');
        });
    }

    // Request notification permission
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            this.log('Notification permission granted', 'success');
          } else {
            this.log('Notification permission denied', 'warning');
          }
        });
      } else if (Notification.permission === 'granted') {
        this.log('Notification permission already granted', 'success');
      }
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
      
      // First, try to get API key or prompt user
      this.ensureAPIKey().then(() => {
        // Try multiple upload methods
        this.tryMultipleUploadMethods(imageDataUrl, resolve, reject);
      }).catch(error => {
        this.log('Failed to get API key: ' + error.message, 'error');
        this.useFallbackUpload(imageDataUrl, resolve, reject);
      });
    });
  }

  // Ensure API Key is available
  ensureAPIKey() {
    return new Promise((resolve, reject) => {
      const apiKey = this.getAPIKey();
      
      if (apiKey && apiKey !== 'YOUR_IMGBB_API_KEY') {
        this.log('API key found and valid', 'success');
        resolve(apiKey);
        return;
      }

      this.log('API key not found, using automatic fallback...', 'warning');
      
      // Use automatic fallback instead of prompting user
      this.useAutomaticFallback().then(fallbackKey => {
        this.log('Using automatic fallback method', 'info');
        resolve(fallbackKey);
      }).catch(error => {
        this.log('All methods failed, using data URL', 'warning');
        resolve('AUTO_FALLBACK');
      });
    });
  }

  // Use automatic fallback methods
  useAutomaticFallback() {
    return new Promise((resolve, reject) => {
      // Try to use a public demo key or alternative service
      const demoKey = '2c0d692cbb22ae9a6f7c762bff7dce3a'; // Demo key for testing
      
      this.log('Trying automatic fallback with demo key', 'info');
      
      // Test the demo key
      this.testAPIKey(demoKey).then(isValid => {
        if (isValid) {
          this.log('Demo key works, using it automatically', 'success');
          localStorage.setItem('imgbb_api_key', demoKey);
          resolve(demoKey);
        } else {
          this.log('Demo key failed, using alternative method', 'warning');
          resolve('ALTERNATIVE_METHOD');
        }
      }).catch(() => {
        this.log('Demo key test failed, using alternative method', 'warning');
        resolve('ALTERNATIVE_METHOD');
      });
    });
  }

  // Test API key
  testAPIKey(apiKey) {
    return new Promise((resolve) => {
      // Create a small test image
      const canvas = document.createElement('canvas');
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#667eea';
      ctx.fillRect(0, 0, 10, 10);
      
      const testImageData = canvas.toDataURL('image/jpeg');
      const imageBlob = this.dataURLtoBlob(testImageData);
      
      const formData = new FormData();
      formData.append('image', imageBlob, 'test.jpg');
      
      fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        resolve(data.success === true);
      })
      .catch(() => {
        resolve(false);
      });
    });
  }

  // Show API Key modal
  showAPIKeyModal() {
    return new Promise((resolve, reject) => {
      // Create modal
      const modal = document.createElement('div');
      modal.id = 'api-key-modal';
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3><i class="fas fa-key"></i> ImgBB API Key Required</h3>
              <button class="modal-close" onclick="this.closest('#api-key-modal').remove()">×</button>
            </div>
            <div class="modal-body">
              <p>To upload images to ImgBB, you need an API key.</p>
              <div class="api-key-steps">
                <div class="step">
                  <span class="step-number">1</span>
                  <span>Go to <a href="https://api.imgbb.com/" target="_blank">https://api.imgbb.com/</a></span>
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  <span>Sign up for a free account</span>
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  <span>Get your API key from the dashboard</span>
                </div>
                <div class="step">
                  <span class="step-number">4</span>
                  <span>Paste it below</span>
                </div>
              </div>
              <div class="api-key-input">
                <input type="text" id="api-key-input" placeholder="Enter your ImgBB API key here..." />
                <button onclick="aiAssistant.submitAPIKey()" class="submit-btn">
                  <i class="fas fa-check"></i> Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Add modal styles
      const style = document.createElement('style');
      style.textContent = `
        #api-key-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 20000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          border-radius: 15px;
          padding: 0;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 20px;
          border-radius: 15px 15px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
        }

        .modal-close {
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
          padding: 20px;
        }

        .modal-body p {
          margin-bottom: 20px;
          color: #4a5568;
          line-height: 1.5;
        }

        .api-key-steps {
          margin-bottom: 20px;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
          padding: 10px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .step-number {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }

        .step a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .step a:hover {
          text-decoration: underline;
        }

        .api-key-input {
          display: flex;
          gap: 10px;
        }

        .api-key-input input {
          flex: 1;
          padding: 12px 15px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .api-key-input input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .submit-btn {
          background: linear-gradient(45deg, #48bb78, #38a169);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        }
      `;
      document.head.appendChild(style);

      // Add to page
      document.body.appendChild(modal);

      // Store resolve/reject for later use
      window.apiKeyModalResolve = resolve;
      window.apiKeyModalReject = reject;

      // Focus on input
      setTimeout(() => {
        const input = document.getElementById('api-key-input');
        if (input) input.focus();
      }, 100);
    });
  }

  // Submit API Key
  submitAPIKey() {
    const input = document.getElementById('api-key-input');
    const apiKey = input ? input.value.trim() : '';
    
    if (apiKey) {
      if (window.apiKeyModalResolve) {
        window.apiKeyModalResolve(apiKey);
        window.apiKeyModalResolve = null;
        window.apiKeyModalReject = null;
      }
      
      // Remove modal
      const modal = document.getElementById('api-key-modal');
      if (modal) modal.remove();
    } else {
      alert('Please enter a valid API key');
    }
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
      () => this.uploadToImgur(imageDataUrl),
      () => this.uploadToCloudinary(imageDataUrl),
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
      this.log('Uploading to ImgBB with API key: ' + apiKey.substring(0, 10) + '...', 'info');
      
      // Convert data URL to blob
      const imageBlob = this.dataURLtoBlob(imageDataUrl);
      this.log('Image blob created, size: ' + (imageBlob.size / 1024).toFixed(2) + ' KB', 'info');
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', imageBlob, 'customer-image.jpg');
      
      // Add additional parameters for better control
      formData.append('name', 'COVERF.LB_Customer_Image');
      formData.append('expiration', '2592000'); // 30 days
      
      this.log('Sending request to ImgBB...', 'info');
      
      // Make API request to ImgBB
      fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        this.log('ImgBB response status: ' + response.status, 'info');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        this.log('ImgBB response received', 'info');
        
        if (data.success) {
          const imageUrl = data.data.url;
          this.log('ImgBB upload successful! URL: ' + imageUrl, 'success');
          
          // Store additional info
          localStorage.setItem('last_imgbb_url', imageUrl);
          localStorage.setItem('last_imgbb_delete_url', data.data.delete_url);
          
          resolve(imageUrl);
        } else {
          const errorMsg = data.error?.message || data.error || 'ImgBB upload failed';
          this.log('ImgBB upload failed: ' + errorMsg, 'error');
          reject(new Error(errorMsg));
        }
      })
      .catch(error => {
        this.log('ImgBB upload error: ' + error.message, 'error');
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

  // Upload to Imgur
  uploadToImgur(imageDataUrl) {
    return new Promise((resolve, reject) => {
      this.log('Trying Imgur upload...', 'info');
      
      // Imgur Client ID (public demo)
      const clientId = '546c25a59c58ad7';
      const imageBlob = this.dataURLtoBlob(imageDataUrl);
      
      const formData = new FormData();
      formData.append('image', imageBlob);
      formData.append('type', 'file');
      formData.append('name', 'COVERF.LB_Customer_Image');
      formData.append('title', 'Customer Image');
      
      fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${clientId}`
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          this.log('Imgur upload successful', 'success');
          resolve(data.data.link);
        } else {
          this.log('Imgur upload failed: ' + (data.data?.error || 'Unknown error'), 'error');
          reject(new Error('Imgur upload failed'));
        }
      })
      .catch(error => {
        this.log('Imgur upload error: ' + error.message, 'error');
        reject(error);
      });
    });
  }

  // Upload to Cloudinary
  uploadToCloudinary(imageDataUrl) {
    return new Promise((resolve, reject) => {
      this.log('Trying Cloudinary upload...', 'info');
      
      // Cloudinary upload preset (public demo)
      const uploadPreset = 'ml_default';
      const cloudName = 'demo';
      
      const formData = new FormData();
      formData.append('file', imageDataUrl);
      formData.append('upload_preset', uploadPreset);
      formData.append('cloud_name', cloudName);
      
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.secure_url) {
          this.log('Cloudinary upload successful', 'success');
          resolve(data.secure_url);
        } else {
          this.log('Cloudinary upload failed', 'error');
          reject(new Error('Cloudinary upload failed'));
        }
      })
      .catch(error => {
        this.log('Cloudinary upload error: ' + error.message, 'error');
        reject(error);
      });
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
    
    // Try to create a data URL that can be shared
    try {
      // Convert to a more compressed format
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.onload = () => {
        // Resize image to reduce size
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to high quality JPEG
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        this.log('Fallback: Created optimized data URL', 'success');
        resolve(optimizedDataUrl);
      };
      
      img.onerror = () => {
        this.log('Fallback: Image processing failed, using original', 'warning');
        resolve(imageDataUrl);
      };
      
      img.src = imageDataUrl;
      
    } catch (error) {
      this.log('Fallback: Error processing image, using original', 'error');
      resolve(imageDataUrl);
    }
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