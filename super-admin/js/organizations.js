/* ===== ORGANIZATIONS MANAGEMENT JAVASCRIPT ===== */

let currentPage = 1;
let itemsPerPage = 10;
let allOrganizations = [];
let filteredOrganizations = [];

$(document).ready(function() {
    // Initialize page
    initOrganizationsPage();
    loadOrganizations();
    loadNotifications();
    setupEventListeners();
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Initialize page
function initOrganizationsPage() {
    const adminInfo = getAdminInfo();
    
    if (adminInfo) {
        $('#dropdownUserName').text(adminInfo.name);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search
    $('#searchInput').on('input', debounce(handleSearch, 300));
    
    // Filters
    $('#filterPlan, #filterStatus, #filterSort').on('change', applyFilters);
    $('#resetFilters').on('click', resetFilters);
    
    // Add organization
    $('#saveOrgBtn').on('click', saveNewOrganization);
    
    // Update organization
    $('#updateOrgBtn').on('click', updateOrganization);
}

// Load organizations
function loadOrganizations() {
    // TODO: Replace with actual API call
    setTimeout(() => {
        allOrganizations = [
            {
                id: 1,
                name: 'Tech Solutions Inc',
                logo: 'TS',
                industry: 'Technology',
                admin: 'John Doe',
                adminEmail: 'john@techsolutions.com',
                plan: 'enterprise',
                users: 250,
                complaints: 1234,
                status: 'active',
                created: '2023-01-15',
                address: '123 Tech Street',
                city: 'San Francisco',
                country: 'USA',
                phone: '+1-555-0123'
            },
            {
                id: 2,
                name: 'Global Services Ltd',
                logo: 'GS',
                industry: 'Services',
                admin: 'Jane Smith',
                adminEmail: 'jane@globalservices.com',
                plan: 'pro',
                users: 125,
                complaints: 567,
                status: 'active',
                created: '2023-02-20',
                address: '456 Business Ave',
                city: 'New York',
                country: 'USA',
                phone: '+1-555-0456'
            },
            {
                id: 3,
                name: 'StartUp Ventures',
                logo: 'SV',
                industry: 'Technology',
                admin: 'Mike Johnson',
                adminEmail: 'mike@startupventures.com',
                plan: 'basic',
                users: 45,
                complaints: 123,
                status: 'trial',
                created: '2024-01-10',
                address: '789 Innovation Blvd',
                city: 'Austin',
                country: 'USA',
                phone: '+1-555-0789'
            },
            {
                id: 4,
                name: 'Education Hub',
                logo: 'EH',
                industry: 'Education',
                admin: 'Sarah Williams',
                adminEmail: 'sarah@educationhub.com',
                plan: 'pro',
                users: 180,
                complaints: 892,
                status: 'active',
                created: '2023-06-12',
                address: '321 Learning Lane',
                city: 'Boston',
                country: 'USA',
                phone: '+1-555-0321'
            },
            {
                id: 5,
                name: 'Healthcare Systems',
                logo: 'HS',
                industry: 'Healthcare',
                admin: 'Dr. Robert Brown',
                adminEmail: 'robert@healthcaresystems.com',
                plan: 'enterprise',
                users: 320,
                complaints: 1567,
                status: 'active',
                created: '2023-03-08',
                address: '654 Medical Plaza',
                city: 'Chicago',
                country: 'USA',
                phone: '+1-555-0654'
            },
            {
                id: 6,
                name: 'Retail Dynamics',
                logo: 'RD',
                industry: 'Retail',
                admin: 'Emily Davis',
                adminEmail: 'emily@retaildynamics.com',
                plan: 'basic',
                users: 65,
                complaints: 234,
                status: 'active',
                created: '2023-09-18',
                address: '987 Commerce St',
                city: 'Seattle',
                country: 'USA',
                phone: '+1-555-0987'
            },
            {
                id: 7,
                name: 'Finance Partners',
                logo: 'FP',
                industry: 'Finance',
                admin: 'David Wilson',
                adminEmail: 'david@financepartners.com',
                plan: 'enterprise',
                users: 290,
                complaints: 1098,
                status: 'active',
                created: '2023-04-22',
                address: '159 Wall Street',
                city: 'New York',
                country: 'USA',
                phone: '+1-555-0159'
            },
            {
                id: 8,
                name: 'Manufacturing Corp',
                logo: 'MC',
                industry: 'Manufacturing',
                admin: 'Lisa Anderson',
                adminEmail: 'lisa@mfgcorp.com',
                plan: 'pro',
                users: 145,
                complaints: 678,
                status: 'active',
                created: '2023-07-30',
                address: '753 Industrial Way',
                city: 'Detroit',
                country: 'USA',
                phone: '+1-555-0753'
            },
            {
                id: 9,
                name: 'Consulting Group',
                logo: 'CG',
                industry: 'Consulting',
                admin: 'James Taylor',
                adminEmail: 'james@consultinggroup.com',
                plan: 'basic',
                users: 55,
                complaints: 189,
                status: 'suspended',
                created: '2023-11-05',
                address: '852 Advisory Dr',
                city: 'Miami',
                country: 'USA',
                phone: '+1-555-0852'
            },
            {
                id: 10,
                name: 'Media Network',
                logo: 'MN',
                industry: 'Media',
                admin: 'Jennifer Martinez',
                adminEmail: 'jennifer@medianetwork.com',
                plan: 'pro',
                users: 98,
                complaints: 456,
                status: 'active',
                created: '2023-08-14',
                address: '741 Broadcast Ln',
                city: 'Los Angeles',
                country: 'USA',
                phone: '+1-555-0741'
            }
        ];
        
        filteredOrganizations = [...allOrganizations];
        displayOrganizations();
        updateTotalCount(allOrganizations.length);
    }, 800);
}

// Display organizations
function displayOrganizations() {
    const tbody = $('#organizationsTable');
    tbody.empty();
    
    if (filteredOrganizations.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="fas fa-inbox text-muted mb-2" style="font-size: 3rem;"></i>
                    <p class="text-muted">No organizations found</p>
                </td>
            </tr>
        `);
        return;
    }
    
    // Pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedOrgs = filteredOrganizations.slice(start, end);
    
    paginatedOrgs.forEach(org => {
        const row = `
            <tr>
                <td>
                    <div class="org-name">
                        <div class="org-logo">${org.logo}</div>
                        <div>
                            <span class="d-block">${org.name}</span>
                            <small class="text-muted">${org.industry}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="plan-badge plan-${org.plan}">${capitalizeFirst(org.plan)}</span>
                </td>
                <td>
                    <div>
                        <span class="d-block">${org.admin}</span>
                        <small class="text-muted">${org.adminEmail}</small>
                    </div>
                </td>
                <td>${org.users}</td>
                <td>${org.complaints}</td>
                <td>${formatDate(org.created)}</td>
                <td>
                    <span class="status-badge status-${org.status}">${capitalizeFirst(org.status)}</span>
                </td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-icon btn-outline-primary" title="View Details" onclick="viewOrganization(${org.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-icon btn-outline-secondary" title="Edit" onclick="editOrganization(${org.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-icon btn-outline-${org.status === 'suspended' ? 'success' : 'warning'}" title="${org.status === 'suspended' ? 'Activate' : 'Suspend'}" onclick="toggleSuspend(${org.id})">
                            <i class="fas fa-${org.status === 'suspended' ? 'check' : 'ban'}"></i>
                        </button>
                        <button class="btn btn-sm btn-icon btn-outline-danger" title="Delete" onclick="deleteOrganization(${org.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
    
    // Update pagination
    updatePagination();
}

// Update pagination
function updatePagination() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, filteredOrganizations.length);
    
    $('#showingStart').text(start);
    $('#showingEnd').text(end);
    $('#totalCount').text(filteredOrganizations.length);
    
    const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
    const controls = $('#paginationControls');
    controls.empty();
    
    // Previous button
    controls.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">Previous</a>
        </li>
    `);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            controls.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            controls.append('<li class="page-item disabled"><a class="page-link" href="#">...</a></li>');
        }
    }
    
    // Next button
    controls.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">Next</a>
        </li>
    `);
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayOrganizations();
        window.scrollTo(0, 0);
    }
}

// Handle search
function handleSearch() {
    const query = $('#searchInput').val().toLowerCase();
    
    if (query === '') {
        filteredOrganizations = [...allOrganizations];
    } else {
        filteredOrganizations = allOrganizations.filter(org => 
            org.name.toLowerCase().includes(query) ||
            org.admin.toLowerCase().includes(query) ||
            org.adminEmail.toLowerCase().includes(query) ||
            org.industry.toLowerCase().includes(query)
        );
    }
    
    currentPage = 1;
    displayOrganizations();
}

// Apply filters
function applyFilters() {
    const planFilter = $('#filterPlan').val();
    const statusFilter = $('#filterStatus').val();
    const sortBy = $('#filterSort').val();
    
    filteredOrganizations = allOrganizations.filter(org => {
        const planMatch = !planFilter || org.plan === planFilter;
        const statusMatch = !statusFilter || org.status === statusFilter;
        return planMatch && statusMatch;
    });
    
    // Sort
    filteredOrganizations.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'users':
                return b.users - a.users;
            case 'complaints':
                return b.complaints - a.complaints;
            case 'created':
                return new Date(b.created) - new Date(a.created);
            default:
                return 0;
        }
    });
    
    currentPage = 1;
    displayOrganizations();
}

// Reset filters
function resetFilters() {
    $('#filterPlan').val('');
    $('#filterStatus').val('');
    $('#filterSort').val('name');
    $('#searchInput').val('');
    
    filteredOrganizations = [...allOrganizations];
    currentPage = 1;
    displayOrganizations();
}

// View organization details
function viewOrganization(id) {
    const org = allOrganizations.find(o => o.id === id);
    if (!org) return;
    
    const content = `
        <div class="row g-4">
            <div class="col-md-6">
                <div class="org-detail-section">
                    <h6><i class="fas fa-building me-2"></i>Basic Information</h6>
                    <div class="detail-item">
                        <span class="detail-label">Organization Name:</span>
                        <span class="detail-value">${org.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Industry:</span>
                        <span class="detail-value">${org.industry}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Created Date:</span>
                        <span class="detail-value">${formatDate(org.created)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Status:</span>
                        <span class="status-badge status-${org.status}">${capitalizeFirst(org.status)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Plan:</span>
                        <span class="plan-badge plan-${org.plan}">${capitalizeFirst(org.plan)}</span>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="org-detail-section">
                    <h6><i class="fas fa-user me-2"></i>Admin Information</h6>
                    <div class="detail-item">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${org.admin}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${org.adminEmail}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${org.phone}</span>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="org-detail-section">
                    <h6><i class="fas fa-chart-bar me-2"></i>Statistics</h6>
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-icon bg-primary">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${org.users}</div>
                                    <div class="stat-label">Total Users</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-icon bg-warning">
                                    <i class="fas fa-exclamation-circle"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${org.complaints}</div>
                                    <div class="stat-label">Total Complaints</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="stat-card">
                                <div class="stat-icon bg-success">
                                    <i class="fas fa-check-circle"></i>
                                </div>
                                <div class="stat-info">
                                    <div class="stat-value">${Math.floor(org.complaints * 0.75)}</div>
                                    <div class="stat-label">Resolved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12">
                <div class="org-detail-section">
                    <h6><i class="fas fa-map-marker-alt me-2"></i>Location</h6>
                    <div class="detail-item">
                        <span class="detail-label">Address:</span>
                        <span class="detail-value">${org.address}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">City:</span>
                        <span class="detail-value">${org.city}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Country:</span>
                        <span class="detail-value">${org.country}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#orgDetailsContent').html(content);
    new bootstrap.Modal(document.getElementById('viewOrgModal')).show();
}

// Edit organization
function editOrganization(id) {
    const org = allOrganizations.find(o => o.id === id);
    if (!org) return;
    
    $('#editOrgId').val(org.id);
    $('#editOrgName').val(org.name);
    $('#editOrgPlan').val(org.plan);
    $('#editOrgStatus').val(org.status);
    
    new bootstrap.Modal(document.getElementById('editOrgModal')).show();
}

// Save new organization
function saveNewOrganization() {
    // TODO: Implement save logic with API call
    alert('Organization creation functionality will be connected to backend API');
    bootstrap.Modal.getInstance(document.getElementById('addOrgModal')).hide();
}

// Update organization
function updateOrganization() {
    const id = parseInt($('#editOrgId').val());
    const name = $('#editOrgName').val();
    const plan = $('#editOrgPlan').val();
    const status = $('#editOrgStatus').val();
    
    // TODO: Replace with actual API call
    const orgIndex = allOrganizations.findIndex(o => o.id === id);
    if (orgIndex !== -1) {
        allOrganizations[orgIndex].name = name;
        allOrganizations[orgIndex].plan = plan;
        allOrganizations[orgIndex].status = status;
        
        applyFilters();
        showToast('Success', 'Organization updated successfully', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editOrgModal')).hide();
    }
}

// Toggle suspend
function toggleSuspend(id) {
    const org = allOrganizations.find(o => o.id === id);
    if (!org) return;
    
    const action = org.status === 'suspended' ? 'activate' : 'suspend';
    
    if (confirm(`Are you sure you want to ${action} ${org.name}?`)) {
        // TODO: Replace with actual API call
        org.status = org.status === 'suspended' ? 'active' : 'suspended';
        applyFilters();
        showToast('Success', `Organization ${action}d successfully`, 'success');
    }
}

// Delete organization
function deleteOrganization(id) {
    const org = allOrganizations.find(o => o.id === id);
    if (!org) return;
    
    if (confirm(`Are you sure you want to delete ${org.name}? This action cannot be undone.`)) {
        // TODO: Replace with actual API call
        allOrganizations = allOrganizations.filter(o => o.id !== id);
        filteredOrganizations = filteredOrganizations.filter(o => o.id !== id);
        displayOrganizations();
        updateTotalCount(allOrganizations.length);
        showToast('Success', 'Organization deleted successfully', 'success');
    }
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
    $(`.notification-item[data-id="${id}"]`).removeClass('unread').addClass('read').find('.notification-dot').remove();
    const currentCount = parseInt($('#notificationCount').text()) || 0;
    updateNotificationCount(Math.max(0, currentCount - 1));
}

// Mark all as read
function markAllAsRead() {
    $('.notification-item.unread').removeClass('unread').addClass('read').find('.notification-dot').remove();
    updateNotificationCount(0);
}

// Update total count
function updateTotalCount(count) {
    $('.nav-item .badge').first().text(count);
}

// Show toast notification
function showToast(title, message, type = 'info') {
    // Simple alert for now, can be replaced with toast library
    alert(`${title}: ${message}`);
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
        email: 'admin@complainbox.com',
        role: 'super_admin'
    };
}

// Utility functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
