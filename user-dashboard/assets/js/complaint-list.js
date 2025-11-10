// Complaint List JavaScript

$(document).ready(function() {
    // Search functionality
    $('#searchInput').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterComplaints();
    });
    
    // Filter changes
    $('#statusFilter, #categoryFilter, #dateFilter').on('change', function() {
        filterComplaints();
    });
    
    // Reset filters
    $('#resetFilters').on('click', function() {
        $('#searchInput').val('');
        $('#statusFilter').val('');
        $('#categoryFilter').val('');
        $('#dateFilter').val('');
        filterComplaints();
    });
    
    // Filter complaints
    function filterComplaints() {
        const searchTerm = $('#searchInput').val().toLowerCase();
        const statusFilter = $('#statusFilter').val();
        const categoryFilter = $('#categoryFilter').val();
        
        let visibleCount = 0;
        
        $('.complaint-card').parent().each(function() {
            const card = $(this);
            const title = card.find('.complaint-title').text().toLowerCase();
            const description = card.find('.complaint-description').text().toLowerCase();
            const status = card.find('.status-badge').attr('class').includes(statusFilter);
            const category = card.find('.badge-category').attr('class').includes(categoryFilter);
            
            let show = true;
            
            // Search filter
            if (searchTerm && !title.includes(searchTerm) && !description.includes(searchTerm)) {
                show = false;
            }
            
            // Status filter
            if (statusFilter && !status) {
                show = false;
            }
            
            // Category filter
            if (categoryFilter && !category) {
                show = false;
            }
            
            if (show) {
                card.show();
                visibleCount++;
            } else {
                card.hide();
            }
        });
        
        // Show/hide empty state
        if (visibleCount === 0) {
            $('#emptyState').show();
            $('.pagination-wrapper').hide();
        } else {
            $('#emptyState').hide();
            $('.pagination-wrapper').show();
        }
    }
});

// Sample complaint data (replace with actual API call)
const complaintsData = {
    'C001': {
        id: 'C001',
        title: 'Broken Equipment in Lab',
        description: 'The computer systems in Lab Room 301 are not functioning properly. Multiple students reported issues.',
        category: 'Facilities',
        status: 'pending',
        date: 'Nov 1, 2025',
        progress: 0
    },
    'C002': {
        id: 'C002',
        title: 'Poor WiFi Connection',
        description: 'Internet connectivity is very slow in the library area. Unable to access online resources for research.',
        category: 'Technology',
        status: 'progress',
        date: 'Oct 28, 2025',
        progress: 60
    },
    'C003': {
        id: 'C003',
        title: 'Cafeteria Food Quality',
        description: 'The quality of food served in the cafeteria has deteriorated significantly over the past week.',
        category: 'Services',
        status: 'resolved',
        date: 'Oct 25, 2025',
        resolution: 'Issue resolved on Nov 2, 2025. New chef hired and menu improved.'
    },
    'C004': {
        id: 'C004',
        title: 'Classroom AC Not Working',
        description: 'Air conditioning in Room 204 is not functioning. The room temperature is unbearable during afternoon classes.',
        category: 'Facilities',
        status: 'pending',
        date: 'Oct 30, 2025'
    },
    'C005': {
        id: 'C005',
        title: 'Parking Space Shortage',
        description: 'There are insufficient parking spaces for students. Need more parking areas in the campus.',
        category: 'Other',
        status: 'rejected',
        date: 'Oct 20, 2025',
        rejection: 'Outside scope of current facilities plan'
    },
    'C006': {
        id: 'C006',
        title: 'Library Timings Extension',
        description: 'Request to extend library operating hours during exam period for better study facilities.',
        category: 'Academic',
        status: 'progress',
        date: 'Oct 29, 2025',
        progress: 40
    }
};

// View Complaint Modal
function viewComplaint(complaintId) {
    const complaint = complaintsData[complaintId];
    if (!complaint) return;

    // Update modal content
    $('#viewComplaintId').text(`Complaint #${complaint.id}`);
    $('#viewTitle').text(complaint.title);
    $('#viewDescription').text(complaint.description);
    $('#viewDate').text(complaint.date);
    $('#viewCategory').text(complaint.category).attr('class', `badge-category badge-${getCategoryClass(complaint.category)}`);
    $('#viewStatus').text(getStatusText(complaint.status)).attr('class', `status-badge status-${complaint.status}`);

    // Hide all optional sections first
    $('#viewProgressSection, #viewResolutionSection, #viewRejectionSection').hide();

    // Show relevant sections based on status
    if (complaint.status === 'progress' && complaint.progress) {
        $('#viewProgressSection').show();
        $('#viewProgressBar').css('width', complaint.progress + '%');
        $('#viewProgressText').text(`${complaint.progress}% Complete`);
    }

    if (complaint.status === 'resolved' && complaint.resolution) {
        $('#viewResolutionSection').show();
        $('#viewResolution').text(complaint.resolution);
    }

    if (complaint.status === 'rejected' && complaint.rejection) {
        $('#viewRejectionSection').show();
        $('#viewRejection').text(complaint.rejection);
    }

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewComplaintModal'));
    modal.show();
}

// Edit Complaint Modal
function editComplaint(complaintId) {
    const complaint = complaintsData[complaintId];
    if (!complaint) return;

    // Populate form
    $('#editComplaintId').text(`Complaint #${complaint.id}`);
    $('#editTitle').val(complaint.title);
    $('#editDescription').val(complaint.description);
    $('#editCategory').val(complaint.category.toLowerCase());

    // Store complaint ID for save function
    $('#editComplaintForm').data('complaintId', complaintId);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editComplaintModal'));
    modal.show();
}

// Save Edit Complaint
function saveEditComplaint() {
    const complaintId = $('#editComplaintForm').data('complaintId');
    const title = $('#editTitle').val();
    const description = $('#editDescription').val();
    const category = $('#editCategory').val();

    if (!title || !description) {
        alert('Please fill in all required fields');
        return;
    }

    // Update complaint data (replace with actual API call)
    complaintsData[complaintId].title = title;
    complaintsData[complaintId].description = description;
    complaintsData[complaintId].category = category;

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('editComplaintModal')).hide();

    // Show success message
    showToast('Success', 'Complaint updated successfully!', 'success');

    // Reload complaints (in real app, this would refresh from server)
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Delete Complaint Modal
function deleteComplaint(complaintId) {
    const complaint = complaintsData[complaintId];
    if (!complaint) return;

    // Populate modal
    $('#deleteComplaintId').text(`Complaint #${complaint.id}`);
    $('#deleteTitle').text(complaint.title);
    $('#deleteDate').text(complaint.date);
    $('#deleteCategory').text(complaint.category);

    // Store complaint ID for delete function
    $('#deleteComplaintModal').data('complaintId', complaintId);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('deleteComplaintModal'));
    modal.show();
}

// Confirm Delete Complaint
function confirmDeleteComplaint() {
    const complaintId = $('#deleteComplaintModal').data('complaintId');

    // Delete complaint (replace with actual API call)
    delete complaintsData[complaintId];

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('deleteComplaintModal')).hide();

    // Show success message
    showToast('Deleted', 'Complaint deleted successfully!', 'success');

    // Remove card from UI
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Print Complaint
function printComplaint() {
    window.print();
}

// Helper Functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'progress': 'In Progress',
        'resolved': 'Resolved',
        'rejected': 'Rejected'
    };
    return statusMap[status] || status;
}

function getCategoryClass(category) {
    const categoryMap = {
        'Facilities': 'facilities',
        'Technology': 'tech',
        'Services': 'services',
        'Academic': 'academic',
        'Other': 'other'
    };
    return categoryMap[category] || 'other';
}

// Toast Notification Function
function showToast(title, message, type = 'info') {
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    const toastHtml = `
        <div class="toast-notification toast-${type}">
            <div class="toast-content">
                <i class="fas fa-${iconMap[type]}"></i>
                <div>
                    <strong>${title}</strong>
                    <p>${message}</p>
                </div>
            </div>
        </div>
    `;

    $('body').append(toastHtml);

    setTimeout(() => {
        $('.toast-notification').fadeOut(() => {
            $('.toast-notification').remove();
        });
    }, 3000);
}

// Search Functionality
$('#searchInput').on('keyup', function() {
    const searchTerm = $(this).val().toLowerCase();
    $('.complaint-card').each(function() {
        const title = $(this).find('.complaint-title').text().toLowerCase();
        const description = $(this).find('.complaint-description').text().toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            $(this).closest('.col-lg-6').show();
        } else {
            $(this).closest('.col-lg-6').hide();
        }
    });
});

// Filter Functionality
$('#statusFilter, #categoryFilter, #dateFilter').on('change', function() {
    // Implement filtering logic here
    console.log('Filters changed');
});

// Reset Filters
$('#resetFilters').on('click', function() {
    $('#statusFilter, #categoryFilter, #dateFilter').val('');
    $('.complaint-card').closest('.col-lg-6').show();
    $('#searchInput').val('');
});

// Add toast notification styles to page
$(document).ready(function() {
    const toastStyles = `
        <style>
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
                min-width: 300px;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .toast-content i {
                font-size: 1.5rem;
            }
            
            .toast-success i {
                color: #10b981;
            }
            
            .toast-error i {
                color: #ef4444;
            }
            
            .toast-warning i {
                color: #f59e0b;
            }
            
            .toast-info i {
                color: #3b82f6;
            }
            
            .toast-notification strong {
                display: block;
                margin-bottom: 0.25rem;
                color: var(--text-dark);
            }
            
            .toast-notification p {
                margin: 0;
                font-size: 0.9rem;
                color: #6b7280;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        </style>
    `;
    $('head').append(toastStyles);
});

// Feedback Modal
function openFeedbackModal(complaintId) {
    const complaint = complaintsData[complaintId];
    if (!complaint) return;

    // Only allow feedback for resolved complaints
    if (complaint.status !== 'resolved') {
        showToast('Info', 'You can only provide feedback for resolved complaints.', 'info');
        return;
    }

    // Populate modal
    $('#feedbackComplaintId').text(`Complaint #${complaint.id}`);
    
    // Reset form
    $('#feedbackForm')[0].reset();
    $('#ratingText').text('Select a rating');
    
    // Store complaint ID
    $('#feedbackModal').data('complaintId', complaintId);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    modal.show();
}

// Submit Feedback
function submitFeedback() {
    const complaintId = $('#feedbackModal').data('complaintId');
    const rating = $('input[name="rating"]:checked').val();
    const satisfaction = $('input[name="satisfaction"]:checked').val();
    const comments = $('#feedbackComments').val();
    const recommend = $('input[name="recommend"]:checked').val();
    
    // Validation
    if (!rating) {
        showToast('Error', 'Please select a rating', 'error');
        return;
    }
    
    if (!satisfaction) {
        showToast('Error', 'Please select your satisfaction level', 'error');
        return;
    }
    
    if (!recommend) {
        showToast('Error', 'Please select if you would recommend', 'error');
        return;
    }
    
    // Prepare feedback data
    const feedbackData = {
        complaintId: complaintId,
        rating: rating,
        satisfaction: satisfaction,
        comments: comments,
        recommend: recommend,
        submittedAt: new Date().toISOString()
    };
    
    console.log('Feedback submitted:', feedbackData);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('feedbackModal')).hide();
    
    // Show success message
    showToast('Success', 'Thank you for your feedback!', 'success');
    
    // In real app, send to server here
    // Example: submitFeedbackToAPI(feedbackData);
}

// Star rating interaction
$(document).on('change', 'input[name="rating"]', function() {
    const rating = $(this).val();
    const ratingTexts = {
        '5': '⭐ Excellent!',
        '4': '⭐ Very Good',
        '3': '⭐ Good',
        '2': '⭐ Fair',
        '1': '⭐ Poor'
    };
    $('#ratingText').text(ratingTexts[rating]);
});