// Get references to key elements
const upload = document.getElementById("upload");
const uploadLabel = document.querySelector(".upload-label");
const userImgWrapper = document.getElementById("user-image-wrapper");
const userImg = document.getElementById("user-image");
const widthInput = document.getElementById("widthInput");
const heightInput = document.getElementById("heightInput");
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
  const containerRect = coverContainer.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Allow movement across full screen width
  return {
    minX: -screenWidth * 0.5,
    maxX: screenWidth * 0.5,
    minY: -screenHeight * 0.3,
    maxY: screenHeight * 0.3
  };
}

// Constrain position within container bounds
function constrainPosition(x, y, width, height) {
  const bounds = getContainerBounds();
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const maxX = bounds.maxX - scaledWidth;
  const maxY = bounds.maxY - scaledHeight;
  
  return {
    x: Math.max(bounds.minX, Math.min(maxX, x)),
    y: Math.max(bounds.minY, Math.min(maxY, y))
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

// Rotate image by given degrees
function rotateImage(deg) {
  rotation = (rotation + deg) % 360;
  updateTransform();
  
  // Add visual feedback
  const button = event.target.closest('button');
  if (button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
}

// Apply translation, rotation, and scale to image wrapper
function updateTransform() {
  userImgWrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`;
}

// Update width based on input change
widthInput.addEventListener("change", () => {
  const val = Math.max(10, Math.min(1000, parseInt(widthInput.value) || 10));
  userImg.style.width = val + "px";
  widthInput.value = val;
  
  // Re-constrain position after size change
  const imgHeight = userImg.offsetHeight;
  const constrained = constrainPosition(offsetX, offsetY, val, imgHeight);
  offsetX = constrained.x;
  offsetY = constrained.y;
  updateTransform();
});

// Update height based on input change
heightInput.addEventListener("change", () => {
  const val = Math.max(10, Math.min(1000, parseInt(heightInput.value) || 10));
  userImg.style.height = val + "px";
  heightInput.value = val;
  
  // Re-constrain position after size change
  const imgWidth = userImg.offsetWidth;
  const constrained = constrainPosition(offsetX, offsetY, imgWidth, val);
  offsetX = constrained.x;
  offsetY = constrained.y;
  updateTransform();
});

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
    userImgWrapper.hidden = false;
    
    // Center the image in the container
    const containerWidth = coverContainer.offsetWidth;
    const containerHeight = coverContainer.offsetHeight;
    const imgWidth = parseInt(widthInput.value);
    const imgHeight = parseInt(heightInput.value);
    
    offsetX = (containerWidth - imgWidth) / 2; // Center horizontally
    offsetY = (containerHeight - imgHeight) / 2; // Center vertically
    scale = 1; // Reset scale
    rotation = 0;
    userImg.style.width = widthInput.value + "px";
    userImg.style.height = heightInput.value + "px";
    updateTransform();
    
    // Show success state
    uploadLabel.classList.remove("loading");
    uploadLabel.classList.add("success");
    uploadLabel.querySelector("i").className = "fas fa-check-circle";
    uploadLabel.querySelector("span").textContent = "تم رفع الصورة بنجاح!";
    
    // Reset after 2 seconds
    setTimeout(() => {
      uploadLabel.classList.remove("success");
      uploadLabel.querySelector("i").className = "fas fa-cloud-upload-alt";
      uploadLabel.querySelector("span").textContent = "اختر صورة لتصميم الكوفر";
    }, 2000);
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

// Handle resizing based on handle direction
function resizeMouseMove(e) {
  if (!currentHandle) return;
  
  const coords = getClientCoordinates(e);
  let dx = coords.clientX - startMouseX;
  let dy = coords.clientY - startMouseY;
  
  let newWidth, newHeight, newOffsetX = startOffsetX, newOffsetY = startOffsetY;
  
  switch (currentHandle.className) {
    case "resize-handle br": // Bottom right corner
      newWidth = Math.max(10, Math.min(1000, startWidth + dx));
      newHeight = Math.max(10, Math.min(1000, startHeight + dy));
      break;
    case "resize-handle bl": // Bottom left
      newWidth = Math.max(10, Math.min(1000, startWidth - dx));
      newHeight = Math.max(10, Math.min(1000, startHeight + dy));
      newOffsetX = startOffsetX + dx;
      break;
    case "resize-handle tr": // Top right
      newWidth = Math.max(10, Math.min(1000, startWidth + dx));
      newHeight = Math.max(10, Math.min(1000, startHeight - dy));
      newOffsetY = startOffsetY + dy;
      break;
    case "resize-handle tl": // Top left
      newWidth = Math.max(10, Math.min(1000, startWidth - dx));
      newHeight = Math.max(10, Math.min(1000, startHeight - dy));
      newOffsetX = startOffsetX + dx;
      newOffsetY = startOffsetY + dy;
      break;
  }
  
  // Constrain position after resize
  const constrained = constrainPosition(newOffsetX, newOffsetY, newWidth, newHeight);
  
  widthInput.value = newWidth;
  heightInput.value = newHeight;
  offsetX = constrained.x;
  offsetY = constrained.y;
  
  userImg.style.width = newWidth + "px";
  userImg.style.height = newHeight + "px";
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

// Increment/decrement width with visual feedback
function changeWidth(delta) {
  let val = Math.max(10, Math.min(1000, parseInt(widthInput.value) + delta));
  widthInput.value = val;
  userImg.style.width = val + "px";
  
  // Re-constrain position after size change
  const imgHeight = userImg.offsetHeight;
  const constrained = constrainPosition(offsetX, offsetY, val, imgHeight);
  offsetX = constrained.x;
  offsetY = constrained.y;
  updateTransform();
  
  // Add visual feedback
  const button = event.target.closest('button');
  if (button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
}

// Increment/decrement height with visual feedback
function changeHeight(delta) {
  let val = Math.max(10, Math.min(1000, parseInt(heightInput.value) + delta));
  heightInput.value = val;
  userImg.style.height = val + "px";
  
  // Re-constrain position after size change
  const imgWidth = userImg.offsetWidth;
  const constrained = constrainPosition(offsetX, offsetY, imgWidth, val);
  offsetX = constrained.x;
  offsetY = constrained.y;
  updateTransform();
  
  // Add visual feedback
  const button = event.target.closest('button');
  if (button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }
}

// Keyboard shortcuts (desktop only)
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "r":
        e.preventDefault();
        rotateImage(10);
        break;
      case "l":
        e.preventDefault();
        rotateImage(-10);
        break;
    }
  }
});

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
});
