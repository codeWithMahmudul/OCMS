/* ===== UTILITY FUNCTIONS ===== */

// === Toast Notification ===
function showToast(title, message, type = 'info') {
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    const colorMap = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const toastHtml = `
        <div class="toast-notification toast-${type}">
            <div class="toast-content">
                <i class="fas fa-${iconMap[type]}" style="color: ${colorMap[type]}"></i>
                <div>
                    <strong>${title}</strong>
                    <p>${message}</p>
                </div>
            </div>
            <button class="toast-close" onclick="this.parentElement.style.display='none'">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    $('body').append(toastHtml);

    setTimeout(() => {
        $('.toast-notification').last().fadeOut(300, function() {
            $(this).remove();
        });
    }, CONFIG.NOTIFICATION_DURATION);
}

// === Loading Spinner ===
function showLoading(element) {
    const $el = $(element);
    $el.prop('disabled', true);
    $el.data('original-text', $el.html());
    $el.html('<i class="fas fa-spinner fa-spin me-2"></i>Loading...');
}

function hideLoading(element) {
    const $el = $(element);
    $el.prop('disabled', false);
    const originalText = $el.data('original-text');
    if (originalText) {
        $el.html(originalText);
    }
}

// === Date Formatting ===
function formatDate(date, format = CONFIG.DATE_FORMAT) {
    if (!date) return '';
    const d = new Date(date);
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return d.toLocaleDateString('en-US', options);
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function timeAgo(date) {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
}

// === File Size Formatting ===
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// === File Validation ===
function validateFile(file) {
    // Check file size
    if (file.size > CONFIG.MAX_FILE_SIZE) {
        showToast('Error', `File size must be less than ${formatFileSize(CONFIG.MAX_FILE_SIZE)}`, 'error');
        return false;
    }
    
    // Check file type
    if (!CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
        showToast('Error', 'Invalid file type. Please upload a valid file.', 'error');
        return false;
    }
    
    return true;
}

// === String Utilities ===
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// === Number Formatting ===
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// === Local Storage ===
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error writing to localStorage:', error);
        return false;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

function clearStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

// === Authentication ===
function getAuthToken() {
    return getFromStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

function setAuthToken(token) {
    return saveToStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
}

function removeAuthToken() {
    return removeFromStorage(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
}

function isAuthenticated() {
    return !!getAuthToken();
}

function getUserData() {
    return getFromStorage(CONFIG.STORAGE_KEYS.USER_DATA);
}

function setUserData(data) {
    return saveToStorage(CONFIG.STORAGE_KEYS.USER_DATA, data);
}

function logout() {
    removeAuthToken();
    removeFromStorage(CONFIG.STORAGE_KEYS.USER_DATA);
    window.location.href = '../auth/login.html';
}

// === URL Utilities ===
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function updateUrlParameter(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
}

function removeUrlParameter(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url);
}

// === Validation ===
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function validatePassword(password) {
    // At least 8 characters, one uppercase, one lowercase, one number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return re.test(password);
}

// === Debounce ===
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === Copy to Clipboard ===
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Success', 'Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast('Success', 'Copied to clipboard!', 'success');
    } catch (err) {
        showToast('Error', 'Failed to copy', 'error');
    }
    document.body.removeChild(textArea);
}

// === Status Badge HTML Generator ===
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge badge-pending">Pending</span>',
        'in-progress': '<span class="badge badge-in-progress">In Progress</span>',
        resolved: '<span class="badge badge-resolved">Resolved</span>',
        rejected: '<span class="badge badge-rejected">Rejected</span>'
    };
    return badges[status] || '<span class="badge">Unknown</span>';
}

// === Priority Badge HTML Generator ===
function getPriorityBadge(priority) {
    const config = CONFIG.PRIORITY_LEVELS[priority] || { label: 'Unknown', color: '#6B7280' };
    return `<span class="badge" style="background-color: ${config.color}20; color: ${config.color}; border: 1px solid ${config.color};">${config.label}</span>`;
}

// === Confirm Dialog ===
function confirmDialog(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// === Random ID Generator ===
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// === HTML Escape ===
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// === Format Relative Time ===
function formatRelativeTime(date) {
    return timeAgo(date);
}

// === Capitalize First Letter ===
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// === API Request Helper ===
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    // Add auth token if available
    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body for POST, PUT, PATCH
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = JSON.stringify(data);
    }

    // Add query params for GET
    let url = `${CONFIG.API_BASE_URL}${endpoint}`;
    if (method === 'GET' && data) {
        const params = new URLSearchParams(data);
        url += `?${params.toString()}`;
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// === Export for use ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showToast,
        showLoading,
        hideLoading,
        formatDate,
        formatDateTime,
        timeAgo,
        formatFileSize,
        validateFile,
        truncateText,
        capitalize,
        slugify,
        formatNumber,
        formatCurrency,
        getFromStorage,
        saveToStorage,
        removeFromStorage,
        clearStorage,
        getAuthToken,
        setAuthToken,
        removeAuthToken,
        isAuthenticated,
        getUserData,
        setUserData,
        logout,
        getUrlParameter,
        updateUrlParameter,
        removeUrlParameter,
        validateEmail,
        validatePhone,
        validatePassword,
        debounce,
        copyToClipboard,
        getStatusBadge,
        getPriorityBadge,
        confirmDialog,
        generateId,
        escapeHtml,
        formatRelativeTime,
        capitalizeFirst,
        apiRequest
    };
}
