/* ===== SPAM HANDLER JAVASCRIPT ===== */

$(document).ready(function() {
    // Confirm spam button
    $('#confirmSpamBtn').on('click', handleSpamConfirmation);
    
    // Reset modal when closed
    $('#spamModal').on('hidden.bs.modal', function() {
        resetSpamModal();
    });
});

// Handle spam confirmation
async function handleSpamConfirmation() {
    const complaintId = $('#spamComplaintId').val();
    const reason = $('#spamReason').val();
    const notes = $('#spamNotes').val().trim();
    
    // Validation
    if (!reason) {
        showToast('Warning', 'Please select a spam reason', 'warning');
        return;
    }
    
    if (!complaintId) {
        showToast('Error', 'Complaint ID not found', 'error');
        return;
    }
    
    try {
        const btn = $('#confirmSpamBtn');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...').prop('disabled', true);
        
        // TODO: Replace with actual API call
        // await fetch(`${CONFIG.API_BASE_URL}/complaints/${complaintId}/spam`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ reason, notes })
        // });
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update local data if available
        if (typeof allComplaints !== 'undefined') {
            const complaint = allComplaints.find(c => c.id === complaintId);
            if (complaint) {
                complaint.status = 'spam';
            }
        }
        
        // Update current complaint if viewing details
        if (typeof currentComplaint !== 'undefined' && currentComplaint && currentComplaint.id === complaintId) {
            currentComplaint.status = 'spam';
        }
        
        showToast('Success', 'Complaint marked as spam', 'success');
        
        // Close spam modal
        const spamModal = bootstrap.Modal.getInstance(document.getElementById('spamModal'));
        spamModal.hide();
        
        // Reset button
        btn.html(originalHtml).prop('disabled', false);
        
        // Refresh data if on complaints page
        if (typeof updateSidebarCounts === 'function') {
            updateSidebarCounts();
        }
        
        if (typeof applyFilters === 'function') {
            applyFilters();
        }
        
        // Close detail modal if open
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('complaintDetailModal'));
        if (detailModal) {
            detailModal.hide();
        }
        
    } catch (error) {
        console.error('Error marking as spam:', error);
        showToast('Error', 'Failed to mark complaint as spam', 'error');
        $('#confirmSpamBtn').html('<i class="fas fa-ban me-2"></i>Mark as Spam').prop('disabled', false);
    }
}

// Reset spam modal
function resetSpamModal() {
    $('#spamComplaintId').val('');
    $('#spamReason').val('');
    $('#spamNotes').val('');
}

// Quick spam function (called from complaints list)
async function quickMarkSpam(complaintId) {
    // Set complaint ID
    $('#spamComplaintId').val(complaintId);
    
    // Show spam modal
    const spamModal = new bootstrap.Modal(document.getElementById('spamModal'));
    spamModal.show();
}

// Make function globally accessible
window.quickMarkSpam = quickMarkSpam;
