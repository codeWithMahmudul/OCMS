/**
 * Organization Admin Dashboard JavaScript
 * Handles dashboard data loading, charts, and interactions
 */

// Charts instances
let complaintsChart;
let departmentChart;

// Initialize dashboard when document is ready
$(document).ready(function() {
    // Load dashboard data
    loadDashboardStats();
    loadRecentComplaints();
    loadTopResolvers();
    
    // Initialize charts
    initComplaintsChart();
    initDepartmentChart();
    
    // Setup event listeners
    setupEventListeners();
    
    // Refresh data every 5 minutes
    setInterval(() => {
        loadDashboardStats();
        loadRecentComplaints();
        loadTopResolvers();
    }, 300000);
});

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
    // In production, fetch from API: fetch(API_ENDPOINTS.dashboard.stats)
    
    // Mock data for demonstration
    setTimeout(() => {
        const stats = {
            totalComplaints: 245,
            pendingComplaints: 48,
            resolvedComplaints: 187,
            activeUsers: 156
        };
        
        // Animate counters
        animateCounter('totalComplaints', stats.totalComplaints);
        animateCounter('pendingComplaints', stats.pendingComplaints);
        animateCounter('resolvedComplaints', stats.resolvedComplaints);
        animateCounter('activeUsers', stats.activeUsers);
    }, 500);
}

/**
 * Animate counter from 0 to target value
 */
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000; // 1 second
    const steps = 50;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, duration / steps);
}

/**
 * Load recent complaints table
 */
function loadRecentComplaints() {
    const tableBody = $('#recentComplaintsTable');
    
    // In production, fetch from API: fetch(API_ENDPOINTS.complaints.list)
    
    // Mock data for demonstration
    setTimeout(() => {
        const complaints = [
            {
                id: 'CMP-1245',
                title: 'Internet connectivity issues in office',
                department: 'IT',
                priority: 'high',
                status: 'pending',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000)
            },
            {
                id: 'CMP-1244',
                title: 'AC not working in conference room',
                department: 'Maintenance',
                priority: 'medium',
                status: 'in-progress',
                date: new Date(Date.now() - 5 * 60 * 60 * 1000)
            },
            {
                id: 'CMP-1243',
                title: 'Printer malfunction in 3rd floor',
                department: 'IT',
                priority: 'low',
                status: 'resolved',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
                id: 'CMP-1242',
                title: 'Water leak in washroom',
                department: 'Maintenance',
                priority: 'high',
                status: 'in-progress',
                date: new Date(Date.now() - 3 * 60 * 60 * 1000)
            },
            {
                id: 'CMP-1241',
                title: 'Software license renewal required',
                department: 'IT',
                priority: 'medium',
                status: 'pending',
                date: new Date(Date.now() - 6 * 60 * 60 * 1000)
            }
        ];
        
        if (complaints.length === 0) {
            tableBody.html(`
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <h5>No complaints yet</h5>
                            <p>Complaints will appear here once they are submitted.</p>
                        </div>
                    </td>
                </tr>
            `);
            return;
        }
        
        let html = '';
        complaints.forEach(complaint => {
            html += `
                <tr data-complaint-id="${complaint.id}">
                    <td><span class="complaint-id">${complaint.id}</span></td>
                    <td>${truncateText(complaint.title, 40)}</td>
                    <td><span class="department-badge">${complaint.department}</span></td>
                    <td>${getPriorityBadge(complaint.priority)}</td>
                    <td>${getStatusBadge(complaint.status)}</td>
                    <td>${timeAgo(complaint.date)}</td>
                    <td>
                        <button class="action-icon-btn" title="View Details" onclick="viewComplaint('${complaint.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-icon-btn" title="Edit" onclick="editComplaint('${complaint.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.html(html);
        
        // Add click handler for table rows
        tableBody.find('tr').click(function(e) {
            if (!$(e.target).closest('button').length) {
                const complaintId = $(this).data('complaint-id');
                viewComplaint(complaintId);
            }
        });
    }, 800);
}

/**
 * Load top resolvers list
 */
function loadTopResolvers() {
    const resolversList = $('#topResolversList');
    
    // In production, fetch from API: fetch(API_ENDPOINTS.dashboard.topResolvers)
    
    // Mock data for demonstration
    setTimeout(() => {
        const resolvers = [
            {
                id: 1,
                name: 'John Doe',
                resolved: 45,
                avgTime: '2.3h',
                rating: 4.8
            },
            {
                id: 2,
                name: 'Jane Smith',
                resolved: 38,
                avgTime: '3.1h',
                rating: 4.6
            },
            {
                id: 3,
                name: 'Mike Johnson',
                resolved: 32,
                avgTime: '2.8h',
                rating: 4.5
            },
            {
                id: 4,
                name: 'Sarah Williams',
                resolved: 28,
                avgTime: '3.5h',
                rating: 4.3
            },
            {
                id: 5,
                name: 'David Brown',
                resolved: 25,
                avgTime: '4.2h',
                rating: 4.2
            }
        ];
        
        if (resolvers.length === 0) {
            resolversList.html(`
                <div class="empty-state">
                    <i class="fas fa-user-tie"></i>
                    <h5>No resolvers yet</h5>
                    <p>Add resolvers to start handling complaints.</p>
                </div>
            `);
            return;
        }
        
        let html = '';
        resolvers.forEach(resolver => {
            const initials = resolver.name.split(' ').map(n => n[0]).join('');
            html += `
                <div class="resolver-item">
                    <div class="resolver-avatar">${initials}</div>
                    <div class="resolver-info">
                        <h6 class="resolver-name">${resolver.name}</h6>
                        <div class="resolver-stats">
                            <span class="resolver-stat">
                                <i class="fas fa-check-circle"></i> ${resolver.resolved} resolved
                            </span>
                            <span class="resolver-stat">
                                <i class="fas fa-clock"></i> ${resolver.avgTime}
                            </span>
                        </div>
                    </div>
                    <div class="resolver-badge">${resolver.rating} ★</div>
                </div>
            `;
        });
        
        resolversList.html(html);
    }, 1000);
}

/**
 * Initialize complaints overview chart
 */
function initComplaintsChart() {
    const ctx = document.getElementById('complaintsChart');
    if (!ctx) return;
    
    // Mock data - in production, fetch from API
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Submitted',
                data: [12, 19, 15, 25, 22, 18, 14],
                borderColor: CONFIG.CHART_COLORS.primary,
                backgroundColor: CONFIG.CHART_COLORS.primary + '20',
                tension: 0.4
            },
            {
                label: 'Resolved',
                data: [8, 15, 12, 20, 18, 15, 12],
                borderColor: CONFIG.CHART_COLORS.success,
                backgroundColor: CONFIG.CHART_COLORS.success + '20',
                tension: 0.4
            },
            {
                label: 'Pending',
                data: [4, 4, 3, 5, 4, 3, 2],
                borderColor: CONFIG.CHART_COLORS.warning,
                backgroundColor: CONFIG.CHART_COLORS.warning + '20',
                tension: 0.4
            }
        ]
    };
    
    complaintsChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

/**
 * Initialize department performance chart
 */
function initDepartmentChart() {
    const ctx = document.getElementById('departmentChart');
    if (!ctx) return;
    
    // Mock data - in production, fetch from API
    const data = {
        labels: ['IT', 'Maintenance', 'HR', 'Finance', 'Admin'],
        datasets: [{
            data: [35, 28, 15, 12, 10],
            backgroundColor: CONFIG.CHART_COLORS.all,
            borderWidth: 0
        }]
    };
    
    departmentChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Chart period buttons
    $('.btn-group[role="group"] button').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        
        const period = $(this).data('period');
        updateComplaintsChart(period);
    });
}

/**
 * Update complaints chart based on selected period
 */
function updateComplaintsChart(period) {
    if (!complaintsChart) return;
    
    // Mock data - in production, fetch from API based on period
    let labels, submitted, resolved, pending;
    
    switch(period) {
        case 'week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            submitted = [12, 19, 15, 25, 22, 18, 14];
            resolved = [8, 15, 12, 20, 18, 15, 12];
            pending = [4, 4, 3, 5, 4, 3, 2];
            break;
        case 'month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            submitted = [85, 92, 78, 88];
            resolved = [70, 78, 65, 72];
            pending = [15, 14, 13, 16];
            break;
        case 'year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            submitted = [245, 268, 289, 312, 295, 320, 310, 298, 285, 290, 305, 315];
            resolved = [220, 242, 265, 285, 270, 295, 288, 275, 268, 272, 285, 295];
            pending = [25, 26, 24, 27, 25, 25, 22, 23, 17, 18, 20, 20];
            break;
    }
    
    complaintsChart.data.labels = labels;
    complaintsChart.data.datasets[0].data = submitted;
    complaintsChart.data.datasets[1].data = resolved;
    complaintsChart.data.datasets[2].data = pending;
    complaintsChart.update();
}

/**
 * View complaint details
 */
function viewComplaint(complaintId) {
    // Redirect to complaint details page
    window.location.href = `complaints.html?id=${complaintId}`;
}

/**
 * Edit complaint
 */
function editComplaint(complaintId) {
    // Redirect to edit complaint page
    window.location.href = `complaints.html?id=${complaintId}&action=edit`;
}
