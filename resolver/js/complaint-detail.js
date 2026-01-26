/* ===== COMPLAINT DETAIL MODAL JAVASCRIPT ===== */

let currentComplaint = null;

// Show complaint detail modal
function showComplaintDetail(complaint) {
    currentComplaint = complaint;
    
    // Update modal content
    $('#modalComplaintId').text(complaint.id);
    $('#modalComplaintTitle').text(complaint.title);
    $('#modalDescription').text(complaint.description);
    $('#modalUser').text(complaint.user);
    $('#modalDate').text(formatDateTime(complaint.date));
    $('#modalCategory').text(complaint.category);
    
    // Update badges
    const priorityClass = `priority-${complaint.priority}`;
    $('#modalPriority').attr('class', `priority-badge ${priorityClass}`).text(complaint.priority);
    
    const statusClass = `status-${complaint.status}`;
    $('#modalStatus').attr('class', `status-badge ${statusClass}`).text(complaint.status.replace('-', ' '));
    
    // Set status dropdown
    $('#updateStatus').val(complaint.status);
    
    // Handle attachments
    if (complaint.attachments && complaint.attachments.length > 0) {
        $('#attachmentsSection').show();
        displayAttachments(complaint.attachments);
    } else {
        $('#attachmentsSection').hide();
    }
    
    // Load timeline
    loadComplaintTimeline(complaint.id);
    
    // Disable actions for spam/resolved
    if (complaint.status === 'spam' || complaint.status === 'resolved') {
        $('#updateStatus').prop('disabled', true);
        $('#saveStatusBtn').prop('disabled', true);
        $('#addNoteBtn').prop('disabled', true);
        $('#markResolvedBtn').prop('disabled', true);
        $('#markSpamBtn').prop('disabled', true);
    } else {
        $('#updateStatus').prop('disabled', false);
        $('#saveStatusBtn').prop('disabled', false);
        $('#addNoteBtn').prop('disabled', false);
        $('#markResolvedBtn').prop('disabled', false);
        $('#markSpamBtn').prop('disabled', false);
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('complaintDetailModal'));
    modal.show();
}

// Display attachments
function displayAttachments(attachments) {
    const container = $('#modalAttachments');
    container.empty();
    
    attachments.forEach(attachment => {
        const isImage = attachment.type.startsWith('image/');
        
        if (isImage) {
            container.append(`
                <a href="${attachment.url}" target="_blank" class="attachment-thumbnail">
                    <img src="${attachment.url}" alt="${attachment.name}">
                </a>
            `);
        } else {
            container.append(`
                <a href="${attachment.url}" target="_blank" class="attachment-file">
                    <i class="fas fa-file"></i>
                    <span>${attachment.name}</span>
                </a>
            `);
        }
    });
}

// Load complaint timeline
async function loadComplaintTimeline(complaintId) {
    try {
        const timeline = await fetchComplaintTimeline(complaintId);
        displayTimeline(timeline);
    } catch (error) {
        console.error('Error loading timeline:', error);
        $('#modalTimeline').html('<div class="text-danger small">Failed to load timeline</div>');
    }
}

// Fetch complaint timeline
async function fetchComplaintTimeline(complaintId) {
    // TODO: Replace with actual API call
    // const response = await fetch(`${CONFIG.API_BASE_URL}/complaints/${complaintId}/timeline`);
    // return await response.json();
    
    // Mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    type: 'created',
                    title: 'Complaint Submitted',
                    description: 'Complaint was submitted by user',
                    user: 'System',
                    timestamp: '2024-01-20T10:30:00'
                },
                {
                    type: 'assigned',
                    title: 'Assigned to Resolver',
                    description: 'Complaint assigned to Sarah Johnson',
                    user: 'System',
                    timestamp: '2024-01-20T10:35:00'
                },
                {
                    type: 'status',
                    title: 'Status Updated',
                    description: 'Status changed to In Progress',
                    user: 'Sarah Johnson',
                    timestamp: '2024-01-20T11:00:00'
                },
                {
                    type: 'note',
                    title: 'Note Added',
                    description: 'Investigating the issue. Will provide update soon.',
                    user: 'Sarah Johnson',
                    timestamp: '2024-01-20T11:15:00'
                }
            ]);
        }, 300);
    });
}

// Display timeline
function displayTimeline(timeline) {
    const container = $('#modalTimeline');
    container.empty();
    
    if (timeline.length === 0) {
        container.html('<div class="text-muted small">No activity yet</div>');
        return;
    }
    
    timeline.forEach(item => {
        const icon = getTimelineIcon(item.type);
        const timelineItem = `
            <div class="timeline-item">
                <div class="timeline-icon ${item.type}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="timeline-content">
                    <h6>${item.title}</h6>
                    <p class="mb-1">${item.description}</p>
                    <small class="text-muted">${formatDateTime(item.timestamp)} • ${item.user}</small>
                </div>
            </div>
        `;
        container.append(timelineItem);
    });
}

// Get timeline icon
function getTimelineIcon(type) {
    const icons = {
        created: 'fa-file-alt',
        assigned: 'fa-user-check',
        status: 'fa-sync-alt',
        note: 'fa-comment',
        resolved: 'fa-check-circle',
        spam: 'fa-ban'
    };
    return icons[type] || 'fa-circle';
}

// Update status
$('#saveStatusBtn').on('click', async function() {
    if (!currentComplaint) return;
    
    const newStatus = $('#updateStatus').val();
    
    if (newStatus === currentComplaint.status) {
        showToast('Info', 'Status is already set to ' + newStatus, 'info');
        return;
    }
    
    try {
        const btn = $(this);
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Updating...').prop('disabled', true);
        
        // TODO: API call to update status
        // await fetch(`${CONFIG.API_BASE_URL}/complaints/${currentComplaint.id}/status`, {
        //     method: 'PUT',
        //     body: JSON.stringify({ status: newStatus })
        // });
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update local data
        currentComplaint.status = newStatus;
        
        // Update UI
        const statusClass = `status-${newStatus}`;
        $('#modalStatus').attr('class', `status-badge ${statusClass}`).text(newStatus.replace('-', ' '));
        
        showToast('Success', 'Status updated successfully', 'success');
        
        // Reload timeline
        loadComplaintTimeline(currentComplaint.id);
        
        // Reset button
        btn.html(originalHtml).prop('disabled', false);
        
        // Refresh complaints list if on complaints page
        if (typeof applyFilters === 'function') {
            updateSidebarCounts();
            applyFilters();
        }
        
    } catch (error) {
        console.error('Error updating status:', error);
        showToast('Error', 'Failed to update status', 'error');
        $('#saveStatusBtn').html('<i class="fas fa-save me-2"></i>Update Status').prop('disabled', false);
    }
});

// Add note
$('#addNoteBtn').on('click', async function() {
    if (!currentComplaint) return;
    
    const note = $('#resolverNote').val().trim();
    
    if (!note) {
        showToast('Warning', 'Please enter a note', 'warning');
        return;
    }
    
    try {
        const btn = $(this);
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Adding...').prop('disabled', true);
        
        // TODO: API call to add note
        // await fetch(`${CONFIG.API_BASE_URL}/complaints/${currentComplaint.id}/notes`, {
        //     method: 'POST',
        //     body: JSON.stringify({ note: note })
        // });
        
        await new Promise(resolve => setTimeout(resolve, 600));
        
        showToast('Success', 'Note added successfully', 'success');
        
        // Clear textarea
        $('#resolverNote').val('');
        
        // Reload timeline
        loadComplaintTimeline(currentComplaint.id);
        
        // Reset button
        btn.html(originalHtml).prop('disabled', false);
        
    } catch (error) {
        console.error('Error adding note:', error);
        showToast('Error', 'Failed to add note', 'error');
        $('#addNoteBtn').html('<i class="fas fa-plus me-2"></i>Add Note').prop('disabled', false);
    }
});

// Mark as resolved
$('#markResolvedBtn').on('click', async function() {
    if (!currentComplaint) return;
    
    if (!confirm('Are you sure you want to mark this complaint as resolved?')) {
        return;
    }
    
    try {
        const btn = $(this);
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...').prop('disabled', true);
        
        // TODO: API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Update status
        currentComplaint.status = 'resolved';
        $('#updateStatus').val('resolved');
        
        const statusClass = 'status-resolved';
        $('#modalStatus').attr('class', `status-badge ${statusClass}`).text('resolved');
        
        showToast('Success', 'Complaint marked as resolved', 'success');
        
        // Disable actions
        $('#updateStatus').prop('disabled', true);
        $('#saveStatusBtn').prop('disabled', true);
        $('#addNoteBtn').prop('disabled', true);
        $('#markResolvedBtn').prop('disabled', true);
        $('#markSpamBtn').prop('disabled', true);
        
        // Reload timeline
        loadComplaintTimeline(currentComplaint.id);
        
        // Refresh complaints list
        if (typeof applyFilters === 'function') {
            updateSidebarCounts();
            applyFilters();
        }
        
        btn.html(originalHtml);
        
    } catch (error) {
        console.error('Error marking as resolved:', error);
        showToast('Error', 'Failed to mark as resolved', 'error');
        $('#markResolvedBtn').html('<i class="fas fa-check-circle me-2"></i>Mark as Resolved').prop('disabled', false);
    }
});

// Mark as spam button
$('#markSpamBtn').on('click', function() {
    if (!currentComplaint) return;
    
    // Close detail modal and show spam modal
    const detailModal = bootstrap.Modal.getInstance(document.getElementById('complaintDetailModal'));
    detailModal.hide();
    
    // Set complaint ID in spam modal
    $('#spamComplaintId').val(currentComplaint.id);
    
    // Show spam modal
    const spamModal = new bootstrap.Modal(document.getElementById('spamModal'));
    spamModal.show();
});

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

// Make function globally accessible
window.showComplaintDetail = showComplaintDetail;
