// Get references to key elements
const upload = document.getElementById("upload");
const uploadLabel = document.querySelector(".upload-label");
const userImgWrapper = document.getElementById("user-image-wrapper");
const userImg = document.getElementById("user-image");
const coverContainer = document.getElementById("cover-container");
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

// Initial state variables
let rotation = 0;
let offsetX = 0,
  offsetY = 0;
let scale = 1;
let isDragging = false;
let dragStartX, dragStartY;

// Pinch-to-zoom variables
let initialDistance = 0;
let initialScale = 1;
let isPinching = false;

// Get container boundaries based on screen size
function getContainerBounds() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Allow unlimited movement across the entire screen
  return {
    minX: -screenWidth * 2,
    maxX: screenWidth * 2,
    minY: -screenHeight * 2,
    maxY: screenHeight * 2
  };
}

// Constrain position within container bounds (minimal constraints)
function constrainPosition(x, y, width, height) {
  const bounds = getContainerBounds();
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  
  // Only prevent the image from going completely off-screen
  const maxX = bounds.maxX - scaledWidth * 0.1;
  const maxY = bounds.maxY - scaledHeight * 0.1;
  const minX = bounds.minX + scaledWidth * 0.1;
  const minY = bounds.minY + scaledHeight * 0.1;
  
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y))
  };
}

// Get client coordinates from mouse or touch event
function getClientCoordinates(e) {
  if (e.touches && e.touches[0]) {
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY
    };
  }
  return {
    clientX: e.clientX,
    clientY: e.clientY
  };
}

// Calculate distance between two touch points
function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Enable dragging image container (mouse and touch)
userImgWrapper.addEventListener("mousedown", startDrag);
userImgWrapper.addEventListener("touchstart", startDrag, { passive: false });

function startDrag(e) {
  // Prevent dragging if clicking on a resize handle
  if (e.target.classList.contains("resize-handle")) return;
  
  // Handle pinch-to-zoom
  if (e.touches && e.touches.length === 2) {
    isPinching = true;
    initialDistance = getDistance(e.touches[0], e.touches[1]);
    initialScale = scale;
    e.preventDefault();
    return;
  }
  
  isDragging = true;
  const coords = getClientCoordinates(e);
  dragStartX = coords.clientX - offsetX;
  dragStartY = coords.clientY - offsetY;
  userImgWrapper.style.cursor = "grabbing";
  e.preventDefault();
}

// Stop dragging on mouse/touch release
document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function stopDrag() {
  isDragging = false;
  isPinching = false;
  userImgWrapper.style.cursor = "grab";
}

// Update position while dragging
document.addEventListener("mousemove", updateDrag);
document.addEventListener("touchmove", updateDrag, { passive: false });

function updateDrag(e) {
  if (isPinching && e.touches && e.touches.length === 2) {
    // Handle pinch-to-zoom
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scaleFactor = currentDistance / initialDistance;
    const newScale = Math.max(0.1, Math.min(5, initialScale * scaleFactor));
    
    scale = newScale;
    updateTransform();
    e.preventDefault();
    return;
  }
  
  if (!isDragging) return;
  
  const coords = getClientCoordinates(e);
  const newOffsetX = coords.clientX - dragStartX;
  const newOffsetY = coords.clientY - dragStartY;
  const imgWidth = userImg.offsetWidth;
  const imgHeight = userImg.offsetHeight;
  
  // Constrain position within container bounds
  const constrained = constrainPosition(newOffsetX, newOffsetY, imgWidth, imgHeight);
  
  offsetX = constrained.x;
  offsetY = constrained.y;
  updateTransform();
  e.preventDefault();
}

// Apply translation, rotation, and scale to image wrapper
function updateTransform() {
  userImgWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`;
}

// Enhanced image upload with drag and drop
upload.addEventListener("change", handleImageUpload);

// Drag and drop functionality
uploadLabel.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = "#764ba2";
  uploadLabel.style.background = "rgba(255, 255, 255, 1)";
});

uploadLabel.addEventListener("dragleave", (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = "#667eea";
  uploadLabel.style.background = "rgba(255, 255, 255, 0.9)";
});

uploadLabel.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadLabel.style.borderColor = "#667eea";
  uploadLabel.style.background = "rgba(255, 255, 255, 0.9)";
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    upload.files = files;
    handleImageUpload({ target: upload });
  }
});

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Show loading state
  uploadLabel.classList.add("loading");
  uploadLabel.querySelector("i").className = "fas fa-spinner";
  
  const reader = new FileReader();
  reader.onload = (e) => {
    userImg.src = e.target.result;
    
    // Make sure the wrapper is visible
    userImgWrapper.hidden = false;
    userImgWrapper.style.display = "block";
    userImgWrapper.style.visibility = "visible";
    
    // Get phone template data for proper sizing
    const phoneData = window.selectedPhoneData || { defaultImageSize: { width: 200, height: 280 } };
    const imgWidth = phoneData.defaultImageSize.width;
    const imgHeight = phoneData.defaultImageSize.height;
    
    // Center the image in the container
    const containerWidth = coverContainer.offsetWidth;
    const containerHeight = coverContainer.offsetHeight;
    
    offsetX = (containerWidth - imgWidth) / 2;
    offsetY = (containerHeight - imgHeight) / 2;
    scale = 1;
    rotation = 0;
    
    // Set image dimensions based on phone template
    userImg.style.width = imgWidth + "px";
    userImg.style.height = imgHeight + "px";
    userImg.style.display = "block";
    userImg.style.visibility = "visible";
    
    // Update transform
    updateTransform();
    
    // Show success state
    uploadLabel.classList.remove("loading");
    uploadLabel.classList.add("success");
    uploadLabel.querySelector("i").className = "fas fa-check-circle";
    uploadLabel.querySelector("span").textContent = "Image uploaded successfully!";
    
    // Show send button after successful upload
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
      sendBtn.style.display = 'block';
      sendBtn.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
    
    // Reset after 2 seconds
    setTimeout(() => {
      uploadLabel.classList.remove("success");
      uploadLabel.querySelector("i").className = "fas fa-cloud-upload-alt";
      uploadLabel.querySelector("span").textContent = "Choose an image to design your cover";
    }, 2000);
    
    // Debug log
    console.log("Image loaded successfully:", {
      src: userImg.src,
      width: userImg.offsetWidth,
      height: userImg.offsetHeight,
      visible: !userImgWrapper.hidden,
      display: userImgWrapper.style.display,
      phoneModel: phoneData.name
    });
  };
  
  reader.onerror = (error) => {
    console.error("Error reading file:", error);
    uploadLabel.classList.remove("loading");
    uploadLabel.querySelector("span").textContent = "Error reading file";
  };
  
  reader.readAsDataURL(file);
}

// Resize logic via drag handles (mouse and touch)
const handles = document.querySelectorAll(".resize-handle");
let currentHandle = null;
let startWidth, startHeight;
let startMouseX, startMouseY;
let startOffsetX, startOffsetY;

// Handle start of resizing
handles.forEach((handle) => {
  handle.addEventListener("mousedown", startResize);
  handle.addEventListener("touchstart", startResize, { passive: false });
});

function startResize(e) {
  e.stopPropagation(); // Prevent triggering drag
  currentHandle = e.target;
  startWidth = userImg.offsetWidth;
  startHeight = userImg.offsetHeight;
  const coords = getClientCoordinates(e);
  startMouseX = coords.clientX;
  startMouseY = coords.clientY;
  startOffsetX = offsetX;
  startOffsetY = offsetY;
  document.addEventListener("mousemove", resizeMouseMove);
  document.addEventListener("touchmove", resizeMouseMove, { passive: false });
  document.addEventListener("mouseup", resizeMouseUp);
  document.addEventListener("touchend", resizeMouseUp);
  e.preventDefault();
}

// Handle resizing based on handle direction with improved methods
function resizeMouseMove(e) {
  if (!currentHandle) return;
  
  const coords = getClientCoordinates(e);
  let dx = coords.clientX - startMouseX;
  let dy = coords.clientY - startMouseY;
  
  // Calculate scale factor for smoother resizing
  const scaleFactor = 1.5;
  dx *= scaleFactor;
  dy *= scaleFactor;
  
  let newWidth, newHeight, newOffsetX = startOffsetX, newOffsetY = startOffsetY;
  
  switch (currentHandle.className) {
    case "resize-handle br": // Bottom right corner
      newWidth = Math.max(30, Math.min(2000, startWidth + dx));
      newHeight = Math.max(30, Math.min(2000, startHeight + dy));
      break;
    case "resize-handle bl": // Bottom left
      newWidth = Math.max(30, Math.min(2000, startWidth - dx));
      newHeight = Math.max(30, Math.min(2000, startHeight + dy));
      newOffsetX = startOffsetX + dx;
      break;
    case "resize-handle tr": // Top right
      newWidth = Math.max(30, Math.min(2000, startWidth + dx));
      newHeight = Math.max(30, Math.min(2000, startHeight - dy));
      newOffsetY = startOffsetY + dy;
      break;
    case "resize-handle tl": // Top left
      newWidth = Math.max(30, Math.min(2000, startWidth - dx));
      newHeight = Math.max(30, Math.min(2000, startHeight - dy));
      newOffsetX = startOffsetX + dx;
      newOffsetY = startOffsetY + dy;
      break;
  }
  
  // Maintain aspect ratio if shift key is pressed (optional)
  if (e.shiftKey) {
    const aspectRatio = startWidth / startHeight;
    if (Math.abs(dx) > Math.abs(dy)) {
      newHeight = newWidth / aspectRatio;
    } else {
      newWidth = newHeight * aspectRatio;
    }
  }
  
  // Constrain position after resize
  const constrained = constrainPosition(newOffsetX, newOffsetY, newWidth, newHeight);
  
  offsetX = constrained.x;
  offsetY = constrained.y;
  
  // Apply new dimensions with smooth transition
  userImg.style.width = newWidth + "px";
  userImg.style.height = newHeight + "px";
  
  // Update transform with smooth animation
  userImgWrapper.style.transition = "transform 0.1s ease-out";
  updateTransform();
  
  e.preventDefault();
}

// End resizing
function resizeMouseUp() {
  currentHandle = null;
  document.removeEventListener("mousemove", resizeMouseMove);
  document.removeEventListener("touchmove", resizeMouseMove);
  document.removeEventListener("mouseup", resizeMouseUp);
  document.removeEventListener("touchend", resizeMouseUp);
}

// Add smooth cursor for dragging
userImgWrapper.addEventListener("mouseenter", () => {
  if (!isDragging) {
    userImgWrapper.style.cursor = "grab";
  }
});

userImgWrapper.addEventListener("mouseleave", () => {
  if (!isDragging) {
    userImgWrapper.style.cursor = "default";
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  // Re-constrain position when window is resized
  const imgWidth = userImg.offsetWidth;
  const imgHeight = userImg.offsetHeight;
  const constrained = constrainPosition(offsetX, offsetY, imgWidth, imgHeight);
  offsetX = constrained.x;
  offsetY = constrained.y;
  updateTransform();
});

// Initialize with some default styling
document.addEventListener("DOMContentLoaded", () => {
  // Add some initial animation
  userImgWrapper.style.transition = "transform 0.1s ease-out";
  
  // Ensure proper initial state
  userImgWrapper.style.display = "none";
  userImgWrapper.hidden = true;
  
  // Add tooltip functionality
  const tooltips = document.querySelectorAll('[title]');
  tooltips.forEach(element => {
    element.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = e.target.title;
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
      `;
      document.body.appendChild(tooltip);
      
      const rect = e.target.getBoundingClientRect();
      tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
      tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
      
      e.target._tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', (e) => {
      if (e.target._tooltip) {
        e.target._tooltip.remove();
        e.target._tooltip = null;
      }
    });
  });
  
  // Prevent zoom on double tap for mobile
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Initialize customer form functionality
  initializeCustomerForm();
  
  // Debug: Log initial state
  console.log("Initial state:", {
    wrapperHidden: userImgWrapper.hidden,
    wrapperDisplay: userImgWrapper.style.display,
    wrapperVisible: userImgWrapper.style.visibility,
    imageSrc: userImg.src,
    imageDisplay: userImg.style.display
  });
});

// Customer form functionality
function initializeCustomerForm() {
  const customerForm = document.getElementById('customer-form');
  if (customerForm) {
    customerForm.addEventListener('submit', handleFormSubmit);
  }
}

// Show customer form
function showCustomerForm() {
  const formSection = document.getElementById('customer-form-section');
  const sendBtn = document.getElementById('send-btn');
  
  if (formSection && sendBtn) {
    formSection.style.display = 'block';
    sendBtn.style.display = 'none';
    
    // Scroll to form
    formSection.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }
}

// Hide customer form
function hideCustomerForm() {
  const formSection = document.getElementById('customer-form-section');
  const sendBtn = document.getElementById('send-btn');
  
  if (formSection && sendBtn) {
    formSection.style.display = 'none';
    sendBtn.style.display = 'block';
  }
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const customerName = formData.get('customer-name');
  const customerPhone = formData.get('customer-phone');
  const customerAddress = formData.get('customer-address');
  
  // Get phone information
  const phoneData = window.selectedPhoneData || { name: 'Unknown Phone', specs: 'Unknown' };
  
  // Get the user image
  const userImage = document.getElementById('user-image');
  
  console.log('Form submitted:', {
    customerName,
    customerPhone,
    customerAddress,
    phoneData,
    hasUserImage: !!userImage,
    userImageSrc: userImage ? userImage.src : 'none'
  });
  
  // Show loading state
  const sendBtn = e.target.querySelector('.btn-send');
  const originalText = sendBtn.innerHTML;
  sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  sendBtn.disabled = true;
  
  // Create WhatsApp message with image
  createWhatsAppMessageWithImage(customerName, customerPhone, customerAddress, phoneData, userImage)
    .then(message => {
      console.log('Message created successfully');
      
      // Send to WhatsApp
      sendToWhatsApp(message);
      
      // Reset button
      sendBtn.innerHTML = originalText;
      sendBtn.disabled = false;
    })
    .catch(error => {
      console.error('Error creating message:', error);
      
      // Fallback to text-only message
      const message = createWhatsAppMessage(customerName, customerPhone, customerAddress, phoneData);
      sendToWhatsApp(message);
      
      // Reset button
      sendBtn.innerHTML = originalText;
      sendBtn.disabled = false;
    });
}

// Create WhatsApp message with original image
function createWhatsAppMessageWithImage(name, phone, address, phoneData, userImage) {
  return new Promise((resolve, reject) => {
    console.log('Creating WhatsApp message with original image...');
    
    // Check if image exists and has src
    if (!userImage || !userImage.src || userImage.src === '') {
      console.log('No user image found, falling back to text-only message');
      // Fallback to text-only message
      const message = createWhatsAppMessage(name, phone, address, phoneData);
      resolve(message);
      return;
    }
    
    console.log('User image found:', userImage.src);
    
    try {
      // Upload image to ImgBB
      uploadImageToImgBB(userImage.src)
        .then(imageUrl => {
          console.log('Image uploaded to ImgBB:', imageUrl);
          
          // Store the image URL
          window.orderImageUrl = imageUrl;
          
          // Show the ImgBB link to the user
          showImgBBLink(imageUrl);
          
          // Also display link in a dedicated area on the page
          displayImgBBLinkOnPage(imageUrl);
          
          // Create message with image URL
          const message = createWhatsAppMessage(name, phone, address, phoneData);
          
          resolve(message);
        })
        .catch(error => {
          console.error('Error uploading to ImgBB:', error);
          
          // Fallback to text-only message
          const message = createWhatsAppMessage(name, phone, address, phoneData);
          resolve(message);
        });
      
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to text-only message
      const message = createWhatsAppMessage(name, phone, address, phoneData);
      resolve(message);
    }
  });
}

// Upload image to ImgBB
function uploadImageToImgBB(imageDataUrl) {
  return new Promise((resolve, reject) => {
    // Check if AI Assistant is available
    if (window.aiAssistant) {
      console.log('Using AI Assistant for ImgBB upload...');
      window.aiAssistant.smartImgBBUpload(imageDataUrl)
        .then(resolve)
        .catch(reject);
      return;
    }

    // Fallback to original method
    console.log('AI Assistant not available, using fallback method...');
    
    // ImgBB API Key - You need to get this from https://api.imgbb.com/
    // 1. Go to https://api.imgbb.com/
    // 2. Sign up for a free account
    // 3. Get your API key from the dashboard
    // 4. Replace 'YOUR_IMGBB_API_KEY' with your actual API key
    const API_KEY = localStorage.getItem('imgbb_api_key') || 'YOUR_IMGBB_API_KEY';
    
    // Convert data URL to blob
    const imageBlob = dataURLtoBlob(imageDataUrl);
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', imageBlob, 'customer-image.jpg');
    
    // Make API request to ImgBB
    fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('ImgBB upload successful:', data.data);
        resolve(data.data.url);
      } else {
        console.error('ImgBB upload failed:', data.error);
        reject(new Error('ImgBB upload failed'));
      }
    })
    .catch(error => {
      console.error('Error uploading to ImgBB:', error);
      reject(error);
    });
  });
}

// Create WhatsApp message (text only)
function createWhatsAppMessage(name, phone, address, phoneData) {
  const message = `*COVERF.LB - New Order* 📱

*Customer Information:*
👤 Name: ${name}
📞 Phone: ${phone}
📍 Address: ${address}

*Phone Details:*
📱 Model: ${phoneData.name}
📏 Display: ${phoneData.specs}

*Order Details:*
🎨 Custom cover design
📸 Customer image uploaded to ImgBB

---
*Order sent from COVERF.LB website*`;

  return encodeURIComponent(message);
}

// Send to WhatsApp
function sendToWhatsApp(message) {
  const whatsappNumber = '+243998189909';
  
  // Check if we have image URL from ImgBB
  if (window.orderImageUrl) {
    try {
      // Add image URL to message
      const imageNote = `\n\n📸 *Customer Image:* ${window.orderImageUrl}`;
      const fullMessage = message + encodeURIComponent(imageNote);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${fullMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      console.log('WhatsApp opened with ImgBB image URL');
      
    } catch (error) {
      console.error('Error sending image URL:', error);
      
      // Fallback to text-only message
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  } else {
    // Send text-only message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    console.log('WhatsApp opened with text-only message');
  }
  
  // Show success message
  showSuccessMessage();
}

// Convert data URL to Blob (for ImgBB upload)
function dataURLtoBlob(dataURL) {
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

// Show ImgBB link to user
function showImgBBLink(imageUrl) {
  // Create ImgBB link notification
  const notification = document.createElement('div');
  notification.className = 'imgbb-notification';
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-link"></i>
      <div>
        <div style="font-weight: 600; margin-bottom: 8px;">Image uploaded to ImgBB</div>
        <div style="font-size: 12px; margin-bottom: 10px;">Click to copy the link:</div>
        <div class="imgbb-link" onclick="copyImgBBLink('${imageUrl}')" style="cursor: pointer; background: rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; font-size: 11px; word-break: break-all; border: 1px solid rgba(255,255,255,0.2);">
          ${imageUrl}
        </div>
        <div style="font-size: 10px; margin-top: 5px; opacity: 0.8;">Click to copy</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; position: absolute; top: 10px; right: 10px;">×</button>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    z-index: 10000;
    animation: slideInLeft 0.5s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 400px;
    min-width: 300px;
  `;
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 30 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutLeft 0.5s ease-out';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 500);
    }
  }, 30000);
  
  // Add slide out animation
  const slideOutStyle = document.createElement('style');
  slideOutStyle.textContent = `
    @keyframes slideOutLeft {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-100%);
      }
    }
  `;
  document.head.appendChild(slideOutStyle);
}

// Display ImgBB link on the page
function displayImgBBLinkOnPage(imageUrl) {
  // Remove existing link display
  const existingDisplay = document.getElementById('imgbb-link-display');
  if (existingDisplay) {
    existingDisplay.remove();
  }
  
  // Create link display area
  const linkDisplay = document.createElement('div');
  linkDisplay.id = 'imgbb-link-display';
  linkDisplay.innerHTML = `
    <div class="link-display-container">
      <div class="link-display-header">
        <i class="fas fa-link"></i>
        <span>Image uploaded to ImgBB</span>
      </div>
      <div class="link-display-content">
        <div class="link-text" onclick="copyImgBBLink('${imageUrl}')" title="Click to copy">
          ${imageUrl}
        </div>
        <div class="link-actions">
          <button onclick="copyImgBBLink('${imageUrl}')" class="copy-btn">
            <i class="fas fa-copy"></i> Copy
          </button>
          <button onclick="window.open('${imageUrl}', '_blank')" class="open-btn">
            <i class="fas fa-external-link-alt"></i> Open
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Add styles
  linkDisplay.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    z-index: 9999;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 400px;
    min-width: 300px;
    animation: slideInUp 0.5s ease-out;
  `;
  
  // Add internal styles
  const internalStyle = document.createElement('style');
  internalStyle.textContent = `
    .link-display-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    .link-display-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      font-weight: 600;
      font-size: 16px;
    }
    
    .link-display-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .link-text {
      background: rgba(255,255,255,0.1);
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      word-break: break-all;
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .link-text:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-1px);
    }
    
    .link-actions {
      display: flex;
      gap: 10px;
    }
    
    .copy-btn, .open-btn {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    
    .copy-btn {
      background: rgba(255,255,255,0.2);
      color: white;
    }
    
    .copy-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }
    
    .open-btn {
      background: #48bb78;
      color: white;
    }
    
    .open-btn:hover {
      background: #38a169;
      transform: translateY(-1px);
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(100%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(internalStyle);
  
  // Add to page
  document.body.appendChild(linkDisplay);
}

// Copy ImgBB link to clipboard
function copyImgBBLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    // Show copy success message
    const copyNotification = document.createElement('div');
    copyNotification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-check"></i>
        <span>Link copied to clipboard!</span>
      </div>
    `;
    
    copyNotification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 20px;
      background: #48bb78;
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 12px;
      z-index: 10001;
      animation: fadeInOut 2s ease-out;
    `;
    
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-10px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(fadeStyle);
    
    document.body.appendChild(copyNotification);
    
    setTimeout(() => {
      if (copyNotification.parentElement) {
        copyNotification.remove();
      }
    }, 2000);
    
  }).catch(err => {
    console.error('Failed to copy link:', err);
    // Fallback: open link in new tab
    window.open(url, '_blank');
  });
}

// Show success message
function showSuccessMessage() {
  // Create success notification
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  
  const hasImage = window.orderImageUrl !== null;
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <div>
        <div>Order sent successfully to WhatsApp!</div>
        ${hasImage ? '<div style="font-size: 12px; margin-top: 5px;">Customer image uploaded to ImgBB and sent with the order.</div>' : ''}
      </div>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #25d366, #128c7e);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
    z-index: 10000;
    animation: slideInRight 0.5s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  `;
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
  
  // Add slide out animation
  const slideOutStyle = document.createElement('style');
  slideOutStyle.textContent = `
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  `;
  document.head.appendChild(slideOutStyle);
}
