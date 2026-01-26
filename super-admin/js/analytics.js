/**
 * Platform Analytics Page
 */

let charts = {};
let currentDateRange = '30days';

$(document).ready(function() {
    loadAnalytics();
});

/**
 * Handle date range change
 */
function handleDateRangeChange() {
    const range = $('#dateRange').val();
    currentDateRange = range;
    
    if (range === 'custom') {
        $('#customDateStart, #customDateEnd').show();
    } else {
        $('#customDateStart, #customDateEnd').hide();
        loadAnalytics();
    }
}

/**
 * Load all analytics data
 */
async function loadAnalytics() {
    showLoading();
    
    try {
        const params = getDateRangeParams();
        const response = await apiRequest('/super-admin/analytics', 'GET', params);
        
        if (response.success) {
            displayMetrics(response.data.metrics);
            initializeCharts(response.data);
            displayTopPerformers(response.data.top_performers);
        }
    } catch (error) {
        console.error('Error loading analytics:', error);
        // Use dummy data for demo
        useDummyData();
    }
}

/**
 * Get date range parameters
 */
function getDateRangeParams() {
    const range = $('#dateRange').val();
    
    if (range === 'custom') {
        return {
            start_date: $('#startDate').val(),
            end_date: $('#endDate').val()
        };
    }
    
    return { range: range };
}

/**
 * Display key metrics
 */
function displayMetrics(metrics) {
    $('#totalComplaints').text(formatNumber(metrics.total_complaints));
    $('#resolvedRate').text(metrics.resolution_rate + '%');
    $('#avgResponseTime').text(metrics.avg_response_time);
    $('#totalRevenue').text('$' + formatNumber(metrics.total_revenue));
    
    // Update change indicators
    updateChangeIndicator('#complaintsChange', metrics.complaints_change);
    updateChangeIndicator('#resolvedChange', metrics.resolution_rate_change);
    updateChangeIndicator('#responseChange', metrics.response_time_change, true); // true = lower is better
    updateChangeIndicator('#revenueChange', metrics.revenue_change);
    
    // Update performance metrics
    $('#avgResolutionTime').text(metrics.avg_resolution_time || '24h 30m');
    $('#firstResponseTime').text(metrics.first_response_time || '2h 15m');
    $('#customerSatisfaction').text((metrics.customer_satisfaction || 4.5) + '/5.0');
    $('#platformUptime').text((metrics.platform_uptime || 99.9) + '%');
    
    $('#resolutionTimeBar').css('width', (metrics.resolution_time_score || 85) + '%');
    $('#firstResponseBar').css('width', (metrics.first_response_score || 92) + '%');
    $('#satisfactionBar').css('width', ((metrics.customer_satisfaction || 4.5) / 5 * 100) + '%');
    $('#uptimeBar').css('width', (metrics.platform_uptime || 99.9) + '%');
}

/**
 * Update change indicator
 */
function updateChangeIndicator(selector, value, lowerIsBetter = false) {
    const $elem = $(selector);
    const isPositive = lowerIsBetter ? value < 0 : value > 0;
    
    $elem.removeClass('positive negative');
    $elem.addClass(isPositive ? 'positive' : 'negative');
    
    const icon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
    $elem.html(`<i class="fas ${icon}"></i> ${Math.abs(value)}%`);
}

/**
 * Initialize all charts
 */
function initializeCharts(data) {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    // Complaints Trend Chart
    charts.complaintsTrend = new Chart(document.getElementById('complaintsTrendChart'), {
        type: 'line',
        data: {
            labels: data.complaints_trend?.labels || [],
            datasets: [{
                label: 'Total Complaints',
                data: data.complaints_trend?.total || [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Resolved',
                data: data.complaints_trend?.resolved || [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4
            }, {
                label: 'Pending',
                data: data.complaints_trend?.pending || [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
    
    // Status Distribution Chart
    charts.statusDistribution = new Chart(document.getElementById('statusDistributionChart'), {
        type: 'doughnut',
        data: {
            labels: ['Resolved', 'In Progress', 'Pending', 'Closed'],
            datasets: [{
                data: data.status_distribution || [45, 25, 20, 10],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#6b7280'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // User Growth Chart
    charts.userGrowth = new Chart(document.getElementById('userGrowthChart'), {
        type: 'bar',
        data: {
            labels: data.user_growth?.labels || [],
            datasets: [{
                label: 'New Users',
                data: data.user_growth?.new_users || [],
                backgroundColor: '#3b82f6'
            }, {
                label: 'Active Users',
                data: data.user_growth?.active_users || [],
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Revenue Trend Chart
    charts.revenueTrend = new Chart(document.getElementById('revenueTrendChart'), {
        type: 'line',
        data: {
            labels: data.revenue_trend?.labels || [],
            datasets: [{
                label: 'Revenue',
                data: data.revenue_trend?.values || [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + formatNumber(value);
                        }
                    }
                }
            }
        }
    });
    
    // Top Categories Chart
    charts.topCategories = new Chart(document.getElementById('topCategoriesChart'), {
        type: 'horizontalBar',
        data: {
            labels: data.top_categories?.labels || [],
            datasets: [{
                label: 'Complaints',
                data: data.top_categories?.values || [],
                backgroundColor: '#8b5cf6'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Top Organizations Chart
    charts.topOrganizations = new Chart(document.getElementById('topOrganizationsChart'), {
        type: 'horizontalBar',
        data: {
            labels: data.top_organizations?.labels || [],
            datasets: [{
                label: 'Complaints',
                data: data.top_organizations?.values || [],
                backgroundColor: '#ec4899'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Display top performers
 */
function displayTopPerformers(performers) {
    const tbody = $('#topPerformersTable');
    
    if (!performers || performers.length === 0) {
        tbody.html('<tr><td colspan="4" class="text-center text-muted">No data available</td></tr>');
        return;
    }
    
    const html = performers.map((p, index) => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    ${index < 3 ? `<i class="fas fa-trophy text-warning me-2"></i>` : ''}
                    <span>${escapeHtml(p.name)}</span>
                </div>
            </td>
            <td><strong>${p.resolved_count}</strong></td>
            <td>${p.avg_resolution_time}</td>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-star text-warning me-1"></i>
                    <span>${p.rating}</span>
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.html(html);
}

/**
 * Export report
 */
async function exportReport() {
    try {
        const params = getDateRangeParams();
        params.format = 'pdf'; // or 'excel'
        
        showToast('Preparing export...', 'info');
        
        const response = await apiRequest('/super-admin/analytics/export', 'GET', params);
        
        if (response.success && response.data.url) {
            window.location.href = response.data.url;
            showToast('Export started successfully', 'success');
        }
    } catch (error) {
        console.error('Error exporting report:', error);
        showToast('Error exporting report', 'error');
    }
}

/**
 * Show loading state
 */
function showLoading() {
    // You can add loading indicators here
}

/**
 * Use dummy data for demo
 */
function useDummyData() {
    const dummyData = {
        metrics: {
            total_complaints: 8547,
            complaints_change: 12.5,
            resolution_rate: 87.3,
            resolution_rate_change: 8.3,
            avg_response_time: '3h 45m',
            response_time_change: -15.2,
            total_revenue: 284750,
            revenue_change: 23.1,
            avg_resolution_time: '24h 30m',
            first_response_time: '2h 15m',
            customer_satisfaction: 4.6,
            platform_uptime: 99.95,
            resolution_time_score: 85,
            first_response_score: 92
        },
        complaints_trend: {
            labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
            total: [120, 145, 135, 160, 155, 180, 175],
            resolved: [95, 118, 112, 138, 135, 158, 153],
            pending: [25, 27, 23, 22, 20, 22, 22]
        },
        status_distribution: [45, 25, 20, 10],
        user_growth: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            new_users: [125, 140, 135, 160],
            active_users: [850, 920, 945, 1025]
        },
        revenue_trend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values: [45000, 52000, 48000, 61000, 58000, 72000]
        },
        top_categories: {
            labels: ['Technical Issues', 'Billing', 'Service Quality', 'Feature Request', 'Account'],
            values: [245, 189, 156, 123, 98]
        },
        top_organizations: {
            labels: ['TechCorp Inc.', 'StartupHub', 'HealthPlus', 'RetailMart', 'FinanceFirst'],
            values: [187, 156, 134, 112, 98]
        },
        top_performers: [
            { name: 'John Smith', resolved_count: 247, avg_resolution_time: '18h', rating: 4.9 },
            { name: 'Sarah Johnson', resolved_count: 223, avg_resolution_time: '20h', rating: 4.8 },
            { name: 'Mike Davis', resolved_count: 198, avg_resolution_time: '22h', rating: 4.7 },
            { name: 'Emily Brown', resolved_count: 176, avg_resolution_time: '24h', rating: 4.6 },
            { name: 'David Wilson', resolved_count: 154, avg_resolution_time: '26h', rating: 4.5 }
        ]
    };
    
    displayMetrics(dummyData.metrics);
    initializeCharts(dummyData);
    displayTopPerformers(dummyData.top_performers);
}
