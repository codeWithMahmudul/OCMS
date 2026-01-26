/* ===== SUPER ADMIN DASHBOARD JAVASCRIPT ===== */

$(document).ready(function() {
    // Initialize dashboard
    initDashboard();
    loadDashboardStats();
    loadOrganizations();
    loadActivityFeed();
    loadNotifications();
    initializeCharts();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Initialize dashboard
function initDashboard() {
    // Get admin info
    const adminInfo = getAdminInfo();
    
    if (adminInfo) {
        $('#adminName').text(adminInfo.name);
        $('#welcomeName').text(adminInfo.firstName || adminInfo.name);
        $('#dropdownUserName').text(adminInfo.name);
    }
    
    // Setup search functionality
    $('#searchInput').on('input', debounce(handleSearch, 300));
    
    // Chart period buttons
    $('.btn-group button[data-period]').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        const period = $(this).data('period');
        updateCharts(period);
    });
}

// Load dashboard stats
function loadDashboardStats() {
    // TODO: Replace with actual API call
    setTimeout(() => {
        const stats = {
            totalOrganizations: 48,
            activeUsers: 2834,
            totalComplaints: 15672,
            systemHealth: 99.8
        };
        
        $('#totalOrganizations').text(stats.totalOrganizations);
        $('#activeUsers').text(stats.activeUsers.toLocaleString());
        $('#totalComplaints').text(stats.totalComplaints.toLocaleString());
        $('#orgCount').text(stats.totalOrganizations);
        $('#userCount').text(stats.activeUsers);
        
        // Animate numbers
        animateNumbers();
    }, 500);
}

// Animate stat numbers
function animateNumbers() {
    $('.stats-number').each(function() {
        const $this = $(this);
        const target = parseInt($this.text().replace(/,/g, ''));
        
        if (!isNaN(target)) {
            $({ Counter: 0 }).animate({ Counter: target }, {
                duration: 1000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.ceil(this.Counter).toLocaleString());
                }
            });
        }
    });
}

// Load organizations table
function loadOrganizations() {
    // TODO: Replace with actual API call
    setTimeout(() => {
        const organizations = [
            {
                id: 1,
                name: 'Tech Solutions Inc',
                logo: 'TS',
                plan: 'enterprise',
                users: 250,
                complaints: 1234,
                status: 'active'
            },
            {
                id: 2,
                name: 'Global Services Ltd',
                logo: 'GS',
                plan: 'pro',
                users: 125,
                complaints: 567,
                status: 'active'
            },
            {
                id: 3,
                name: 'StartUp Ventures',
                logo: 'SV',
                plan: 'basic',
                users: 45,
                complaints: 123,
                status: 'trial'
            },
            {
                id: 4,
                name: 'Education Hub',
                logo: 'EH',
                plan: 'pro',
                users: 180,
                complaints: 892,
                status: 'active'
            },
            {
                id: 5,
                name: 'Healthcare Systems',
                logo: 'HS',
                plan: 'enterprise',
                users: 320,
                complaints: 1567,
                status: 'active'
            }
        ];
        
        displayOrganizations(organizations);
    }, 800);
}

// Display organizations in table
function displayOrganizations(organizations) {
    const tbody = $('#organizationsTable');
    tbody.empty();
    
    organizations.forEach(org => {
        const row = `
            <tr>
                <td>
                    <div class="org-name">
                        <div class="org-logo">${org.logo}</div>
                        <span>${org.name}</span>
                    </div>
                </td>
                <td>
                    <span class="plan-badge plan-${org.plan}">${org.plan}</span>
                </td>
                <td>${org.users}</td>
                <td>${org.complaints}</td>
                <td>
                    <span class="status-badge status-${org.status}">${capitalizeFirst(org.status)}</span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-icon btn-outline-primary" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-icon btn-outline-secondary" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="btn btn-sm btn-icon btn-outline-danger" title="Suspend">
                            <i class="fas fa-ban"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

// Load activity feed
function loadActivityFeed() {
    // TODO: Replace with actual API call
    setTimeout(() => {
        const activities = [
            {
                type: 'create',
                title: 'New Organization',
                description: 'Tech Solutions Inc joined the platform',
                time: '2 minutes ago'
            },
            {
                type: 'update',
                title: 'Plan Upgraded',
                description: 'Global Services upgraded to Pro plan',
                time: '15 minutes ago'
            },
            {
                type: 'login',
                title: 'Admin Login',
                description: 'Super admin logged in from 192.168.1.1',
                time: '1 hour ago'
            },
            {
                type: 'delete',
                title: 'Organization Suspended',
                description: 'Inactive Corp was suspended',
                time: '3 hours ago'
            },
            {
                type: 'create',
                title: 'New User',
                description: '45 new users registered today',
                time: '5 hours ago'
            }
        ];
        
        displayActivityFeed(activities);
    }, 600);
}

// Display activity feed
function displayActivityFeed(activities) {
    const container = $('#activityFeed');
    container.empty();
    
    activities.forEach(activity => {
        const item = `
            <div class="activity-item">
                <div class="activity-icon activity-${activity.type}">
                    <i class="fas ${getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `;
        container.append(item);
    });
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        'create': 'fa-plus-circle',
        'update': 'fa-edit',
        'delete': 'fa-trash',
        'login': 'fa-sign-in-alt'
    };
    return icons[type] || 'fa-circle';
}

// Load notifications
function loadNotifications() {
    // TODO: Replace with actual API call
    setTimeout(() => {
        const notifications = [
            {
                id: 1,
                type: 'warning',
                title: 'Server Load High',
                message: 'CPU usage reached 85% on Server 2',
                time: '10 minutes ago',
                read: false,
                icon: 'fa-server',
                color: 'warning'
            },
            {
                id: 2,
                type: 'info',
                title: 'New Organization',
                message: 'Tech Solutions Inc requested approval',
                time: '1 hour ago',
                read: false,
                icon: 'fa-building',
                color: 'primary'
            },
            {
                id: 3,
                type: 'success',
                title: 'Backup Complete',
                message: 'Daily backup completed successfully',
                time: '3 hours ago',
                read: true,
                icon: 'fa-check-circle',
                color: 'success'
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

// Initialize charts
let growthChart, revenueChart;

function initializeCharts() {
    // Growth Chart
    const growthCtx = document.getElementById('growthChart');
    if (growthCtx) {
        growthChart = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Organizations',
                        data: [42, 43, 44, 45, 46, 47, 48],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    },
                    {
                        label: 'Users',
                        data: [2400, 2500, 2600, 2650, 2750, 2800, 2834],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    },
                    {
                        label: 'Complaints',
                        data: [14500, 14800, 15000, 15200, 15400, 15600, 15672],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            size: 12
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Enterprise', 'Pro', 'Basic', 'Free'],
                datasets: [{
                    data: [45, 30, 20, 5],
                    backgroundColor: [
                        '#667eea',
                        '#8b5cf6',
                        '#3b82f6',
                        '#94a3b8'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 13,
                            weight: '600'
                        },
                        bodyFont: {
                            size: 12
                        },
                        callbacks: {
                            label: function(context) {
                                return ' ' + context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }
}

// Update charts based on period
function updateCharts(period) {
    // TODO: Fetch data based on period and update charts
    console.log('Updating charts for period:', period);
}

// Handle search
function handleSearch() {
    const query = $('#searchInput').val().toLowerCase();
    console.log('Searching for:', query);
    // TODO: Implement search functionality
}

// Get admin info
function getAdminInfo() {
    const storedInfo = localStorage.getItem('superAdminInfo');
    if (storedInfo) {
        return JSON.parse(storedInfo);
    }
    
    return {
        id: 'SA-001',
        name: 'Super Admin',
        firstName: 'Admin',
        email: 'admin@complainbox.com',
        role: 'super_admin'
    };
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

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
