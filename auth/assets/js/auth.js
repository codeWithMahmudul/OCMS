/**
 * Auth.js - Authentication Pages JavaScript
 * Handles password visibility toggle, strength checking, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Password Visibility Toggle =====
    initPasswordToggle();
    
    // ===== Password Strength Checker =====
    initPasswordStrength();
    
    // ===== Form Validation =====
    initFormValidation();
});

/**
 * Initialize password visibility toggle for all password fields
 */
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-toggle-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (!passwordInput) return;
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Initialize password strength checker
 */
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('passwordStrength');
    const strengthText = document.getElementById('passwordStrengthText');
    
    if (!passwordInput || !strengthBar || !strengthText) return;
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const result = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthBar.style.width = result.width + '%';
        strengthBar.style.background = result.color;
        
        // Update strength text
        strengthText.textContent = result.text;
        strengthText.style.color = result.color;
    });
}

/**
 * Calculate password strength based on various criteria
 * @param {string} password - The password to check
 * @returns {object} - Object containing width, color, and text
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Criteria checks
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    
    const width = (strength / 5) * 100;
    let color, text;
    
    switch(strength) {
        case 0:
        case 1:
        case 2:
            color = '#ef4444';
            text = 'Weak';
            break;
        case 3:
            color = '#f59e0b';
            text = 'Fair';
            break;
        case 4:
            color = '#10b981';
            text = 'Good';
            break;
        case 5:
            color = '#059669';
            text = 'Strong';
            break;
        default:
            color = '#ef4444';
            text = 'Weak';
    }
    
    return { width, color, text };
}

/**
 * Initialize form validation for login and registration forms
 */
function initFormValidation() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Registration Form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
}

/**
 * Handle login form submission
 * @param {Event} e - Submit event
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    // TODO: Replace with actual API call
    console.log('Login attempt:', { email });
    
    // Simulate successful login
    // Remove this and implement actual authentication
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

/**
 * Handle registration form submission
 * @param {Event} e - Submit event
 */
function handleRegistrationSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = formData.get('agreeTerms');
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    if (password.length < 8) {
        showAlert('Password must be at least 8 characters long', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'danger');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('Please agree to the Terms of Service and Privacy Policy', 'danger');
        return;
    }
    
    // TODO: Replace with actual API call
    console.log('Registration attempt:', { username, email });
    
    // Simulate successful registration
    // Remove this and implement actual authentication
    showAlert('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, danger, warning, info)
 */
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-modern');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-modern alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert alert at the top of the form
    const form = document.querySelector('.auth-form');
    if (form) {
        form.insertBefore(alertDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

// Social login handlers (placeholder functions)
document.addEventListener('DOMContentLoaded', function() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    const githubBtn = document.querySelector('.btn-github');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            console.log('Google login clicked');
            // TODO: Implement Google OAuth
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            console.log('Facebook login clicked');
            // TODO: Implement Facebook OAuth
        });
    }
    
    if (githubBtn) {
        githubBtn.addEventListener('click', () => {
            console.log('GitHub login clicked');
            // TODO: Implement GitHub OAuth
        });
    }
});