/**
 * Users Management Page
 */

$(document).ready(function() {
    loadUserStats();
    loadUsers();
    loadOrganizationsForFilters();
    
    // Search functionality
    $('#searchUsers, #globalSearch').on('input', debounce(function() {
        loadUsers();
    }, 300));
    
    // Filter changes
    $('#roleFilter, #statusFilter, #orgFilter').on('change', function() {
        loadUsers();
    });
});

// Current pagination state
let currentPage = 1;
const itemsPerPage = 10;
let totalUsers = 0;
let allUsers = [];

/**
 * Load user statistics
 */
async function loadUserStats() {
    // Use dummy data for demo
    $('#totalUsers').text('1,247');
    $('#activeUsers').text('1,089');
    $('#newUsers').text('89');
    $('#suspendedUsers').text('12');
    
    try {
        const response = await apiRequest('/super-admin/users/stats', 'GET');
        
        if (response.success) {
            $('#totalUsers').text(formatNumber(response.data.total));
            $('#activeUsers').text(formatNumber(response.data.active));
            $('#newUsers').text(formatNumber(response.data.new_this_month));
            $('#suspendedUsers').text(formatNumber(response.data.suspended));
        }
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
}

/**
 * Load users with filters
 */
async function loadUsers(page = 1) {
    currentPage = page;
    
    const filters = {
        search: $('#searchUsers').val() || $('#globalSearch').val(),
        role: $('#roleFilter').val(),
        status: $('#statusFilter').val(),
        organization_id: $('#orgFilter').val(),
        page: currentPage,
        per_page: itemsPerPage
    };
    
    // Use dummy data immediately for demo
    useDummyData();
    
    try {
        const response = await apiRequest('/super-admin/users', 'GET', filters);
        
        if (response.success) {
            allUsers = response.data.users;
            totalUsers = response.data.total;
            displayUsers(allUsers);
            updatePagination(response.data.total, response.data.per_page, response.data.current_page);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

/**
 * Display users in table
 */
function displayUsers(users) {
    const tbody = $('#usersTableBody');
    
    if (users.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No users found</p>
                </td>
            </tr>
        `);
        return;
    }
    
    const html = users.map(user => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="user-avatar-sm me-2">
                        ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : `<i class="fas fa-user"></i>`}
                    </div>
                    <div>
                        <div class="fw-medium">${escapeHtml(user.name)}</div>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(user.email)}</td>
            <td>
                <span class="badge bg-${getRoleBadgeColor(user.role)}">${getRoleLabel(user.role)}</span>
            </td>
            <td>${user.organization ? escapeHtml(user.organization.name) : '<span class="text-muted">N/A</span>'}</td>
            <td>
                <span class="badge bg-${getStatusColor(user.status)}">${capitalizeFirst(user.status)}</span>
            </td>
            <td>${formatDate(user.created_at)}</td>
            <td>${user.last_active ? formatRelativeTime(user.last_active) : '<span class="text-muted">Never</span>'}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewUser(${user.id})" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-warning" onclick="editUser(${user.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-${user.status === 'active' ? 'danger' : 'success'}" 
                            onclick="toggleUserStatus(${user.id}, '${user.status}')" 
                            title="${user.status === 'active' ? 'Suspend' : 'Activate'}">
                        <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.html(html);
}

/**
 * Update pagination
 */
function updatePagination(total, perPage, current) {
    const totalPages = Math.ceil(total / perPage);
    const pagination = $('#pagination');
    
    $('#paginationInfo').text(`Showing ${((current - 1) * perPage) + 1} to ${Math.min(current * perPage, total)} of ${total} users`);
    
    if (totalPages <= 1) {
        pagination.html('');
        return;
    }
    
    let html = `
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadUsers(${current - 1}); return false;">Previous</a>
        </li>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= current - 2 && i <= current + 2)) {
            html += `
                <li class="page-item ${i === current ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="loadUsers(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === current - 3 || i === current + 3) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    html += `
        <li class="page-item ${current === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadUsers(${current + 1}); return false;">Next</a>
        </li>
    `;
    
    pagination.html(html);
}

/**
 * Load organizations for filters
 */
async function loadOrganizationsForFilters() {
    try {
        let orgs = [];
        try {
            const response = await apiRequest('/super-admin/organizations', 'GET');
            if (response.success) {
                orgs = response.data.organizations || response.data;
            }
        } catch (apiError) {
            // Fallback to extracting organizations from users
            const orgMap = new Map();
            allUsers.forEach(user => {
                if (user.organization) {
                    orgMap.set(user.organization.id, user.organization);
                }
            });
            orgs = Array.from(orgMap.values());
        }
        
        if (orgs.length > 0) {
            const selects = $('#orgFilter, #addUserOrgSelect, #editUserOrg');
            
            const options = orgs.map(org => 
                `<option value="${org.id}">${escapeHtml(org.name)}</option>`
            ).join('');
            
            $('#orgFilter').append(options);
            $('#addUserOrgSelect, #editUserOrg').html('<option value="">Select Organization</option>' + options);
        }
    } catch (error) {
        console.error('Error loading organizations:', error);
    }
}

/**
 * View user details
 */
async function viewUser(userId) {
    try {
        // Try API first, fallback to local data
        let user;
        try {
            const response = await apiRequest(`/super-admin/users/${userId}`, 'GET');
            if (response.success) {
                user = response.data;
            }
        } catch (apiError) {
            // Fallback to local dummy data
            user = allUsers.find(u => u.id === userId);
        }
        
        if (user) {
            const content = `
                <div class="row g-3">
                    <div class="col-md-12 text-center mb-3">
                        <div class="user-avatar-lg mx-auto mb-3">
                            ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}">` : `<i class="fas fa-user"></i>`}
                        </div>
                        <h5>${escapeHtml(user.name)}</h5>
                        <p class="text-muted">${escapeHtml(user.email)}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Role</label>
                        <p class="fw-medium">${getRoleLabel(user.role)}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Status</label>
                        <p><span class="badge bg-${getStatusColor(user.status)}">${capitalizeFirst(user.status)}</span></p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Organization</label>
                        <p class="fw-medium">${user.organization ? escapeHtml(user.organization.name) : 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Phone</label>
                        <p class="fw-medium">${user.phone || 'N/A'}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Joined Date</label>
                        <p class="fw-medium">${formatDate(user.created_at)}</p>
                    </div>
                    <div class="col-md-6">
                        <label class="text-muted small">Last Active</label>
                        <p class="fw-medium">${user.last_active ? formatRelativeTime(user.last_active) : 'Never'}</p>
                    </div>
                    <div class="col-md-12">
                        <label class="text-muted small">Activity Stats</label>
                        <div class="row g-2 mt-1">
                            <div class="col-4">
                                <div class="stat-box">
                                    <div class="stat-value">${user.complaints_count || 0}</div>
                                    <div class="stat-label">Complaints</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="stat-box">
                                    <div class="stat-value">${user.resolved_count || 0}</div>
                                    <div class="stat-label">Resolved</div>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="stat-box">
                                    <div class="stat-value">${user.login_count || 0}</div>
                                    <div class="stat-label">Logins</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            $('#viewUserContent').html(content);
            new bootstrap.Modal(document.getElementById('viewUserModal')).show();
        }
    } catch (error) {
        console.error('Error loading user details:', error);
        showToast('Error loading user details', 'error');
    }
}

/**
 * Edit user
 */
async function editUser(userId) {
    try {
        // Try API first, fallback to local data
        let user;
        try {
            const response = await apiRequest(`/super-admin/users/${userId}`, 'GET');
            if (response.success) {
                user = response.data;
            }
        } catch (apiError) {
            // Fallback to local dummy data
            user = allUsers.find(u => u.id === userId);
        }
        
        if (user) {
            $('#editUserId').val(user.id);
            $('#editUserName').val(user.name);
            $('#editUserEmail').val(user.email);
            $('#editUserRole').val(user.role);
            $('#editUserOrg').val(user.organization ? user.organization.id : '');
            
            new bootstrap.Modal(document.getElementById('editUserModal')).show();
        } else {
            showToast('User not found', 'error');
        }
    } catch (error) {
        console.error('Error loading user:', error);
        showToast('Error loading user data', 'error');
    }
}

/**
 * Handle add user
 */
async function handleAddUser() {
    const form = document.getElementById('addUserForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await apiRequest('/super-admin/users', 'POST', data);
        
        if (response.success) {
            showToast('User added successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
            form.reset();
            loadUsers();
            loadUserStats();
        }
    } catch (error) {
        console.error('Error adding user:', error);
        showToast(error.message || 'Error adding user', 'error');
    }
}

/**
 * Handle update user
 */
async function handleUpdateUser() {
    const form = document.getElementById('editUserForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const userId = data.user_id;
    delete data.user_id;
    
    try {
        let success = false;
        try {
            const response = await apiRequest(`/super-admin/users/${userId}`, 'PUT', data);
            success = response.success;
        } catch (apiError) {
            // Fallback to local update
            const userIndex = allUsers.findIndex(u => u.id == userId);
            if (userIndex !== -1) {
                allUsers[userIndex] = { ...allUsers[userIndex], ...data };
                displayUsers(allUsers);
                success = true;
            }
        }
        
        if (success) {
            showToast('User updated successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
            loadUsers();
        }
    } catch (error) {
        console.error('Error updating user:', error);
        showToast(error.message || 'Error updating user', 'error');
    }
}

/**
 * Toggle user status (suspend/activate)
 */
async function toggleUserStatus(userId, currentStatus) {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    const confirmMsg = `Are you sure you want to ${action} this user?`;
    
    if (!confirm(confirmMsg)) return;
    
    try {
        let success = false;
        try {
            const response = await apiRequest(`/super-admin/users/${userId}/${action}`, 'POST');
            success = response.success;
        } catch (apiError) {
            // Fallback to local update
            const userIndex = allUsers.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                allUsers[userIndex].status = action === 'activate' ? 'active' : 'suspended';
                displayUsers(allUsers);
                success = true;
            }
        }
        
        if (success) {
            showToast(`User ${action}d successfully`, 'success');
            loadUsers(currentPage);
            loadUserStats();
        }
    } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        showToast(`Error ${action}ing user`, 'error');
    }
}

/**
 * Delete user
 */
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        return;
    }
    
    try {
        let success = false;
        try {
            const response = await apiRequest(`/super-admin/users/${userId}`, 'DELETE');
            success = response.success;
        } catch (apiError) {
            // Fallback to local delete
            const userIndex = allUsers.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                allUsers.splice(userIndex, 1);
                displayUsers(allUsers);
                totalUsers = allUsers.length;
                success = true;
            }
        }
        
        if (success) {
            showToast('User deleted successfully', 'success');
            loadUsers(currentPage);
            loadUserStats();
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Error deleting user', 'error');
    }
}

/**
 * Export users
 */
async function exportUsers() {
    try {
        const filters = {
            search: $('#searchUsers').val() || $('#globalSearch').val(),
            role: $('#roleFilter').val(),
            status: $('#statusFilter').val(),
            organization_id: $('#orgFilter').val()
        };
        
        showToast('Preparing export...', 'info');
        
        try {
            const response = await apiRequest('/super-admin/users/export', 'GET', filters);
            if (response.success && response.data.url) {
                window.location.href = response.data.url;
                showToast('Export started', 'success');
                return;
            }
        } catch (apiError) {
            // Fallback to local CSV export
            exportUsersToCSV();
        }
    } catch (error) {
        console.error('Error exporting users:', error);
        showToast('Error exporting users', 'error');
    }
}

/**
 * Reset filters
 */
function resetFilters() {
    $('#searchUsers').val('');
    $('#roleFilter').val('');
    $('#statusFilter').val('');
    $('#orgFilter').val('');
    loadUsers(1);
}

/**
 * Export users to CSV (client-side fallback)
 */
function exportUsersToCSV() {
    // Prepare CSV data
    const headers = ['ID', 'Name', 'Email', 'Role', 'Organization', 'Status', 'Created At', 'Last Active'];
    const rows = allUsers.map(user => [
        user.id,
        user.name,
        user.email,
        getRoleLabel(user.role),
        user.organization ? user.organization.name : 'N/A',
        capitalizeFirst(user.status),
        formatDate(user.created_at),
        user.last_active ? formatDate(user.last_active) : 'Never'
    ]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\\n';
    rows.forEach(row => {
        csvContent += row.map(cell => `\"${cell}\"`).join(',') + '\\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Users exported successfully', 'success');
}

/**
 * Get role badge color
 */
function getRoleBadgeColor(role) {
    const colors = {
        'org_admin': 'primary',
        'resolver': 'info',
        'user': 'secondary'
    };
    return colors[role] || 'secondary';
}

/**
 * Get role label
 */
function getRoleLabel(role) {
    const labels = {
        'org_admin': 'Organization Admin',
        'resolver': 'Resolver',
        'user': 'User'
    };
    return labels[role] || role;
}

/**
 * Get status color
 */
function getStatusColor(status) {
    const colors = {
        'active': 'success',
        'suspended': 'danger',
        'pending': 'warning'
    };
    return colors[status] || 'secondary';
}

/**
 * Use dummy data for demo
 */
function useDummyData() {
    console.log('Loading dummy user data...');
    
    const dummyUsers = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@techcorp.com',
            role: 'org_admin',
            organization: { id: 1, name: 'TechCorp Inc.' },
            status: 'active',
            created_at: '2024-01-15 10:30:00',
            last_active: '2026-01-22 09:15:00',
            avatar: null
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.j@startup.io',
            role: 'resolver',
            organization: { id: 2, name: 'StartupHub' },
            status: 'active',
            created_at: '2024-03-20 14:22:00',
            last_active: '2026-01-21 16:45:00',
            avatar: null
        },
        {
            id: 3,
            name: 'Mike Davis',
            email: 'mike.d@healthcare.com',
            role: 'user',
            organization: { id: 3, name: 'HealthPlus Medical' },
            status: 'active',
            created_at: '2024-06-10 09:00:00',
            last_active: '2026-01-20 11:30:00',
            avatar: null
        },
        {
            id: 4,
            name: 'Emily Brown',
            email: 'emily.b@retail.com',
            role: 'org_admin',
            organization: { id: 4, name: 'RetailMart' },
            status: 'suspended',
            created_at: '2024-02-28 13:45:00',
            last_active: '2026-01-15 08:20:00',
            avatar: null
        },
        {
            id: 5,
            name: 'David Wilson',
            email: 'david.w@finance.com',
            role: 'resolver',
            organization: { id: 5, name: 'FinanceFirst Bank' },
            status: 'active',
            created_at: '2024-08-05 11:15:00',
            last_active: '2026-01-22 07:50:00',
            avatar: null
        },
        {
            id: 6,
            name: 'Lisa Anderson',
            email: 'lisa.a@education.edu',
            role: 'user',
            organization: { id: 6, name: 'EduLearn Platform' },
            status: 'pending',
            created_at: '2026-01-20 16:30:00',
            last_active: null,
            avatar: null
        },
        {
            id: 7,
            name: 'Robert Chen',
            email: 'robert.c@logistics.com',
            role: 'resolver',
            organization: { id: 7, name: 'LogiTrack Solutions' },
            status: 'active',
            created_at: '2024-04-12 08:45:00',
            last_active: '2026-01-22 08:30:00',
            avatar: null
        },
        {
            id: 8,
            name: 'Jennifer Lee',
            email: 'jen.lee@marketing.agency',
            role: 'org_admin',
            organization: { id: 8, name: 'MarketPro Agency' },
            status: 'active',
            created_at: '2024-05-18 12:20:00',
            last_active: '2026-01-21 15:10:00',
            avatar: null
        },
        {
            id: 9,
            name: 'Michael Torres',
            email: 'm.torres@construction.co',
            role: 'user',
            organization: { id: 9, name: 'BuildRight Construction' },
            status: 'active',
            created_at: '2024-07-22 09:30:00',
            last_active: '2026-01-19 14:25:00',
            avatar: null
        },
        {
            id: 10,
            name: 'Amanda White',
            email: 'amanda.w@hospitality.com',
            role: 'resolver',
            organization: { id: 10, name: 'Grand Hotel Group' },
            status: 'active',
            created_at: '2024-09-05 11:00:00',
            last_active: '2026-01-22 06:45:00',
            avatar: null
        },
        {
            id: 11,
            name: 'James Rodriguez',
            email: 'j.rodriguez@legal.firm',
            role: 'user',
            organization: { id: 11, name: 'Rodriguez & Partners' },
            status: 'suspended',
            created_at: '2024-03-14 10:15:00',
            last_active: '2026-01-10 09:30:00',
            avatar: null
        },
        {
            id: 12,
            name: 'Patricia Moore',
            email: 'p.moore@consulting.biz',
            role: 'org_admin',
            organization: { id: 12, name: 'Moore Consulting' },
            status: 'active',
            created_at: '2024-11-20 13:50:00',
            last_active: '2026-01-22 10:20:00',
            avatar: null
        }
    ];
    
    allUsers = dummyUsers;
    totalUsers = dummyUsers.length;
    console.log(`Displaying ${dummyUsers.length} dummy users`);
    displayUsers(dummyUsers);
    updatePagination(totalUsers, itemsPerPage, currentPage);
}
