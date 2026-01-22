/**
 * Billing & Plans Management Page
 */

$(document).ready(function() {
    loadBillingStats();
    loadPlans();
    loadTransactions();
    
    // Filter change
    $('#statusFilterTrans').on('change', function() {
        loadTransactions();
    });
});

let currentPage = 1;
const itemsPerPage = 10;

/**
 * Load billing statistics
 */
async function loadBillingStats() {
    try {
        const response = await apiRequest('/super-admin/billing/stats', 'GET');
        
        if (response.success) {
            $('#totalRevenue').text('$' + formatNumber(response.data.total_revenue));
            $('#activeSubscriptions').text(formatNumber(response.data.active_subscriptions));
            $('#monthlyRecurring').text('$' + formatNumber(response.data.monthly_recurring));
            $('#failedPayments').text(formatNumber(response.data.failed_payments));
        }
    } catch (error) {
        console.error('Error loading billing stats:', error);
        // Use dummy data
        $('#totalRevenue').text('$284,750');
        $('#activeSubscriptions').text('156');
        $('#monthlyRecurring').text('$18,500');
        $('#failedPayments').text('3');
    }
}

/**
 * Load subscription plans
 */
async function loadPlans() {
    // Use dummy data immediately for demo
    useDummyPlans();
    
    try {
        const response = await apiRequest('/super-admin/plans', 'GET');
        
        if (response.success) {
            displayPlans(response.data.plans || response.data);
        }
    } catch (error) {
        console.error('Error loading plans:', error);
    }
}

/**
 * Display plans
 */
function displayPlans(plans) {
    const container = $('#plansContainer');
    
    if (plans.length === 0) {
        container.html('<div class="col-12 text-center py-4"><p class="text-muted">No plans available</p></div>');
        return;
    }
    
    const html = plans.map(plan => `
        <div class="col-lg-4 col-md-6">
            <div class="pricing-card ${plan.is_popular ? 'popular' : ''}">
                ${plan.is_popular ? '<div class="popular-badge">Most Popular</div>' : ''}
                <div class="pricing-header">
                    <h4 class="plan-name">${escapeHtml(plan.name)}</h4>
                    <div class="plan-price">
                        <span class="currency">$</span>
                        <span class="amount">${plan.price}</span>
                        <span class="period">/${plan.type}</span>
                    </div>
                </div>
                <div class="pricing-body">
                    <p class="text-muted small">${escapeHtml(plan.description || '')}</p>
                    <ul class="feature-list">
                        <li><i class="fas fa-users text-primary"></i> ${plan.max_users} Users</li>
                        <li><i class="fas fa-exclamation-circle text-primary"></i> ${plan.max_complaints} Complaints/month</li>
                        <li><i class="fas fa-database text-primary"></i> ${plan.storage_gb}GB Storage</li>
                        ${plan.features ? plan.features.split('\n').map(f => 
                            `<li><i class="fas fa-check text-success"></i> ${escapeHtml(f)}</li>`
                        ).join('') : ''}
                    </ul>
                </div>
                <div class="pricing-footer">
                    <div class="subscribers-count">
                        <i class="fas fa-building"></i> ${plan.subscribers_count || 0} Organizations
                    </div>
                    <div class="btn-group w-100 mt-3">
                        <button type="button" class="btn btn-outline-primary btn-sm" onclick="editPlan(${plan.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm" onclick="deletePlan(${plan.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.html(html);
}

/**
 * Load transactions
 */
async function loadTransactions(page = 1) {
    currentPage = page;
    
    const filters = {
        status: $('#statusFilterTrans').val(),
        page: currentPage,
        per_page: itemsPerPage
    };
    
    // Use dummy data immediately for demo
    useDummyTransactions();
    
    try {
        const response = await apiRequest('/super-admin/transactions', 'GET', filters);
        
        if (response.success) {
            displayTransactions(response.data.transactions || response.data);
            updatePagination(response.data.total, response.data.per_page, response.data.current_page);
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

/**
 * Display transactions
 */
function displayTransactions(transactions) {
    const tbody = $('#transactionsTableBody');
    
    if (transactions.length === 0) {
        tbody.html('<tr><td colspan="7" class="text-center py-4 text-muted">No transactions found</td></tr>');
        return;
    }
    
    const html = transactions.map(trans => `
        <tr>
            <td><code>${trans.transaction_id}</code></td>
            <td>${escapeHtml(trans.organization.name)}</td>
            <td><span class="badge bg-info">${escapeHtml(trans.plan.name)}</span></td>
            <td><strong>$${trans.amount}</strong></td>
            <td><span class="badge bg-${getTransactionStatusColor(trans.status)}">${capitalizeFirst(trans.status)}</span></td>
            <td>${formatDate(trans.created_at)}</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-primary" onclick="viewTransaction('${trans.transaction_id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    tbody.html(html);
}

/**
 * Get transaction status color
 */
function getTransactionStatusColor(status) {
    const colors = {
        'completed': 'success',
        'pending': 'warning',
        'failed': 'danger',
        'refunded': 'secondary'
    };
    return colors[status] || 'secondary';
}

/**
 * Update pagination
 */
function updatePagination(total, perPage, current) {
    const totalPages = Math.ceil(total / perPage);
    const pagination = $('#pagination');
    
    $('#paginationInfo').text(`Showing ${((current - 1) * perPage) + 1} to ${Math.min(current * perPage, total)} of ${total} transactions`);
    
    if (totalPages <= 1) {
        pagination.html('');
        return;
    }
    
    let html = `
        <li class="page-item ${current === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadTransactions(${current - 1}); return false;">Previous</a>
        </li>
    `;
    
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `
            <li class="page-item ${i === current ? 'active' : ''}">
                <a class="page-link" href="#" onclick="loadTransactions(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    html += `
        <li class="page-item ${current === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="loadTransactions(${current + 1}); return false;">Next</a>
        </li>
    `;
    
    pagination.html(html);
}

/**
 * Handle add plan
 */
async function handleAddPlan() {
    const form = document.getElementById('addPlanForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await apiRequest('/super-admin/plans', 'POST', data);
        
        if (response.success) {
            showToast('Plan added successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addPlanModal')).hide();
            form.reset();
            loadPlans();
        }
    } catch (error) {
        console.error('Error adding plan:', error);
        showToast(error.message || 'Error adding plan', 'error');
    }
}

/**
 * Edit plan
 */
async function editPlan(planId) {
    try {
        const response = await apiRequest(`/super-admin/plans/${planId}`, 'GET');
        
        if (response.success) {
            const plan = response.data;
            $('#editPlanId').val(plan.id);
            $('#editPlanName').val(plan.name);
            $('#editPlanType').val(plan.type);
            $('#editPlanPrice').val(plan.price);
            $('#editPlanMaxUsers').val(plan.max_users);
            $('#editPlanMaxComplaints').val(plan.max_complaints);
            $('#editPlanStorage').val(plan.storage_gb);
            $('#editPlanDescription').val(plan.description);
            $('#editPlanFeatures').val(plan.features);
            
            new bootstrap.Modal(document.getElementById('editPlanModal')).show();
        }
    } catch (error) {
        console.error('Error loading plan:', error);
        showToast('Error loading plan data', 'error');
    }
}

/**
 * Handle update plan
 */
async function handleUpdatePlan() {
    const form = document.getElementById('editPlanForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const planId = data.plan_id;
    delete data.plan_id;
    
    try {
        const response = await apiRequest(`/super-admin/plans/${planId}`, 'PUT', data);
        
        if (response.success) {
            showToast('Plan updated successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('editPlanModal')).hide();
            loadPlans();
        }
    } catch (error) {
        console.error('Error updating plan:', error);
        showToast(error.message || 'Error updating plan', 'error');
    }
}

/**
 * Delete plan
 */
async function deletePlan(planId) {
    if (!confirm('Are you sure you want to delete this plan? Organizations using this plan will be affected.')) {
        return;
    }
    
    try {
        const response = await apiRequest(`/super-admin/plans/${planId}`, 'DELETE');
        
        if (response.success) {
            showToast('Plan deleted successfully', 'success');
            loadPlans();
        }
    } catch (error) {
        console.error('Error deleting plan:', error);
        showToast('Error deleting plan', 'error');
    }
}

/**
 * View transaction
 */
async function viewTransaction(transactionId) {
    try {
        const response = await apiRequest(`/super-admin/transactions/${transactionId}`, 'GET');
        
        if (response.success) {
            const trans = response.data;
            const content = `
                <div class="transaction-details">
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="text-muted small">Transaction ID</label>
                            <p><code>${trans.transaction_id}</code></p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Status</label>
                            <p><span class="badge bg-${getTransactionStatusColor(trans.status)}">${capitalizeFirst(trans.status)}</span></p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Organization</label>
                            <p>${escapeHtml(trans.organization.name)}</p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Plan</label>
                            <p>${escapeHtml(trans.plan.name)}</p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Amount</label>
                            <p class="fw-bold">$${trans.amount}</p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Payment Method</label>
                            <p>${trans.payment_method || 'N/A'}</p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Date</label>
                            <p>${formatDate(trans.created_at)}</p>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small">Invoice</label>
                            <p><a href="${trans.invoice_url}" target="_blank">Download PDF</a></p>
                        </div>
                    </div>
                </div>
            `;
            
            $('#viewTransactionContent').html(content);
            new bootstrap.Modal(document.getElementById('viewTransactionModal')).show();
        }
    } catch (error) {
        console.error('Error loading transaction:', error);
        showToast('Error loading transaction details', 'error');
    }
}

/**
 * Export transactions
 */
async function exportTransactions() {
    try {
        showToast('Preparing export...', 'info');
        const response = await apiRequest('/super-admin/transactions/export', 'GET');
        
        if (response.success && response.data.url) {
            window.location.href = response.data.url;
            showToast('Export started', 'success');
        }
    } catch (error) {
        console.error('Error exporting transactions:', error);
        showToast('Error exporting transactions', 'error');
    }
}

/**
 * Use dummy plans
 */
function useDummyPlans() {
    const dummyPlans = [
        {
            id: 1,
            name: 'Basic',
            type: 'monthly',
            price: 49,
            max_users: 10,
            max_complaints: 100,
            storage_gb: 5,
            description: 'Perfect for small teams',
            features: 'Email Support\n24/7 Support\nBasic Analytics',
            subscribers_count: 45,
            is_popular: false
        },
        {
            id: 2,
            name: 'Professional',
            type: 'monthly',
            price: 149,
            max_users: 50,
            max_complaints: 500,
            storage_gb: 50,
            description: 'Ideal for growing organizations',
            features: 'Priority Support\nAdvanced Analytics\nCustom Branding\nAPI Access',
            subscribers_count: 89,
            is_popular: true
        },
        {
            id: 3,
            name: 'Enterprise',
            type: 'monthly',
            price: 499,
            max_users: -1,
            max_complaints: -1,
            storage_gb: 500,
            description: 'For large enterprises',
            features: 'Dedicated Support\nAdvanced Security\nWhite Label\nUnlimited Everything',
            subscribers_count: 22,
            is_popular: false
        }
    ];
    
    displayPlans(dummyPlans);
}

/**
 * Use dummy transactions
 */
function useDummyTransactions() {
    const dummyTransactions = [
        {
            transaction_id: 'TXN-2026-001234',
            organization: { name: 'TechCorp Inc.' },
            plan: { name: 'Professional' },
            amount: 149,
            status: 'completed',
            created_at: '2026-01-22 08:30:00'
        },
        {
            transaction_id: 'TXN-2026-001235',
            organization: { name: 'StartupHub' },
            plan: { name: 'Basic' },
            amount: 49,
            status: 'completed',
            created_at: '2026-01-21 14:22:00'
        },
        {
            transaction_id: 'TXN-2026-001236',
            organization: { name: 'HealthPlus Medical' },
            plan: { name: 'Enterprise' },
            amount: 499,
            status: 'pending',
            created_at: '2026-01-21 09:15:00'
        },
        {
            transaction_id: 'TXN-2026-001237',
            organization: { name: 'RetailMart' },
            plan: { name: 'Professional' },
            amount: 149,
            status: 'failed',
            created_at: '2026-01-20 16:45:00'
        },
        {
            transaction_id: 'TXN-2026-001238',
            organization: { name: 'FinanceFirst Bank' },
            plan: { name: 'Enterprise' },
            amount: 499,
            status: 'completed',
            created_at: '2026-01-20 11:30:00'
        },
        {
            transaction_id: 'TXN-2026-001239',
            organization: { name: 'EduLearn Platform' },
            plan: { name: 'Basic' },
            amount: 49,
            status: 'completed',
            created_at: '2026-01-19 10:20:00'
        },
        {
            transaction_id: 'TXN-2026-001240',
            organization: { name: 'LogiTrack Solutions' },
            plan: { name: 'Professional' },
            amount: 149,
            status: 'completed',
            created_at: '2026-01-19 08:15:00'
        },
        {
            transaction_id: 'TXN-2026-001241',
            organization: { name: 'MarketPro Agency' },
            plan: { name: 'Professional' },
            amount: 149,
            status: 'refunded',
            created_at: '2026-01-18 15:40:00'
        },
        {
            transaction_id: 'TXN-2026-001242',
            organization: { name: 'BuildRight Construction' },
            plan: { name: 'Basic' },
            amount: 49,
            status: 'completed',
            created_at: '2026-01-18 12:10:00'
        },
        {
            transaction_id: 'TXN-2026-001243',
            organization: { name: 'Grand Hotel Group' },
            plan: { name: 'Enterprise' },
            amount: 499,
            status: 'completed',
            created_at: '2026-01-17 09:30:00'
        },
        {
            transaction_id: 'TXN-2026-001244',
            organization: { name: 'Rodriguez & Partners' },
            plan: { name: 'Professional' },
            amount: 149,
            status: 'failed',
            created_at: '2026-01-17 07:20:00'
        },
        {
            transaction_id: 'TXN-2026-001245',
            organization: { name: 'Moore Consulting' },
            plan: { name: 'Basic' },
            amount: 49,
            status: 'completed',
            created_at: '2026-01-16 14:55:00'
        }
    ];
    
    displayTransactions(dummyTransactions);
    updatePagination(dummyTransactions.length, itemsPerPage, currentPage);
}
