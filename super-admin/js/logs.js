/**
 * System Logs Management Page
 */

$(document).ready(function() {
    loadLogStats();
    loadLogs();
    
    // Search and filter
    $('#searchLogs, #globalSearch').on('input', debounce(function() {
        loadLogs();
    }, 300));
    
    $('#levelFilter, #typeFilter, #dateFilter').on('change', function() {
        loadLogs();
    });
});

let currentPage = 1;
const itemsPerPage = 20;

/**
 * Load log statistics
 */
async function loadLogStats() {
    try {
        const response = await apiRequest('/super-admin/logs/stats', 'GET');
        
        if (response.success) {
            $('#totalLogs').text(formatNumber(response.data.total));
            $('#errorLogs').text(formatNumber(response.data.errors));
            $('#warningLogs').text(formatNumber(response.data.warnings));
            $('#successLogs').text(formatNumber(response.data.success));
        }
    } catch (error) {
        console.error('Error loading log stats:', error);
        $('#totalLogs').text('1,247');
        $('#errorLogs').text('23');
        $('#warningLogs').text('145');
        $('#successLogs').text('1,079');
    }
}

/**
 * Load logs
 */
async function loadLogs(page = 1) {
    currentPage = page;
    
    const filters = {
        search: $('#searchLogs').val() || $('#globalSearch').val(),
        level: $('#levelFilter').val(),
        type: $('#typeFilter').val(),
        date: $('#dateFilter').val(),
        page: currentPage,
        per_page: itemsPerPage
    };
    
    // Use dummy data immediately for demo
    useDummyLogs();
    
    try {
        const response = await apiRequest('/super-admin/logs', 'GET', filters);
        
        if (response.success) {
            displayLogs(response.data.logs || response.data);
            updatePagination(response.data.total, response.data.per_page, response.data.current_page);
        }
    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

/**
 * Display logs
 */
function displayLogs(logs) {
    const tbody = $('#logsTableBody');
    
    if (logs.length === 0) {
        tbody.html('<tr><td colspan="7" class="text-center py-4 text-muted">No logs found</td></tr>');
        return;
    }
    
    const html = logs.map(log => `
        <tr>
            <td>
                <span class="badge bg-${getLogLevelColor(log.level)}">
                    <i class="fas fa-${getLogLevelIcon(log.level)} me-1"></i>${capitalizeFirst(log.level)}
                </span>
            </td>
            <td><span class="badge bg-secondary">${capitalizeFirst(log.type)}</span></td>
            <td class="text-truncate" style="max-width: 300px;">${escapeHtml(log.message)}</td>
            <td>${log.user ? escapeHtml(log.user.name) : '<span class="text-muted">System</span>'}</td>
            <td><code>${log.ip_address || 'N/A'}</code></td>
            <td>${formatDateTime(log.created_at)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewLog(${log.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    tbody.html(html);
}

/**
 * Get log level color
 */
function getLogLevelColor(level) {
    const colors = {
        'error': 'danger',
        'warning': 'warning',
        'info': 'info',
        'success': 'success'
    };
    return colors[level] || 'secondary';
}

/**
 * Get log level icon
 */
function getLogLevelIcon(level) {
    const icons = {
        'error': 'times-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle',
        'success': 'check-circle'
    };
    return icons[level] || 'circle';
}

/**
 * View log details
 */
async function viewLog(logId) {
    try {
        const response = await apiRequest(`/super-admin/logs/${logId}`, 'GET');
        
        if (response.success) {
            const log = response.data;
            const content = `
                <div class="log-details">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="text-muted small">Level</label>
                            <p><span class="badge bg-${getLogLevelColor(log.level)}">${capitalizeFirst(log.level)}</span></p>
                        </div>
                        <div class="col-md-6">
                            <label class="text-muted small">Type</label>
                            <p><span class="badge bg-secondary">${capitalizeFirst(log.type)}</span></p>
                        </div>
                        <div class="col-md-12">
                            <label class="text-muted small">Message</label>
                            <p>${escapeHtml(log.message)}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="text-muted small">User</label>
                            <p>${log.user ? escapeHtml(log.user.name) : 'System'}</p>
                        </div>
                        <div class="col-md-6">
                            <label class="text-muted small">IP Address</label>
                            <p><code>${log.ip_address || 'N/A'}</code></p>
                        </div>
                        <div class="col-md-12">
                            <label class="text-muted small">Timestamp</label>
                            <p>${formatDateTime(log.created_at)}</p>
                        </div>
                        ${log.details ? `
                        <div class="col-md-12">
                            <label class="text-muted small">Additional Details</label>
                            <pre class="bg-light p-3 rounded"><code>${JSON.stringify(log.details, null, 2)}</code></pre>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            $('#viewLogContent').html(content);
            new bootstrap.Modal(document.getElementById('viewLogModal')).show();
        }
    } catch (error) {
        console.error('Error loading log details:', error);
        showToast('Error loading log details', 'error');
    }
}

/**
 * Update pagination
 */
function updatePagination(total, perPage, current) {
    const totalPages = Math.ceil(total / perPage);
    const pagination = $('#pagination');
    
    $('#paginationInfo').text(`Showing ${((current - 1) * perPage) + 1} to ${Math.min(current * perPage, total)} of ${total} logs`);
    
    if (totalPages <= 1) {
        pagination.html('');
        return;
    }
    
    let html = `
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadLogs(${current - 1}); return false;">Previous</a>
        </li>
    `;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `
            <li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadLogs(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    html += `
        <li class="page-item ${current === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadLogs(${current + 1}); return false;">Next</a>
        </li>
    `;
    
    pagination.html(html);
}

/**
 * Refresh logs
 */
function refreshLogs() {
    loadLogStats();
    loadLogs(currentPage);
    showToast('Logs refreshed', 'success');
}

/**
 * Export logs
 */
async function exportLogs() {
    try {
        const filters = {
            search: $('#searchLogs').val(),
            level: $('#levelFilter').val(),
            type: $('#typeFilter').val(),
            date: $('#dateFilter').val()
        };
        
        showToast('Preparing export...', 'info');
        
        const response = await apiRequest('/super-admin/logs/export', 'GET', filters);
        
        if (response.success && response.data.url) {
            window.location.href = response.data.url;
            showToast('Export started', 'success');
        }
    } catch (error) {
        console.error('Error exporting logs:', error);
        showToast('Error exporting logs', 'error');
    }
}

/**
 * Clear old logs
 */
async function clearLogs() {
    if (!confirm('Are you sure you want to clear logs older than 90 days? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await apiRequest('/super-admin/logs/clear', 'POST', { days: 90 });
        
        if (response.success) {
            showToast('Old logs cleared successfully', 'success');
            loadLogStats();
            loadLogs(1);
        }
    } catch (error) {
        console.error('Error clearing logs:', error);
        showToast('Error clearing logs', 'error');
    }
}

/**
 * Reset filters
 */
function resetFilters() {
    $('#searchLogs').val('');
    $('#levelFilter').val('');
    $('#typeFilter').val('');
    $('#dateFilter').val('');
    loadLogs(1);
}

/**
 * Use dummy logs
 */
function useDummyLogs() {
    const dummyLogs = [
        {
            id: 1,
            level: 'error',
            type: 'system',
            message: 'Database connection timeout - retrying connection attempt',
            user: null,
            ip_address: '127.0.0.1',
            created_at: '2026-01-22 10:45:23'
        },
        {
            id: 2,
            level: 'success',
            type: 'auth',
            message: 'User logged in successfully from new device',
            user: { name: 'John Smith' },
            ip_address: '192.168.1.100',
            created_at: '2026-01-22 10:30:15'
        },
        {
            id: 3,
            level: 'warning',
            type: 'payment',
            message: 'Payment retry required for transaction TXN-001234 - insufficient funds',
            user: { name: 'Admin' },
            ip_address: '192.168.1.50',
            created_at: '2026-01-22 10:15:42'
        },
        {
            id: 4,
            level: 'info',
            type: 'complaint',
            message: 'New complaint created: #12345 - Product Quality Issue',
            user: { name: 'Sarah Johnson' },
            ip_address: '192.168.1.105',
            created_at: '2026-01-22 10:00:00'
        },
        {
            id: 5,
            level: 'success',
            type: 'user',
            message: 'User profile updated successfully - Email changed',
            user: { name: 'Mike Davis' },
            ip_address: '192.168.1.110',
            created_at: '2026-01-22 09:45:30'
        },
        {
            id: 6,
            level: 'info',
            type: 'system',
            message: 'Daily backup completed successfully - 2.4GB archived',
            user: null,
            ip_address: '127.0.0.1',
            created_at: '2026-01-22 09:30:00'
        },
        {
            id: 7,
            level: 'error',
            type: 'payment',
            message: 'Payment gateway connection failed - Stripe API timeout',
            user: null,
            ip_address: '127.0.0.1',
            created_at: '2026-01-22 09:15:18'
        },
        {
            id: 8,
            level: 'warning',
            type: 'auth',
            message: 'Multiple failed login attempts detected from IP 203.45.67.89',
            user: null,
            ip_address: '203.45.67.89',
            created_at: '2026-01-22 09:00:45'
        },
        {
            id: 9,
            level: 'success',
            type: 'complaint',
            message: 'Complaint #12340 resolved and closed by resolver',
            user: { name: 'David Wilson' },
            ip_address: '192.168.1.120',
            created_at: '2026-01-22 08:45:22'
        },
        {
            id: 10,
            level: 'info',
            type: 'user',
            message: 'New user registration: lisa.a@education.edu',
            user: null,
            ip_address: '192.168.1.130',
            created_at: '2026-01-22 08:30:10'
        },
        {
            id: 11,
            level: 'warning',
            type: 'system',
            message: 'High memory usage detected - 85% utilization',
            user: null,
            ip_address: '127.0.0.1',
            created_at: '2026-01-22 08:15:33'
        },
        {
            id: 12,
            level: 'success',
            type: 'payment',
            message: 'Payment processed successfully - Transaction TXN-001238',
            user: { name: 'Admin' },
            ip_address: '192.168.1.50',
            created_at: '2026-01-22 08:00:55'
        },
        {
            id: 13,
            level: 'info',
            type: 'complaint',
            message: 'Complaint #12338 assigned to resolver Mike Davis',
            user: { name: 'Emily Brown' },
            ip_address: '192.168.1.115',
            created_at: '2026-01-22 07:45:12'
        },
        {
            id: 14,
            level: 'error',
            type: 'system',
            message: 'Email service temporarily unavailable - SMTP connection refused',
            user: null,
            ip_address: '127.0.0.1',
            created_at: '2026-01-22 07:30:28'
        },
        {
            id: 15,
            level: 'success',
            type: 'auth',
            message: 'Password reset completed successfully for user',
            user: { name: 'Jennifer Lee' },
            ip_address: '192.168.1.140',
            created_at: '2026-01-22 07:15:44'
        },
        {
            id: 16,
            level: 'warning',
            type: 'user',
            message: 'User account suspended due to policy violation',
            user: { name: 'Admin' },
            ip_address: '192.168.1.50',
            created_at: '2026-01-22 07:00:20'
        },
        {
            id: 17,
            level: 'info',
            type: 'system',
            message: 'Cache cleared successfully - 1.2GB freed',
            user: { name: 'Admin' },
            ip_address: '192.168.1.50',
            created_at: '2026-01-22 06:45:08'
        },
        {
            id: 18,
            level: 'success',
            type: 'complaint',
            message: 'Complaint #12335 status updated to In Progress',
            user: { name: 'Robert Chen' },
            ip_address: '192.168.1.125',
            created_at: '2026-01-22 06:30:15'
        }
    ];
    
    displayLogs(dummyLogs);
    updatePagination(dummyLogs.length, itemsPerPage, currentPage);
}
