/* ===== COMPLAINTS LIST JAVASCRIPT ===== */

let currentPage = 1;
let itemsPerPage = 10;
let allComplaints = [];
let filteredComplaints = [];
let currentView = 'grid'; // 'grid' or 'list'

$(document).ready(function() {
    initComplaintsPage();
    loadComplaints();
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

// Initialize page
function initComplaintsPage() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const priority = urlParams.get('priority');
    const search = urlParams.get('search');
    
    // Update page title based on filter
    updatePageTitle(status);
    
    // Set active sidebar item
    updateActiveSidebar(status);
    
    // Set filter values
    if (status) {
        $('#filterStatus').val(status);
    }
    if (priority) {
        $('#filterPriority').val(priority);
    }
    if (search) {
        $('#searchInput').val(search);
    }
    
    // Get resolver info
    const resolverInfo = getResolverInfo();
    $('#resolverName').text(resolverInfo.name);
}

// Update page title
function updatePageTitle(status) {
    let title = 'All Complaints';
    
    if (status === 'pending') title = 'Pending Complaints';
    else if (status === 'in-progress') title = 'In Progress Complaints';
    else if (status === 'resolved') title = 'Resolved Complaints';
    else if (status === 'spam') title = 'Spam Complaints';
    
    $('#pageTitle').text(title);
    $('#listTitle').text(title);
}

// Update active sidebar item
function updateActiveSidebar(status) {
    $('.sidebar-nav .nav-item').removeClass('active');
    
    if (!status) {
        $('#nav-all').addClass('active');
    } else if (status === 'pending') {
        $('#nav-pending').addClass('active');
    } else if (status === 'in-progress') {
        $('#nav-in-progress').addClass('active');
    } else if (status === 'resolved') {
        $('#nav-resolved').addClass('active');
    } else if (status === 'spam') {
        $('#nav-spam').addClass('active');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search
    $('#searchInput').on('input', debounce(handleSearch, 300));
    
    // Filters
    $('#filterStatus').on('change', applyFilters);
    $('#filterPriority').on('change', applyFilters);
    $('#filterSort').on('change', applyFilters);
    $('#clearFilters').on('click', clearFilters);
    
    // View toggle
    $('#viewGrid').on('click', () => switchView('grid'));
    $('#viewList').on('click', () => switchView('list'));
    
    // Mobile sidebar
    $('#mobileToggle').on('click', function() {
        $('#sidebar').toggleClass('show');
    });
    
    // Setup sidebar collapse/expand toggle
    $('#sidebarToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const sidebar = $('#sidebar');
        const icon = $(this).find('i');
        
        sidebar.toggleClass('collapsed');
        
        // Toggle icon
        if (sidebar.hasClass('collapsed')) {
            icon.removeClass('fa-times').addClass('fa-bars');
            localStorage.setItem('sidebarCollapsed', 'true');
        } else {
            icon.removeClass('fa-bars').addClass('fa-times');
            localStorage.removeItem('sidebarCollapsed');
        }
    });
    
    // Restore sidebar state from localStorage
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        const sidebar = $('#sidebar');
        const icon = $('#sidebarToggle').find('i');
        sidebar.addClass('collapsed');
        icon.removeClass('fa-times').addClass('fa-bars');
    }
}

// Load complaints
async function loadComplaints() {
    try {
        showLoading();
        
        const complaints = await fetchComplaints();
        allComplaints = complaints;
        
        // Update sidebar counts
        updateSidebarCounts();
        
        // Apply filters
        applyFilters();
        
    } catch (error) {
        console.error('Error loading complaints:', error);
        showError();
    }
}

// Fetch complaints from API
async function fetchComplaints() {
    // TODO: Replace with actual API call
    // const response = await fetch(`${CONFIG.API_BASE_URL}/resolver/complaints`);
    // return await response.json();
    
    // Mock data for development
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'CMP-2024-001',
                    title: 'Broken classroom AC unit in Room 301',
                    description: 'The air conditioning unit in classroom 301 has been malfunctioning for the past week. It makes loud noises and fails to cool the room adequately.',
                    priority: 'high',
                    status: 'pending',
                    category: 'Facilities',
                    date: '2024-01-20T10:30:00',
                    user: 'Anonymous',
                    attachments: []
                },
                {
                    id: 'CMP-2024-002',
                    title: 'Library internet connectivity issues',
                    description: 'WiFi in the library keeps disconnecting. Multiple students are experiencing this issue.',
                    priority: 'medium',
                    status: 'in-progress',
                    category: 'Technology',
                    date: '2024-01-20T09:15:00',
                    user: 'John Doe',
                    attachments: []
                },
                {
                    id: 'CMP-2024-003',
                    title: 'Cafeteria hygiene concern',
                    description: 'Tables in the cafeteria are not being cleaned properly between lunch periods.',
                    priority: 'urgent',
                    status: 'pending',
                    category: 'Health & Safety',
                    date: '2024-01-19T14:20:00',
                    user: 'Anonymous',
                    attachments: []
                },
                {
                    id: 'CMP-2024-004',
                    title: 'Parking lot lighting not working',
                    description: 'Several lights in the north parking lot are out, making it unsafe at night.',
                    priority: 'low',
                    status: 'in-progress',
                    category: 'Security',
                    date: '2024-01-19T16:45:00',
                    user: 'Jane Smith',
                    attachments: []
                },
                {
                    id: 'CMP-2024-005',
                    title: 'Computer lab software outdated',
                    description: 'Software in computer lab B needs to be updated for coursework.',
                    priority: 'medium',
                    status: 'resolved',
                    category: 'Technology',
                    date: '2024-01-18T11:00:00',
                    user: 'Mike Johnson',
                    attachments: []
                },
                {
                    id: 'CMP-2024-006',
                    title: 'Leaking pipe in restroom',
                    description: 'There is a leaking pipe in the second-floor restroom near the science lab.',
                    priority: 'high',
                    status: 'in-progress',
                    category: 'Facilities',
                    date: '2024-01-18T08:30:00',
                    user: 'Anonymous',
                    attachments: []
                },
                {
                    id: 'CMP-2024-007',
                    title: 'Spam complaint example',
                    description: 'This is a spam complaint for testing.',
                    priority: 'low',
                    status: 'spam',
                    category: 'Other',
                    date: '2024-01-17T13:00:00',
                    user: 'Spam User',
                    attachments: []
                },
                {
                    id: 'CMP-2024-008',
                    title: 'Gym equipment maintenance needed',
                    description: 'Several pieces of gym equipment need maintenance and inspection.',
                    priority: 'medium',
                    status: 'resolved',
                    category: 'Facilities',
                    date: '2024-01-17T10:00:00',
                    user: 'Sarah Williams',
                    attachments: []
                }
            ]);
        }, 800);
    });
}

// Update sidebar counts
function updateSidebarCounts() {
    const counts = {
        total: allComplaints.length,
        pending: allComplaints.filter(c => c.status === 'pending').length,
        inProgress: allComplaints.filter(c => c.status === 'in-progress').length,
        resolved: allComplaints.filter(c => c.status === 'resolved').length,
        spam: allComplaints.filter(c => c.status === 'spam').length
    };
    
    $('#totalComplaints').text(counts.total);
    $('#pendingCount').text(counts.pending);
    $('#inProgressCount').text(counts.inProgress);
    $('#resolvedCount').text(counts.resolved);
    $('#spamCount').text(counts.spam);
}

// Apply filters
function applyFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = $('#filterStatus').val() || urlParams.get('status') || '';
    const priorityFilter = $('#filterPriority').val() || urlParams.get('priority') || '';
    const searchQuery = $('#searchInput').val().toLowerCase() || '';
    const sortBy = $('#filterSort').val() || 'newest';
    
    // Filter complaints
    filteredComplaints = allComplaints.filter(complaint => {
        const matchesStatus = !statusFilter || complaint.status === statusFilter;
        const matchesPriority = !priorityFilter || complaint.priority === priorityFilter;
        const matchesSearch = !searchQuery || 
            complaint.title.toLowerCase().includes(searchQuery) ||
            complaint.id.toLowerCase().includes(searchQuery) ||
            complaint.description.toLowerCase().includes(searchQuery);
        
        return matchesStatus && matchesPriority && matchesSearch;
    });
    
    // Sort complaints
    sortComplaints(sortBy);
    
    // Reset to first page
    currentPage = 1;
    
    // Display results
    displayComplaints();
}

// Sort complaints
function sortComplaints(sortBy) {
    switch(sortBy) {
        case 'newest':
            filteredComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredComplaints.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'priority-high':
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            filteredComplaints.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
            break;
        case 'priority-low':
            const priorityOrderLow = { urgent: 4, high: 3, medium: 2, low: 1 };
            filteredComplaints.sort((a, b) => priorityOrderLow[a.priority] - priorityOrderLow[b.priority]);
            break;
    }
}

// Display complaints
function displayComplaints() {
    hideLoading();
    
    if (filteredComplaints.length === 0) {
        showEmptyState();
        return;
    }
    
    hideEmptyState();
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const complaintsToShow = filteredComplaints.slice(startIndex, endIndex);
    
    // Update result count
    $('#resultCount').text(`Showing ${filteredComplaints.length} complaint${filteredComplaints.length !== 1 ? 's' : ''}`);
    
    // Display based on view
    if (currentView === 'grid') {
        displayGridView(complaintsToShow);
    } else {
        displayListView(complaintsToShow);
    }
    
    // Update pagination
    updatePagination();
}

// Display grid view
function displayGridView(complaints) {
    $('#complaintsGrid').show().empty();
    $('#complaintsList').hide();
    
    complaints.forEach(complaint => {
        const card = createComplaintCard(complaint);
        $('#complaintsGrid').append(card);
    });
}

// Create complaint card
function createComplaintCard(complaint) {
    const priorityClass = `priority-${complaint.priority}`;
    const statusClass = `status-${complaint.status}`;
    
    return `
        <div class="complaint-card" onclick="viewComplaintDetail('${complaint.id}')">
            <div class="complaint-card-header">
                <span class="complaint-id">${complaint.id}</span>
                <span class="priority-badge ${priorityClass}">${complaint.priority}</span>
            </div>
            <h6 class="complaint-card-title">${complaint.title}</h6>
            <p class="complaint-card-desc">${truncateText(complaint.description, 100)}</p>
            <div class="complaint-card-footer">
                <div class="d-flex align-items-center gap-2">
                    <span class="status-badge ${statusClass}">${complaint.status.replace('-', ' ')}</span>
                    <small class="text-muted">${formatDate(complaint.date)}</small>
                </div>
                <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); viewComplaintDetail('${complaint.id}')">
                    View <i class="fas fa-arrow-right ms-1"></i>
                </button>
            </div>
        </div>
    `;
}

// Display list view
function displayListView(complaints) {
    $('#complaintsList').show();
    $('#complaintsGrid').hide();
    
    const tbody = $('#complaintsTableBody');
    tbody.empty();
    
    complaints.forEach(complaint => {
        const row = createComplaintRow(complaint);
        tbody.append(row);
    });
}

// Create complaint table row
function createComplaintRow(complaint) {
    const priorityClass = `priority-${complaint.priority}`;
    const statusClass = `status-${complaint.status}`;
    
    return `
        <tr onclick="viewComplaintDetail('${complaint.id}')" style="cursor: pointer;">
            <td><span class="complaint-id">${complaint.id}</span></td>
            <td><span class="complaint-title">${complaint.title}</span></td>
            <td><span class="priority-badge ${priorityClass}">${complaint.priority}</span></td>
            <td><span class="status-badge ${statusClass}">${complaint.status.replace('-', ' ')}</span></td>
            <td>${formatDate(complaint.date)}</td>
            <td>${complaint.user}</td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-sm btn-view action-btn-sm" onclick="event.stopPropagation(); viewComplaintDetail('${complaint.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${complaint.status !== 'resolved' && complaint.status !== 'spam' ? `
                        <button class="btn btn-sm btn-resolve action-btn-sm" onclick="event.stopPropagation(); quickResolve('${complaint.id}')" title="Mark as Resolved">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `;
}

// Switch view
function switchView(view) {
    currentView = view;
    
    if (view === 'grid') {
        $('#viewGrid').addClass('active');
        $('#viewList').removeClass('active');
    } else {
        $('#viewList').addClass('active');
        $('#viewGrid').removeClass('active');
    }
    
    displayComplaints();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
    
    if (totalPages <= 1) {
        $('#paginationContainer').hide();
        return;
    }
    
    $('#paginationContainer').show();
    
    // Update showing text
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredComplaints.length);
    $('#showingFrom').text(startIndex);
    $('#showingTo').text(endIndex);
    $('#totalResults').text(filteredComplaints.length);
    
    // Generate pagination
    const pagination = $('#pagination');
    pagination.empty();
    
    // Previous button
    pagination.append(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pagination.append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pagination.append(`<li class="page-item disabled"><span class="page-link">...</span></li>`);
        }
    }
    
    // Next button
    pagination.append(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `);
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayComplaints();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle search
function handleSearch() {
    applyFilters();
}

// Clear filters
function clearFilters() {
    $('#filterStatus').val('');
    $('#filterPriority').val('');
    $('#searchInput').val('');
    $('#filterSort').val('newest');
    
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
    
    updatePageTitle('');
    updateActiveSidebar('');
    applyFilters();
}

// View complaint detail
function viewComplaintDetail(complaintId) {
    // Find complaint
    const complaint = allComplaints.find(c => c.id === complaintId);
    if (!complaint) return;
    
    // Show modal with complaint details
    window.showComplaintDetail(complaint);
}

// Quick resolve
async function quickResolve(complaintId) {
    if (!confirm('Are you sure you want to mark this complaint as resolved?')) {
        return;
    }
    
    try {
        // TODO: API call to update status
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update local data
        const complaint = allComplaints.find(c => c.id === complaintId);
        if (complaint) {
            complaint.status = 'resolved';
        }
        
        showToast('Success', 'Complaint marked as resolved', 'success');
        
        // Reload display
        updateSidebarCounts();
        applyFilters();
        
    } catch (error) {
        console.error('Error resolving complaint:', error);
        showToast('Error', 'Failed to resolve complaint', 'error');
    }
}

// Utility functions
function showLoading() {
    $('#loadingState').show();
    $('#complaintsGrid').hide();
    $('#complaintsList').hide();
    $('#emptyState').hide();
    $('#paginationContainer').hide();
}

function hideLoading() {
    $('#loadingState').hide();
}

function showEmptyState() {
    $('#emptyState').show();
    $('#complaintsGrid').hide();
    $('#complaintsList').hide();
    $('#paginationContainer').hide();
}

function hideEmptyState() {
    $('#emptyState').hide();
}

function showError() {
    hideLoading();
    $('#emptyState').html(`
        <i class="fas fa-exclamation-circle text-danger"></i>
        <h5>Error Loading Complaints</h5>
        <p>Failed to load complaints. Please refresh the page.</p>
        <button class="btn btn-primary" onclick="location.reload()">Refresh</button>
    `).show();
}

function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
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
