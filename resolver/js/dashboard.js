/* ===== RESOLVER DASHBOARD JAVASCRIPT ===== */

$(document).ready(function() {
    // Initialize dashboard
    initDashboard();
    loadDashboardStats();
    loadRecentComplaints();
    loadActivityFeed();
    loadNotifications();
    
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

// Initialize dashboard
function initDashboard() {
    // Get resolver info from localStorage or session
    const resolverInfo = getResolverInfo();
    
    if (resolverInfo) {
        $('#resolverName').text(resolverInfo.name);
        $('#welcomeName').text(resolverInfo.firstName || resolverInfo.name);
    }
    
    // Setup search functionality
    $('#searchInput').on('input', debounce(handleSearch, 300));
}

// Load notifications
function loadNotifications() {
    // TODO: Replace with actual API call
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

// Display notifications
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
    
    // Add click handler to mark as read
    $('.notification-item.unread').on('click', function() {
        const notifId = $(this).data('id');
        markNotificationAsRead(notifId);
    });
}

// Update notification count
function updateNotificationCount(count) {
    const badge = $('#notificationCount');
    if (count > 0) {
        badge.text(count).show();
    } else {
        badge.hide();
    }
}

// Mark notification as read
function markNotificationAsRead(id) {
    // TODO: Replace with actual API call
    $(`.notification-item[data-id="${id}"]`).removeClass('unread').addClass('read').find('.notification-dot').remove();
    
    // Update count
    const currentCount = parseInt($('#notificationCount').text()) || 0;
    updateNotificationCount(Math.max(0, currentCount - 1));
}

// Mark all notifications as read
function markAllAsRead() {
    // TODO: Replace with actual API call
    $('.notification-item.unread').removeClass('unread').addClass('read').find('.notification-dot').remove();
    updateNotificationCount(0);
}

// Get resolver info
function getResolverInfo() {
    // Try to get from localStorage
    const storedInfo = localStorage.getItem('resolverInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    }
    
    // Default mock data for development
    return {
        id: 'RES-001',
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        email: 'sarah.johnson@example.com',
        role: 'resolver'
    };
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // Mock data for development - replace with actual API call
        const stats = await fetchDashboardStats();
        
        // Update stats cards
        $('#totalAssigned').text(stats.totalAssigned);
        $('#pendingStats').text(stats.pending);
        $('#inProgressStats').text(stats.inProgress);
        $('#resolvedStats').text(stats.resolved);
        $('#spamStats').text(stats.spam);
        $('#urgentStats').text(stats.urgent);
        $('#avgTimeStats').text(stats.avgResolutionTime);
        $('#resolutionRate').text(stats.resolutionRate + '%');
        
        // Update sidebar badges
        $('#totalComplaints').text(stats.totalAssigned);
        $('#pendingCount').text(stats.pending);
        $('#inProgressCount').text(stats.inProgress);
        $('#resolvedCount').text(stats.resolved);
        $('#spamCount').text(stats.spam);
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showToast('Error', 'Failed to load dashboard statistics', 'error');
    }
}

// Fetch dashboard statistics
async function fetchDashboardStats() {
    // TODO: Replace with actual API call
    // const response = await fetch(`${CONFIG.API_BASE_URL}/resolver/dashboard`);
    // return await response.json();
    
    // Mock data for development
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalAssigned: 48,
                pending: 12,
                inProgress: 8,
                resolved: 25,
                spam: 3,
                urgent: 5,
                avgResolutionTime: '2.5h',
                resolutionRate: 92
            });
        }, 800);
    });
}

// Load recent complaints
async function loadRecentComplaints() {
    try {
        const complaints = await fetchRecentComplaints();
        
        const tableBody = $('#recentComplaintsTable tbody');
        tableBody.empty();
        
        if (complaints.length === 0) {
            tableBody.html(`
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h5>No complaints yet</h5>
                            <p>You don't have any assigned complaints at the moment.</p>
                        </div>
                    </td>
                </tr>
            `);
            return;
        }
        
        complaints.forEach(complaint => {
            const row = createComplaintRow(complaint);
            tableBody.append(row);
        });
        
    } catch (error) {
        console.error('Error loading recent complaints:', error);
        $('#recentComplaintsTable tbody').html(`
            <tr>
                <td colspan="6" class="text-center py-5 text-danger">
                    <i class="fas fa-exclamation-circle mb-2"></i>
                    <p>Failed to load complaints. Please refresh the page.</p>
                </td>
            </tr>
        `);
    }
}

// Fetch recent complaints
async function fetchRecentComplaints() {
    // TODO: Replace with actual API call
    // const response = await fetch(`${CONFIG.API_BASE_URL}/resolver/complaints?limit=5`);
    // return await response.json();
    
    // Mock data for development
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'CMP-2024-001',
                    title: 'Broken classroom AC unit',
                    priority: 'high',
                    status: 'pending',
                    date: '2024-01-20',
                    user: 'Anonymous'
                },
                {
                    id: 'CMP-2024-002',
                    title: 'Library internet connectivity issues',
                    priority: 'medium',
                    status: 'in-progress',
                    date: '2024-01-20',
                    user: 'John Doe'
                },
                {
                    id: 'CMP-2024-003',
                    title: 'Cafeteria hygiene concern',
                    priority: 'urgent',
                    status: 'pending',
                    date: '2024-01-19',
                    user: 'Anonymous'
                },
                {
                    id: 'CMP-2024-004',
                    title: 'Parking lot lighting not working',
                    priority: 'low',
                    status: 'in-progress',
                    date: '2024-01-19',
                    user: 'Jane Smith'
                },
                {
                    id: 'CMP-2024-005',
                    title: 'Computer lab software outdated',
                    priority: 'medium',
                    status: 'resolved',
                    date: '2024-01-18',
                    user: 'Mike Johnson'
                }
            ]);
        }, 600);
    });
}

// Create complaint table row
function createComplaintRow(complaint) {
    const priorityClass = `priority-${complaint.priority}`;
    const statusClass = `status-${complaint.status}`;
    
    return `
        <tr>
            <td><span class="complaint-id">${complaint.id}</span></td>
            <td><span class="complaint-title">${complaint.title}</span></td>
            <td><span class="priority-badge ${priorityClass}">${complaint.priority}</span></td>
            <td><span class="status-badge ${statusClass}">${complaint.status.replace('-', ' ')}</span></td>
            <td>${formatDate(complaint.date)}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-view action-btn-sm" onclick="viewComplaint('${complaint.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${complaint.status !== 'resolved' && complaint.status !== 'spam' ? `
                        <button class="btn btn-sm btn-resolve action-btn-sm" onclick="quickResolve('${complaint.id}')" title="Mark as Resolved">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
}

// Load activity feed
async function loadActivityFeed() {
    try {
        const activities = await fetchActivityFeed();
        
        const feedContainer = $('#activityFeed');
        feedContainer.empty();
        
        if (activities.length === 0) {
            feedContainer.html(`
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-history mb-2"></i>
                    <p class="small">No recent activity</p>
                </div>
            `);
            return;
        }
        
        activities.forEach(activity => {
            const activityItem = createActivityItem(activity);
            feedContainer.append(activityItem);
        });
        
    } catch (error) {
        console.error('Error loading activity feed:', error);
        $('#activityFeed').html(`
            <div class="text-center py-4 text-danger">
                <small>Failed to load activity</small>
            </div>
        `);
    }
}

// Fetch activity feed
async function fetchActivityFeed() {
    // TODO: Replace with actual API call
    // const response = await fetch(`${CONFIG.API_BASE_URL}/resolver/activity`);
    // return await response.json();
    
    // Mock data for development
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    type: 'resolved',
                    title: 'Complaint Resolved',
                    description: 'CMP-2024-005 marked as resolved',
                    time: '2 hours ago'
                },
                {
                    type: 'pending',
                    title: 'New Assignment',
                    description: 'CMP-2024-003 assigned to you',
                    time: '4 hours ago'
                },
                {
                    type: 'resolved',
                    title: 'Complaint Resolved',
                    description: 'CMP-2024-002 status updated',
                    time: '6 hours ago'
                },
                {
                    type: 'spam',
                    title: 'Marked as Spam',
                    description: 'CMP-2024-001 marked as spam',
                    time: '1 day ago'
                },
                {
                    type: 'resolved',
                    title: 'Complaint Resolved',
                    description: 'CMP-2024-000 successfully resolved',
                    time: '2 days ago'
                }
            ]);
        }, 500);
    });
}

// Create activity item
function createActivityItem(activity) {
    const iconClass = activity.type === 'resolved' ? 'activity-resolved' :
                     activity.type === 'pending' ? 'activity-pending' : 'activity-spam';
    const icon = activity.type === 'resolved' ? 'fa-check-circle' :
                activity.type === 'pending' ? 'fa-clock' : 'fa-ban';
    
    return `
        <div class="activity-item">
            <div class="activity-icon ${iconClass}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="activity-content">
                <h6>${activity.title}</h6>
                <p>${activity.description}</p>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `;
}

// Handle search
function handleSearch() {
    const query = $('#searchInput').val();
    if (query.length > 0) {
        window.location.href = `complaints.html?search=${encodeURIComponent(query)}`;
    }
}

// View complaint details
function viewComplaint(complaintId) {
    // TODO: Implement complaint detail modal or redirect to detail page
    window.location.href = `complaints.html?id=${complaintId}`;
}

// Quick resolve complaint
async function quickResolve(complaintId) {
    if (!confirm('Are you sure you want to mark this complaint as resolved?')) {
        return;
    }
    
    try {
        showLoading('.btn-resolve');
        
        // TODO: Replace with actual API call
        // await fetch(`${CONFIG.API_BASE_URL}/complaints/${complaintId}/status`, {
        //     method: 'PUT',
        //     body: JSON.stringify({ status: 'resolved' })
        // });
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showToast('Success', 'Complaint marked as resolved', 'success');
        
        // Reload data
        loadDashboardStats();
        loadRecentComplaints();
        loadActivityFeed();
        
    } catch (error) {
        console.error('Error resolving complaint:', error);
        showToast('Error', 'Failed to resolve complaint', 'error');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Debounce function
function debounce(func, wait) {
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
