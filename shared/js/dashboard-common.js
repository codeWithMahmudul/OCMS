/* ===== DASHBOARD COMMON JAVASCRIPT (Shared across all dashboards) ===== */

$(document).ready(function() {
    
    // === Check Authentication ===
    if (!isAuthenticated()) {
        window.location.href = '../auth/login.html';
        return;
    }
    
    // === Load User Data ===
    const userData = getUserData();
    if (userData) {
        $('.user-name').text(userData.name || 'User');
        $('.user-role').text(userData.role || 'Member');
        
        // Set initials in avatar
        const initials = userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
        $('.user-avatar, .user-avatar-sm').html(initials);
    }
    
    // === Sidebar Toggle (Desktop) ===
    $('#sidebarToggle, .sidebar-toggle').click(function(e) {
        e.preventDefault();
        $('.dashboard-sidebar').toggleClass('collapsed');
        saveToStorage(CONFIG.STORAGE_KEYS.SIDEBAR_STATE, $('.dashboard-sidebar').hasClass('collapsed'));
    });
    
    // === Mobile Menu Toggle ===
    $('#mobileToggle').click(function(e) {
        e.preventDefault();
        $('.dashboard-sidebar').toggleClass('active');
        $('.mobile-overlay').toggleClass('active');
        $('body').toggleClass('no-scroll');
    });
    
    // === Mobile Overlay Click (Close Sidebar) ===
    $('.mobile-overlay').click(function() {
        $('.dashboard-sidebar').removeClass('active');
        $(this).removeClass('active');
        $('body').removeClass('no-scroll');
    });
    
    // === Load Sidebar State from Storage ===
    const sidebarCollapsed = getFromStorage(CONFIG.STORAGE_KEYS.SIDEBAR_STATE);
    if (sidebarCollapsed) {
        $('.dashboard-sidebar').addClass('collapsed');
    }
    
    // === Active Navigation Item ===
    const currentPage = window.location.pathname.split('/').pop();
    $('.nav-item').each(function() {
        const href = $(this).attr('href');
        if (href && href.includes(currentPage)) {
            $(this).addClass('active');
        }
    });
    
    // === Logout Handler ===
    $('.logout-btn').click(function(e) {
        e.preventDefault();
        confirmDialog('Are you sure you want to logout?', function() {
            logout();
        });
    });
    
    // === Initialize Bootstrap Tooltips ===
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // === Initialize Bootstrap Dropdowns ===
    if (typeof bootstrap !== 'undefined') {
        const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        });
    }
    
    // === Search Functionality ===
    let searchTimeout;
    $('.search-box input').on('input', function() {
        clearTimeout(searchTimeout);
        const searchQuery = $(this).val();
        
        searchTimeout = setTimeout(function() {
            if (searchQuery.length > 2) {
                performSearch(searchQuery);
            }
        }, 500);
    });
    
    function performSearch(query) {
        console.log('Searching for:', query);
        // Implement search logic here
        // This will be different for each panel
    }
    
    // === Handle Window Resize ===
    let resizeTimeout;
    $(window).resize(function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile sidebar on desktop
            if ($(window).width() >= 992) {
                $('.dashboard-sidebar').removeClass('active');
                $('.mobile-overlay').removeClass('active');
                $('body').removeClass('no-scroll');
            }
        }, 250);
    });
    
    // === Prevent Body Scroll when Sidebar is Open on Mobile ===
    const style = document.createElement('style');
    style.textContent = `
        body.no-scroll {
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
    
    // === Notification Badge Click ===
    $('.action-btn').click(function(e) {
        e.preventDefault();
        const action = $(this).attr('data-action');
        
        if (action === 'notifications') {
            showNotifications();
        }
    });
    
    function showNotifications() {
        showToast('Info', 'Notifications panel coming soon!', 'info');
        // Implement notifications panel
    }
    
    // === User Dropdown (if not using Bootstrap) ===
    $('.user-btn').click(function(e) {
        e.stopPropagation();
        $(this).next('.dropdown-menu').toggleClass('show');
    });
    
    $(document).click(function() {
        $('.dropdown-menu').removeClass('show');
    });
    
    $('.dropdown-menu').click(function(e) {
        e.stopPropagation();
    });
    
    // === Form Auto-save (Draft) ===
    let autoSaveTimeout;
    $('.auto-save-form input, .auto-save-form textarea, .auto-save-form select').on('input change', function() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(function() {
            saveFormDraft();
        }, 2000);
    });
    
    function saveFormDraft() {
        const formData = {};
        $('.auto-save-form').find('input, textarea, select').each(function() {
            const name = $(this).attr('name');
            if (name) {
                formData[name] = $(this).val();
            }
        });
        saveToStorage('form_draft_' + window.location.pathname, formData);
        showToast('Info', 'Draft saved', 'info');
    }
    
    // === Load Form Draft ===
    function loadFormDraft() {
        const draft = getFromStorage('form_draft_' + window.location.pathname);
        if (draft) {
            Object.keys(draft).forEach(function(name) {
                $(`[name="${name}"]`).val(draft[name]);
            });
            showToast('Info', 'Draft loaded', 'info');
        }
    }
    
    // Call on forms with auto-save class
    if ($('.auto-save-form').length) {
        loadFormDraft();
    }
    
    // === Keyboard Shortcuts ===
    $(document).keydown(function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 75) {
            e.preventDefault();
            $('.search-box input').focus();
        }
        
        // Escape key to close modals/overlays
        if (e.keyCode === 27) {
            $('.mobile-overlay').click();
            $('.modal').modal('hide');
        }
    });
    
    // === Smooth Scroll ===
    $('a[href^="#"]').click(function(e) {
        const href = $(this).attr('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = $(href);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 100
                }, 500);
            }
        }
    });
    
    // === Back to Top Button (if exists) ===
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn();
        } else {
            $('.back-to-top').fadeOut();
        }
    });
    
    $('.back-to-top').click(function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
    });
    
    // === Table Row Click (if data-href exists) ===
    $('tr[data-href]').click(function() {
        window.location.href = $(this).data('href');
    });
    
    // === Confirm Delete Actions ===
    $(document).on('click', '.btn-delete, [data-action="delete"]', function(e) {
        e.preventDefault();
        const self = this;
        confirmDialog('Are you sure you want to delete this item?', function() {
            // Perform delete action
            const url = $(self).attr('href') || $(self).data('url');
            if (url) {
                performDelete(url);
            }
        });
    });
    
    function performDelete(url) {
        showToast('Info', 'Deleting...', 'info');
        // Implement actual delete logic with API call
        console.log('Deleting:', url);
    }
    
    // === Initialize Date Pickers (if using) ===
    if (typeof flatpickr !== 'undefined') {
        flatpickr('.datepicker', {
            dateFormat: 'Y-m-d',
            altFormat: 'M j, Y',
            altInput: true
        });
    }
    
    // === Initialize Select2 (if using) ===
    if (typeof $.fn.select2 !== 'undefined') {
        $('.select2').select2({
            theme: 'bootstrap-5',
            width: '100%'
        });
    }
    
    // === Initialize DataTables (if using) ===
    if (typeof $.fn.DataTable !== 'undefined') {
        $('.data-table').DataTable({
            responsive: true,
            pageLength: CONFIG.DEFAULT_PAGE_SIZE,
            lengthMenu: CONFIG.TABLE_ROWS_PER_PAGE,
            language: {
                search: '_INPUT_',
                searchPlaceholder: 'Search...'
            }
        });
    }
    
    // === Print Page ===
    $('.btn-print').click(function(e) {
        e.preventDefault();
        window.print();
    });
    
    // === Export Functions ===
    $('.btn-export').click(function(e) {
        e.preventDefault();
        const format = $(this).data('format') || 'pdf';
        exportData(format);
    });
    
    function exportData(format) {
        showToast('Info', `Exporting to ${format.toUpperCase()}...`, 'info');
        // Implement export logic
    }
});

// === Load Toast Styles (if not already loaded) ===
if (!$('#toast-styles').length) {
    const toastStyles = `
        <style id="toast-styles">
            .toast-notification {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                animation: slideInRight 0.3s ease;
                min-width: 320px;
                max-width: 400px;
                border: 2px solid #E5E7EB;
            }
            
            .toast-content {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .toast-content i {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .toast-content strong {
                display: block;
                margin-bottom: 0.25rem;
                color: #1F2937;
                font-size: 0.95rem;
            }
            
            .toast-content p {
                margin: 0;
                font-size: 0.85rem;
                color: #6b7280;
                line-height: 1.5;
            }
            
            .toast-close {
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                background: none;
                border: none;
                color: #9CA3AF;
                cursor: pointer;
                padding: 0.25rem;
                font-size: 0.85rem;
                transition: all 0.3s ease;
            }
            
            .toast-close:hover {
                color: #4F46E5;
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
            
            @media (max-width: 767px) {
                .toast-notification {
                    left: 20px;
                    right: 20px;
                    min-width: auto;
                }
            }
        </style>
    `;
    $('head').append(toastStyles);
}
