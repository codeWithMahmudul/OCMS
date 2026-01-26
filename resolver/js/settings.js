/* ===== SETTINGS PAGE JAVASCRIPT ===== */

$(document).ready(function() {
    initSettings();
    loadActivityLog();
    loadNotifications();
    setupEventListeners();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize dropdowns explicitly with error handling
    try {
        const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdownElementList.forEach(function (dropdownToggleEl) {
            if (!bootstrap.Dropdown.getInstance(dropdownToggleEl)) {
                new bootstrap.Dropdown(dropdownToggleEl, {
                    autoClose: dropdownToggleEl.getAttribute('data-bs-auto-close') || true
                });
            }
        });
    } catch (error) {
        console.error('Error initializing dropdowns:', error);
    }
});

// Initialize settings
function initSettings() {
    // Get resolver info
    const resolverInfo = getResolverInfo();
    $('#resolverName').text(resolverInfo.name);
    
    // Load saved settings
    loadSettings();
    
    // Check URL hash for section
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Settings navigation
    $('.settings-nav-item').on('click', function(e) {
        e.preventDefault();
        const section = $(this).data('section');
        showSection(section);
        
        // Update URL hash
        window.location.hash = section;
    });
    
    // Profile form
    $('#profileForm').on('submit', handleProfileSubmit);
    
    // Password form
    $('#passwordForm').on('submit', handlePasswordSubmit);
    
    // Notifications form
    $('#notificationsForm').on('submit', handleNotificationsSubmit);
}

// Show section
function showSection(section) {
    // Update navigation
    $('.settings-nav-item').removeClass('active');
    $(`.settings-nav-item[data-section="${section}"]`).addClass('active');
    
    // Hide all sections
    $('.settings-section').hide();
    
    // Show selected section
    $(`#${section}-section`).show();
}

// Load settings
function loadSettings() {
    // TODO: Load from API
    // For now, settings are loaded from form values
    
    const settings = localStorage.getItem('resolverSettings');
    if (settings) {
        const parsed = JSON.parse(settings);
        
        // Load profile
        if (parsed.profile) {
            $('#fullName').val(parsed.profile.name || '');
            $('#email').val(parsed.profile.email || '');
            $('#phone').val(parsed.profile.phone || '');
            $('#bio').val(parsed.profile.bio || '');
        }
        
        // Load notifications
        if (parsed.notifications) {
            $('#emailNotif').prop('checked', parsed.notifications.email !== false);
            $('#assignmentNotif').prop('checked', parsed.notifications.assignment !== false);
            $('#statusNotif').prop('checked', parsed.notifications.status !== false);
            $('#urgentNotif').prop('checked', parsed.notifications.urgent !== false);
            $('#weeklyNotif').prop('checked', parsed.notifications.weekly === true);
        }
    }
}

// Handle profile form submit
async function handleProfileSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: $('#fullName').val(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        bio: $('#bio').val()
    };
    
    // Validation
    if (!formData.name || !formData.email) {
        showToast('Warning', 'Please fill in all required fields', 'warning');
        return;
    }
    
    try {
        const btn = $('#profileForm button[type="submit"]');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...').prop('disabled', true);
        
        // TODO: API call to update profile
        // await fetch(`${CONFIG.API_BASE_URL}/resolver/profile`, {
        //     method: 'PUT',
        //     body: JSON.stringify(formData)
        // });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Save to localStorage
        const settings = JSON.parse(localStorage.getItem('resolverSettings') || '{}');
        settings.profile = formData;
        localStorage.setItem('resolverSettings', JSON.stringify(settings));
        
        // Update resolver info
        const resolverInfo = getResolverInfo();
        resolverInfo.name = formData.name;
        resolverInfo.email = formData.email;
        localStorage.setItem('resolverInfo', JSON.stringify(resolverInfo));
        
        showToast('Success', 'Profile updated successfully', 'success');
        
        btn.html(originalHtml).prop('disabled', false);
        
        // Update name in sidebar
        $('#resolverName').text(formData.name);
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error', 'Failed to update profile', 'error');
        $('#profileForm button[type="submit"]').html('<i class="fas fa-save me-2"></i>Save Changes').prop('disabled', false);
    }
}

// Handle password form submit
async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    const currentPassword = $('#currentPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Warning', 'Please fill in all password fields', 'warning');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Error', 'New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showToast('Error', 'Password must be at least 8 characters long', 'error');
        return;
    }
    
    // Password strength check
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
        showToast('Error', 'Password must contain uppercase, lowercase, numbers, and special characters', 'error');
        return;
    }
    
    try {
        const btn = $('#passwordForm button[type="submit"]');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Updating...').prop('disabled', true);
        
        // TODO: API call to update password
        // await fetch(`${CONFIG.API_BASE_URL}/resolver/password`, {
        //     method: 'PUT',
        //     body: JSON.stringify({ currentPassword, newPassword })
        // });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Success', 'Password updated successfully', 'success');
        
        // Clear form
        $('#currentPassword').val('');
        $('#newPassword').val('');
        $('#confirmPassword').val('');
        
        btn.html(originalHtml).prop('disabled', false);
        
    } catch (error) {
        console.error('Error updating password:', error);
        showToast('Error', 'Failed to update password. Check your current password.', 'error');
        $('#passwordForm button[type="submit"]').html('<i class="fas fa-key me-2"></i>Update Password').prop('disabled', false);
    }
}

// Handle notifications form submit
async function handleNotificationsSubmit(e) {
    e.preventDefault();
    
    const notificationSettings = {
        email: $('#emailNotif').is(':checked'),
        assignment: $('#assignmentNotif').is(':checked'),
        status: $('#statusNotif').is(':checked'),
        urgent: $('#urgentNotif').is(':checked'),
        weekly: $('#weeklyNotif').is(':checked')
    };
    
    try {
        const btn = $('#notificationsForm button[type="submit"]');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Saving...').prop('disabled', true);
        
        // TODO: API call to update notifications
        // await fetch(`${CONFIG.API_BASE_URL}/resolver/notifications`, {
        //     method: 'PUT',
        //     body: JSON.stringify(notificationSettings)
        // });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Save to localStorage
        const settings = JSON.parse(localStorage.getItem('resolverSettings') || '{}');
        settings.notifications = notificationSettings;
        localStorage.setItem('resolverSettings', JSON.stringify(settings));
        
        showToast('Success', 'Notification preferences saved', 'success');
        
        btn.html(originalHtml).prop('disabled', false);
        
    } catch (error) {
        console.error('Error updating notifications:', error);
        showToast('Error', 'Failed to update notification preferences', 'error');
        $('#notificationsForm button[type="submit"]').html('<i class="fas fa-save me-2"></i>Save Preferences').prop('disabled', false);
    }
}

// Load activity log
async function loadActivityLog() {
    try {
        const activities = await fetchActivityLog();
        displayActivityLog(activities);
    } catch (error) {
        console.error('Error loading activity log:', error);
        $('#activityLog').html(`
            <div class="text-center py-4 text-danger">
                <i class="fas fa-exclamation-circle mb-2"></i>
                <p>Failed to load activity log</p>
            </div>
        `);
    }
}

// Fetch activity log
async function fetchActivityLog() {
    // TODO: Replace with actual API call
    // const response = await fetch(`${CONFIG.API_BASE_URL}/resolver/activity-log`);
    // return await response.json();
    
    // Mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    action: 'Resolved Complaint',
                    details: 'Marked CMP-2024-005 as resolved',
                    timestamp: '2024-01-20T14:30:00',
                    ip: '192.168.1.1'
                },
                {
                    action: 'Status Update',
                    details: 'Changed CMP-2024-002 status to In Progress',
                    timestamp: '2024-01-20T11:00:00',
                    ip: '192.168.1.1'
                },
                {
                    action: 'Note Added',
                    details: 'Added note to CMP-2024-001',
                    timestamp: '2024-01-20T09:15:00',
                    ip: '192.168.1.1'
                },
                {
                    action: 'Login',
                    details: 'Successful login',
                    timestamp: '2024-01-20T08:00:00',
                    ip: '192.168.1.1'
                },
                {
                    action: 'Marked as Spam',
                    details: 'Marked CMP-2024-007 as spam',
                    timestamp: '2024-01-19T16:45:00',
                    ip: '192.168.1.1'
                }
            ]);
        }, 600);
    });
}

// Display activity log with modern timeline design
function displayActivityLog(activities) {
    const container = $('#activityLog');
    container.empty();
    
    if (activities.length === 0) {
        container.html(`
            <div class="activity-empty">
                <div class="activity-empty-icon">
                    <i class="fas fa-history"></i>
                </div>
                <h6>No Activity Yet</h6>
                <p>Your activity history will appear here</p>
            </div>
        `);
        return;
    }
    
    activities.forEach(activity => {
        const type = getActivityType(activity.action);
        const icon = getActivityIcon(activity.action);
        const badge = getActivityBadge(activity.action, activity.details);
        const complaintId = extractComplaintId(activity.details);
        
        const activityItem = `
            <div class="activity-timeline-item">
                <div class="activity-icon-wrapper type-${type}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-header">
                        <h6 class="activity-title">${activity.action}</h6>
                        ${badge}
                    </div>
                    <p class="activity-description">
                        ${formatActivityDetails(activity.details, complaintId)}
                    </p>
                    <div class="activity-meta">
                        <span class="activity-time">
                            <i class="fas fa-clock"></i>
                            ${formatActivityTime(activity.timestamp)}
                        </span>
                        <span class="activity-ip">
                            <i class="fas fa-map-marker-alt"></i>
                            ${activity.ip}
                        </span>
                    </div>
                </div>
            </div>
        `;
        container.append(activityItem);
    });
}

// Get activity type for color coding
function getActivityType(action) {
    if (action.includes('Resolved')) return 'resolved';
    if (action.includes('Status')) return 'status';
    if (action.includes('Note') || action.includes('Comment')) return 'note';
    if (action.includes('Spam')) return 'spam';
    if (action.includes('Login')) return 'login';
    if (action.includes('Profile') || action.includes('Password')) return 'profile';
    return 'status';
}

// Get activity badge
function getActivityBadge(action, details) {
    if (details.includes('resolved')) {
        return '<span class="activity-badge badge-resolved">Resolved</span>';
    }
    if (details.includes('In Progress')) {
        return '<span class="activity-badge badge-in-progress">In Progress</span>';
    }
    if (details.includes('Pending')) {
        return '<span class="activity-badge badge-pending">Pending</span>';
    }
    if (details.includes('spam')) {
        return '<span class="activity-badge badge-spam">Spam</span>';
    }
    return '';
}

// Extract complaint ID from details
function extractComplaintId(details) {
    const match = details.match(/CMP-\d{4}-\d{3,4}/);
    return match ? match[0] : null;
}

// Format activity details with complaint ID highlighting
function formatActivityDetails(details, complaintId) {
    if (complaintId) {
        return details.replace(
            complaintId, 
            `<span class="activity-complaint-id">${complaintId}</span>`
        );
    }
    return details;
}

// Format activity timestamp to relative time
function formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get activity icon
function getActivityIcon(action) {
    const icons = {
        'Resolved Complaint': 'fa-check-circle',
        'Status Update': 'fa-sync-alt',
        'Note Added': 'fa-comment',
        'Login': 'fa-sign-in-alt',
        'Marked as Spam': 'fa-ban',
        'Profile Updated': 'fa-user-edit',
        'Password Changed': 'fa-key'
    };
    return icons[action] || 'fa-circle';
}

// Format date time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get resolver info
function getResolverInfo() {
    const storedInfo = localStorage.getItem('resolverInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    }
    
    return {
        id: 'RES-001',
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        email: 'sarah.johnson@example.com',
        role: 'resolver'
    };
}

// Load notifications (shared functionality)
function loadNotifications() {
    setTimeout(() => {
        const notifications = [
            {
                id: 1,
                type: 'new-complaint',
                title: 'New Complaint Assigned',
                message: 'You have been assigned complaint #12345',
                time: '5 minutes ago',
                read: false,
                icon: 'fa-file-alt',
                color: 'primary'
            },
            {
                id: 2,
                type: 'status-update',
                title: 'Complaint Resolved',
                message: 'Complaint #12340 has been marked as resolved',
                time: '1 hour ago',
                read: false,
                icon: 'fa-check-circle',
                color: 'success'
            },
            {
                id: 3,
                type: 'comment',
                title: 'New Comment',
                message: 'User replied to complaint #12338',
                time: '2 hours ago',
                read: true,
                icon: 'fa-comment',
                color: 'info'
            }
        ];
        
        displayNotifications(notifications);
        updateNotificationCount(notifications.filter(n => !n.read).length);
    }, 300);
}

function displayNotifications(notifications) {
    const notificationList = $('#notificationList');
    
    if (notifications.length === 0) {
        notificationList.html(`
            <div class="notification-item text-center py-4">
                <i class="fas fa-bell-slash text-muted mb-2" style="font-size: 2rem;"></i>
                <p class="text-muted mb-0">No notifications</p>
            </div>
        `);
        return;
    }
    
    notificationList.html(
        notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon bg-${notification.color}">
                    <i class="fas ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <h6 class="notification-title">${notification.title}</h6>
                    <p class="notification-message">${notification.message}</p>
                    <small class="notification-time">${notification.time}</small>
                </div>
                ${!notification.read ? '<span class="notification-dot"></span>' : ''}
            </div>
        `).join('')
    );
    
    $('.notification-item.unread').on('click', function() {
        const notifId = $(this).data('id');
        markNotificationAsRead(notifId);
    });
}

function updateNotificationCount(count) {
    const badge = $('#notificationCount');
    if (count > 0) {
        badge.text(count).show();
    } else {
        badge.hide();
    }
}

function markNotificationAsRead(id) {
    $(`.notification-item[data-id="${id}"]`).removeClass('unread').addClass('read').find('.notification-dot').remove();
    const currentCount = parseInt($('#notificationCount').text()) || 0;
    updateNotificationCount(Math.max(0, currentCount - 1));
}

function markAllAsRead() {
    $('.notification-item.unread').removeClass('unread').addClass('read').find('.notification-dot').remove();
    updateNotificationCount(0);
}
