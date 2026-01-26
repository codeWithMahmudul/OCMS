/* ===== QR CODE HANDLER ===== */

$(document).ready(function() {
    // Initialize QR code when modal is shown
    $('#qrModal').on('shown.bs.modal', function() {
        generateQRCode();
    });
    
    // Copy link button
    $('#copyLinkBtn').on('click', copyQRLink);
    
    // Download QR button
    $('#downloadQrBtn').on('click', downloadQRCode);
    
    // Share QR button
    $('#shareQrBtn').on('click', shareQRCode);
});

// Generate QR code
function generateQRCode() {
    const resolverInfo = getResolverInfo();
    const qrLink = `${window.location.origin}/resolver/pages/qr-share.html?resolver=${resolverInfo.id}`;
    
    // Update link input
    $('#qrLink').val(qrLink);
    
    // Clear previous QR code
    $('#qrCodeDisplay').empty();
    
    // Generate new QR code
    try {
        new QRCode(document.getElementById('qrCodeDisplay'), {
            text: qrLink,
            width: 256,
            height: 256,
            colorDark: '#1f2937',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        $('#qrCodeDisplay').html(`
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Failed to generate QR code. Please try again.
            </div>
        `);
    }
}

// Copy QR link to clipboard
function copyQRLink() {
    const linkInput = document.getElementById('qrLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        
        // Update button text
        const btn = $('#copyLinkBtn');
        const originalHtml = btn.html();
        btn.html('<i class="fas fa-check me-1"></i>Copied!');
        
        setTimeout(() => {
            btn.html(originalHtml);
        }, 2000);
        
        showToast('Success', 'Link copied to clipboard', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showToast('Error', 'Failed to copy link', 'error');
    }
}

// Download QR code as image
function downloadQRCode() {
    try {
        const canvas = document.querySelector('#qrCodeDisplay canvas');
        
        if (!canvas) {
            showToast('Error', 'QR code not found. Please try again.', 'error');
            return;
        }
        
        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const resolverInfo = getResolverInfo();
            
            link.href = url;
            link.download = `complainbox-qr-${resolverInfo.id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('Success', 'QR code downloaded successfully', 'success');
        });
    } catch (error) {
        console.error('Error downloading QR code:', error);
        showToast('Error', 'Failed to download QR code', 'error');
    }
}

// Share QR code
function shareQRCode() {
    const qrLink = $('#qrLink').val();
    const resolverInfo = getResolverInfo();
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'ComplainBox - Submit Anonymous Complaint',
            text: `Submit an anonymous complaint or login via ${resolverInfo.name}`,
            url: qrLink
        })
        .then(() => {
            showToast('Success', 'Shared successfully', 'success');
        })
        .catch((error) => {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
                fallbackShare(qrLink);
            }
        });
    } else {
        fallbackShare(qrLink);
    }
}

// Fallback share options
function fallbackShare(link) {
    const shareOptions = `
        <div class="modal fade" id="shareOptionsModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Share QR Code</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted mb-3">Share this link:</p>
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" value="${link}" readonly id="shareLink">
                            <button class="btn btn-outline-primary" onclick="copyShareLink()">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                        <div class="d-grid gap-2">
                            <a href="mailto:?subject=Submit a Complaint&body=Submit an anonymous complaint here: ${encodeURIComponent(link)}" 
                               class="btn btn-outline-primary">
                                <i class="fas fa-envelope me-2"></i>Share via Email
                            </a>
                            <a href="https://wa.me/?text=${encodeURIComponent('Submit an anonymous complaint: ' + link)}" 
                               target="_blank" class="btn btn-outline-success">
                                <i class="fab fa-whatsapp me-2"></i>Share via WhatsApp
                            </a>
                            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('Submit an anonymous complaint')}&url=${encodeURIComponent(link)}" 
                               target="_blank" class="btn btn-outline-info">
                                <i class="fab fa-twitter me-2"></i>Share on Twitter
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    $('#shareOptionsModal').remove();
    
    // Add new modal
    $('body').append(shareOptions);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('shareOptionsModal'));
    modal.show();
}

// Copy share link
function copyShareLink() {
    const linkInput = document.getElementById('shareLink');
    linkInput.select();
    
    try {
        document.execCommand('copy');
        showToast('Success', 'Link copied to clipboard', 'success');
    } catch (error) {
        showToast('Error', 'Failed to copy link', 'error');
    }
}

// Get resolver info (shared with dashboard.js)
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
