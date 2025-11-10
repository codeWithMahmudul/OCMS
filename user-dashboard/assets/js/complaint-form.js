// Complaint Form JavaScript

let currentStep = 1;
const totalSteps = 3;

$(document).ready(function() {
    // Character counter
    $('textarea[name="description"]').on('input', function() {
        const length = $(this).val().length;
        $('#charCount').text(length);
        
        if (length > 1000) {
            $(this).val($(this).val().substring(0, 1000));
            $('#charCount').text(1000);
        }
    });
    
    // File upload handling
    $('#fileInput').on('change', function(e) {
        handleFiles(e.target.files);
    });
    
    // Drag and drop
    $('.file-upload-area').on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    $('.file-upload-area').on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    $('.file-upload-area').on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFiles(e.originalEvent.dataTransfer.files);
    });
    
    // Form submission
    $('#complaintForm').on('submit', function(e) {
        e.preventDefault();
        submitComplaint();
    });
});

// Step navigation
function nextStep() {
    if (validateStep(currentStep)) {
        if (currentStep < totalSteps) {
            $(`.form-step[data-step="${currentStep}"]`).removeClass('active');
            $(`.step-item[data-step="${currentStep}"]`).removeClass('active');
            
            currentStep++;
            
            $(`.form-step[data-step="${currentStep}"]`).addClass('active');
            $(`.step-item[data-step="${currentStep}"]`).addClass('active');
            
            // Scroll to top
            $('.complaint-form-card').get(0).scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        $(`.form-step[data-step="${currentStep}"]`).removeClass('active');
        $(`.step-item[data-step="${currentStep}"]`).removeClass('active');
        
        currentStep--;
        
        $(`.form-step[data-step="${currentStep}"]`).addClass('active');
        $(`.step-item[data-step="${currentStep}"]`).addClass('active');
        
        // Scroll to top
        $('.complaint-form-card').get(0).scrollIntoView({ behavior: 'smooth' });
    }
}

// Validate current step
function validateStep(step) {
    let isValid = true;
    const stepElement = $(`.form-step[data-step="${step}"]`);
    
    stepElement.find('[required]').each(function() {
        if (!this.value.trim()) {
            isValid = false;
            $(this).addClass('is-invalid');
            
            if (!$(this).next('.invalid-feedback').length) {
                $(this).after('<div class="invalid-feedback">This field is required</div>');
            }
        } else {
            $(this).removeClass('is-invalid');
            $(this).next('.invalid-feedback').remove();
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
    }
    
    return isValid;
}

// Handle file uploads
function handleFiles(files) {
    const filePreview = $('#filePreview');
    
    Array.from(files).forEach(file => {
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 5MB.`);
            return;
        }
        
        // Create preview
        const fileItem = $(`
            <div class="file-preview-item" data-filename="${file.name}">
                <div class="file-preview-icon">
                    <i class="fas ${getFileIcon(file.type)}"></i>
                </div>
                <div class="file-preview-name">${file.name}</div>
                <button type="button" class="file-remove-btn" onclick="removeFile(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `);
        
        filePreview.append(fileItem);
    });
}

// Get file icon based on type
function getFileIcon(type) {
    if (type.startsWith('image/')) return 'fa-file-image';
    if (type === 'application/pdf') return 'fa-file-pdf';
    if (type.includes('word')) return 'fa-file-word';
    return 'fa-file';
}

// Remove file from preview
function removeFile(button) {
    $(button).closest('.file-preview-item').remove();
}

// Submit complaint
function submitComplaint() {
    // Show loading state
    const submitBtn = $('.btn-modern-success');
    const originalText = submitBtn.html();
    submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i>Submitting...').prop('disabled', true);
    
    // Simulate API call
    setTimeout(() => {
        // Generate random tracking ID
        const trackingId = '#C' + Math.floor(1000000 + Math.random() * 9000000);
        $('#trackingId').text(trackingId);
        
        // Reset form
        $('#complaintForm')[0].reset();
        $('#filePreview').empty();
        currentStep = 1;
        $('.form-step').removeClass('active');
        $('.step-item').removeClass('active');
        $(`.form-step[data-step="1"]`).addClass('active');
        $(`.step-item[data-step="1"]`).addClass('active');
        
        // Reset button
        submitBtn.html(originalText).prop('disabled', false);
        
        // Show success modal
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
    }, 2000);
}

// Copy tracking ID
function copyTrackingId() {
    const trackingId = $('#trackingId').text();
    
    navigator.clipboard.writeText(trackingId).then(() => {
        // Show feedback
        const btn = event.target.closest('button');
        const originalText = $(btn).html();
        $(btn).html('<i class="fas fa-check me-2"></i>Copied!');
        
        setTimeout(() => {
            $(btn).html(originalText);
        }, 2000);
    });
}