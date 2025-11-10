$(document).ready(function() {
    
    // === Settings Navigation ===
    $('.settings-nav-link').click(function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        $('.settings-nav-link').removeClass('active');
        
        // Add active class to clicked link
        $(this).addClass('active');
        
        // Hide all sections
        $('.settings-section').removeClass('active');
        
        // Show selected section
        const section = $(this).data('section');
        $('#' + section).addClass('active');
        
        // Scroll to top of content
        $('.dashboard-content').animate({ scrollTop: 0 }, 300);
    });

    // === Profile Form Submission ===
    $('#profileForm').submit(function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...');
        
        // Simulate API call
        setTimeout(function() {
            submitBtn.prop('disabled', false).html(originalText);
            showToast('Success', 'Profile updated successfully!', 'success');
        }, 1500);
    });

    // === Password Form Submission ===
    $('#passwordForm').submit(function(e) {
        e.preventDefault();
        
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Error', 'Please fill in all password fields', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('Error', 'New passwords do not match', 'error');
            return;
        }
        
        if (newPassword.length < 8) {
            showToast('Error', 'Password must be at least 8 characters', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Updating...');
        
        // Simulate API call
        setTimeout(function() {
            submitBtn.prop('disabled', false).html(originalText);
            $('#passwordForm')[0].reset();
            $('#strengthFill').removeClass('weak medium strong').css('width', '0');
            $('#strengthText').text('Enter password').removeClass('weak medium strong');
            showToast('Success', 'Password updated successfully!', 'success');
        }, 1500);
    });

    // === Password Strength Checker ===
    $('#newPassword').on('input', function() {
        const password = $(this).val();
        const strengthFill = $('#strengthFill');
        const strengthText = $('#strengthText');
        
        if (password.length === 0) {
            strengthFill.removeClass('weak medium strong').css('width', '0');
            strengthText.text('Enter password').removeClass('weak medium strong');
            return;
        }
        
        let strength = 0;
        
        // Check password strength
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        strengthFill.removeClass('weak medium strong');
        strengthText.removeClass('weak medium strong');
        
        if (strength <= 2) {
            strengthFill.addClass('weak');
            strengthText.text('Weak password').addClass('weak');
        } else if (strength === 3) {
            strengthFill.addClass('medium');
            strengthText.text('Medium password').addClass('medium');
        } else {
            strengthFill.addClass('strong');
            strengthText.text('Strong password').addClass('strong');
        }
    });

    // === Avatar Upload ===
    $('.btn-avatar-upload').click(function() {
        showToast('Info', 'Avatar upload feature coming soon!', 'info');
    });

    $('.btn-avatar-remove').click(function() {
        if (confirm('Are you sure you want to remove your profile picture?')) {
            showToast('Success', 'Profile picture removed successfully!', 'success');
        }
    });

    // === Session Revoke ===
    $('.btn-session-revoke').click(function() {
        if (confirm('Are you sure you want to revoke this session?')) {
            $(this).closest('.session-item').fadeOut(300, function() {
                $(this).remove();
            });
            showToast('Success', 'Session revoked successfully!', 'success');
        }
    });

    // === Save Settings Buttons ===
    $('.btn-settings-primary').not('#profileForm button, #passwordForm button').click(function() {
        const submitBtn = $(this);
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...');
        
        setTimeout(function() {
            submitBtn.prop('disabled', false).html(originalText);
            showToast('Success', 'Settings saved successfully!', 'success');
        }, 1500);
    });

});

// === Password Visibility Toggle ===
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// === Download Data ===
function downloadData() {
    showToast('Info', 'Preparing your data for download...', 'info');
    
    setTimeout(function() {
        const data = {
            profile: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 234 567 8900'
            },
            complaints: [
                { id: 'C001', title: 'Sample Complaint', status: 'Resolved' }
            ],
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-data-' + Date.now() + '.json';
        link.click();
        
        showToast('Success', 'Your data has been downloaded!', 'success');
    }, 2000);
}

// === Delete Account Confirmation ===
function confirmDeleteAccount() {
    const modal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
    modal.show();
}

function deleteAccount() {
    showToast('Info', 'Processing account deletion...', 'info');
    
    setTimeout(function() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteAccountModal'));
        modal.hide();
        
        showToast('Success', 'Account deletion request submitted. You will receive an email confirmation.', 'success');
        
        // Redirect after 3 seconds
        setTimeout(function() {
            window.location.href = '../pages/login.html';
        }, 3000);
    }, 2000);
}

// === Toast Notification ===
function showToast(title, message, type = 'info') {
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    const colorMap = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
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
            <button class="toast-close" onclick="$(this).parent().fadeOut()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    $('body').append(toastHtml);

    setTimeout(() => {
        $('.toast-notification').fadeOut(() => {
            $('.toast-notification').remove();
        });
    }, 4000);
}

// Toast styles
$(document).ready(function() {
    const toastStyles = `
        <style>
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
                min-width: 320px;
                max-width: 400px;
                border: 2px solid #E5E7EB;
            }
            
            .toast-content {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .toast-content i {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .toast-content strong {
                display: block;
                margin-bottom: 0.25rem;
                color: #1F2937;
                font-size: 0.95rem;
            }
            
            .toast-content p {
                margin: 0;
                font-size: 0.85rem;
                color: #6b7280;
                line-height: 1.5;
            }
            
            .toast-close {
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                background: none;
                border: none;
                color: #9CA3AF;
                cursor: pointer;
                padding: 0.25rem;
                font-size: 0.85rem;
                transition: all 0.3s ease;
            }
            
            .toast-close:hover {
                color: #4F46E5;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 767px) {
                .toast-notification {
                    left: 20px;
                    right: 20px;
                    min-width: auto;
                }
            }
        </style>
    `;
    $('head').append(toastStyles);
});
