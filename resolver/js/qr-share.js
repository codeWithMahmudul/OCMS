/* ===== QR SHARE PAGE JAVASCRIPT ===== */

let selectedFiles = [];
let resolverId = null;

$(document).ready(function() {
    initQRSharePage();
    setupEventListeners();
});

// Initialize page
function initQRSharePage() {
    // Get resolver ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    resolverId = urlParams.get('resolver') || 'RES-001';
    
    // Set resolver ID in hidden field
    $('#resolverId').val(resolverId);
    
    // Load resolver info
    loadResolverInfo(resolverId);
    
    // Character counter
    $('#complaintDescription').on('input', function() {
        const length = $(this).val().length;
        $('#charCount').text(length);
        
        if (length > 1000) {
            $(this).val($(this).val().substring(0, 1000));
            $('#charCount').text(1000);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Anonymous complaint form
    $('#anonymousComplaintForm').on('submit', handleAnonymousComplaintSubmit);
    
    // Resolver login form
    $('#resolverLoginForm').on('submit', handleResolverLogin);
    
    // File upload
    $('#fileUploadZone').on('click', function() {
        $('#complaintFiles').click();
    });
    
    $('#complaintFiles').on('change', function(e) {
        handleFileSelect(e.target.files);
    });
    
    // Drag and drop
    const dropZone = document.getElementById('fileUploadZone');
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFileSelect(e.dataTransfer.files);
    });
    
    // Toggle password visibility
    $('#togglePassword').on('click', function() {
        const passwordInput = $('#loginPassword');
        const icon = $(this).find('i');
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
}

// Load resolver info
async function loadResolverInfo(resolverId) {
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${CONFIG.API_BASE_URL}/resolvers/${resolverId}`);
        // const resolver = await response.json();
        
        // Mock data
        const resolver = {
            id: resolverId,
            name: 'Sarah Johnson',
            department: 'Facilities Management'
        };
        
        $('#resolverName').text(resolver.name);
        
    } catch (error) {
        console.error('Error loading resolver info:', error);
        $('#resolverName').text('Resolver');
    }
}

// Handle anonymous complaint submit
async function handleAnonymousComplaintSubmit(e) {
    e.preventDefault();
    
    const formData = {
        resolverId: $('#resolverId').val(),
        title: $('#complaintTitle').val(),
        category: $('#complaintCategory').val(),
        priority: $('#complaintPriority').val(),
        description: $('#complaintDescription').val(),
        location: $('#complaintLocation').val(),
        files: selectedFiles,
        anonymous: true
    };
    
    // Validation
    if (!formData.title || !formData.category || !formData.priority || !formData.description) {
        showToast('Warning', 'Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const btn = $('#anonymousComplaintForm button[type="submit"]');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...').prop('disabled', true);
        
        // TODO: Replace with actual API call
        // const response = await fetch(`${CONFIG.API_BASE_URL}/complaints/anonymous`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        // const result = await response.json();
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock tracking ID
        const trackingId = 'CMP-' + new Date().getFullYear() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        // Show success message
        $('#anonymousComplaintForm').fadeOut(300, function() {
            $('#trackingId').text(trackingId);
            $('#successMessage').fadeIn(300);
        });
        
        // Reset button (in case user submits another)
        btn.html(originalHtml).prop('disabled', false);
        
        // Show toast
        showToast('Success', 'Your complaint has been submitted successfully!', 'success');
        
    } catch (error) {
        console.error('Error submitting complaint:', error);
        showToast('Error', 'Failed to submit complaint. Please try again.', 'error');
        $('#anonymousComplaintForm button[type="submit"]').html('<i class="fas fa-paper-plane me-2"></i>Submit Complaint').prop('disabled', false);
    }
}

// Handle file select
function handleFileSelect(files) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    Array.from(files).forEach(file => {
        // Check file size
        if (file.size > maxSize) {
            showToast('Warning', `File "${file.name}" is too large. Max size is 5MB.`, 'warning');
            return;
        }
        
        // Check file type
        if (!allowedTypes.includes(file.type)) {
            showToast('Warning', `File "${file.name}" type is not allowed.`, 'warning');
            return;
        }
        
        // Add to selected files
        selectedFiles.push(file);
    });
    
    // Update file list display
    displayFileList();
}

// Display file list
function displayFileList() {
    const fileList = $('#fileList');
    fileList.empty();
    
    if (selectedFiles.length === 0) {
        return;
    }
    
    selectedFiles.forEach((file, index) => {
        const fileItem = `
            <div class="file-item">
                <div class="file-item-info">
                    <i class="fas fa-${getFileIcon(file.type)}"></i>
                    <span class="file-item-name">${file.name}</span>
                    <small class="text-muted">(${formatFileSize(file.size)})</small>
                </div>
                <button type="button" class="file-item-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        fileList.append(fileItem);
    });
}

// Remove file
function removeFile(index) {
    selectedFiles.splice(index, 1);
    displayFileList();
}

// Get file icon
function getFileIcon(type) {
    if (type.startsWith('image/')) return 'file-image';
    if (type === 'application/pdf') return 'file-pdf';
    if (type.includes('word')) return 'file-word';
    return 'file';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle resolver login
async function handleResolverLogin(e) {
    e.preventDefault();
    
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    const rememberMe = $('#rememberMe').is(':checked');
    
    if (!email || !password) {
        showToast('Warning', 'Please enter your email and password', 'warning');
        return;
    }
    
    try {
        const btn = $('#resolverLoginForm button[type="submit"]');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Logging in...').prop('disabled', true);
        
        // TODO: Replace with actual API call
        // const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password, role: 'resolver' })
        // });
        // const result = await response.json();
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock resolver data
        const resolverInfo = {
            id: 'RES-001',
            name: 'Sarah Johnson',
            firstName: 'Sarah',
            email: email,
            role: 'resolver'
        };
        
        // Save to localStorage
        localStorage.setItem('resolverInfo', JSON.stringify(resolverInfo));
        if (rememberMe) {
            localStorage.setItem('rememberResolver', 'true');
        }
        
        showToast('Success', 'Login successful! Redirecting...', 'success');
        
        // Redirect to resolver dashboard
        setTimeout(() => {
            window.location.href = '../pages/dashboard.html';
        }, 1000);
        
    } catch (error) {
        console.error('Error logging in:', error);
        showToast('Error', 'Invalid email or password', 'error');
        $('#resolverLoginForm button[type="submit"]').html('<i class="fas fa-sign-in-alt me-2"></i>Login as Resolver').prop('disabled', false);
    }
}

// Copy tracking ID
function copyTrackingId() {
    const trackingId = $('#trackingId').text();
    
    // Create temporary input
    const tempInput = document.createElement('input');
    tempInput.value = trackingId;
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
        document.execCommand('copy');
        showToast('Success', 'Tracking ID copied to clipboard', 'success');
    } catch (error) {
        showToast('Error', 'Failed to copy tracking ID', 'error');
    }
    
    document.body.removeChild(tempInput);
}

// Submit another complaint
function submitAnother() {
    // Reset form
    $('#anonymousComplaintForm')[0].reset();
    selectedFiles = [];
    displayFileList();
    $('#charCount').text('0');
    
    // Show form again
    $('#successMessage').fadeOut(300, function() {
        $('#anonymousComplaintForm').fadeIn(300);
    });
}

// Make functions globally accessible
window.removeFile = removeFile;
window.copyTrackingId = copyTrackingId;
window.submitAnother = submitAnother;
