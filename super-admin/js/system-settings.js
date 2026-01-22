/**
 * System Settings Page
 */

$(document).ready(function() {
    loadAllSettings();
});

/**
 * Load all settings
 */
async function loadAllSettings() {
    try {
        const response = await apiRequest('/super-admin/settings', 'GET');
        
        if (response.success) {
            populateSettings(response.data);
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        useDummySettings();
    }
}

/**
 * Populate settings form fields
 */
function populateSettings(settings) {
    // General
    $('#platformName').val(settings.platform_name || 'ComplainBox');
    $('#supportEmail').val(settings.support_email || '');
    $('#defaultLanguage').val(settings.default_language || 'en');
    $('#timezone').val(settings.timezone || 'UTC');
    $('#platformDescription').val(settings.description || '');
    $('#allowRegistration').prop('checked', settings.allow_registration || false);
    
    // Email
    $('#smtpHost').val(settings.smtp_host || '');
    $('#smtpPort').val(settings.smtp_port || 587);
    $('#smtpUsername').val(settings.smtp_username || '');
    $('#fromEmail').val(settings.from_email || '');
    $('#fromName').val(settings.from_name || '');
    $('#smtpEncryption').prop('checked', settings.smtp_encryption || false);
    
    // Security
    $('#sessionTimeout').val(settings.session_timeout || 60);
    $('#maxLoginAttempts').val(settings.max_login_attempts || 5);
    $('#passwordMinLength').val(settings.password_min_length || 8);
    $('#passwordExpiry').val(settings.password_expiry || 0);
    $('#require2FA').prop('checked', settings.require_2fa || false);
    $('#requireStrongPassword').prop('checked', settings.require_strong_password || true);
    $('#ipWhitelist').prop('checked', settings.ip_whitelist || false);
    
    // Maintenance
    $('#maintenanceMode').prop('checked', settings.maintenance_mode || false);
    $('#maintenanceMessage').val(settings.maintenance_message || '');
    $('#maintenanceEnd').val(settings.maintenance_end || '');
    toggleMaintenanceFields();
    
    // Integrations
    $('#stripeKey').val(settings.stripe_key || '');
    $('#awsKey').val(settings.aws_key || '');
    $('#s3Bucket').val(settings.s3_bucket || '');
    $('#firebaseKey').val(settings.firebase_key || '');
    $('#firebaseSenderId').val(settings.firebase_sender_id || '');
}

/**
 * Save general settings
 */
async function saveGeneralSettings() {
    const form = document.getElementById('generalSettingsForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const data = {
        platform_name: $('#platformName').val(),
        support_email: $('#supportEmail').val(),
        default_language: $('#defaultLanguage').val(),
        timezone: $('#timezone').val(),
        description: $('#platformDescription').val(),
        allow_registration: $('#allowRegistration').is(':checked')
    };
    
    try {
        const response = await apiRequest('/super-admin/settings/general', 'PUT', data);
        
        if (response.success) {
            showToast('General settings saved successfully', 'success');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast(error.message || 'Error saving settings', 'error');
    }
}

/**
 * Save email settings
 */
async function saveEmailSettings() {
    const form = document.getElementById('emailSettingsForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const data = {
        smtp_host: $('#smtpHost').val(),
        smtp_port: $('#smtpPort').val(),
        smtp_username: $('#smtpUsername').val(),
        smtp_password: $('#smtpPassword').val(),
        from_email: $('#fromEmail').val(),
        from_name: $('#fromName').val(),
        smtp_encryption: $('#smtpEncryption').is(':checked')
    };
    
    try {
        const response = await apiRequest('/super-admin/settings/email', 'PUT', data);
        
        if (response.success) {
            showToast('Email settings saved successfully', 'success');
        }
    } catch (error) {
        console.error('Error saving email settings:', error);
        showToast(error.message || 'Error saving email settings', 'error');
    }
}

/**
 * Test email settings
 */
async function testEmailSettings() {
    try {
        showToast('Sending test email...', 'info');
        
        const response = await apiRequest('/super-admin/settings/email/test', 'POST');
        
        if (response.success) {
            showToast('Test email sent successfully! Check your inbox.', 'success');
        }
    } catch (error) {
        console.error('Error sending test email:', error);
        showToast(error.message || 'Error sending test email', 'error');
    }
}

/**
 * Save security settings
 */
async function saveSecuritySettings() {
    const data = {
        session_timeout: $('#sessionTimeout').val(),
        max_login_attempts: $('#maxLoginAttempts').val(),
        password_min_length: $('#passwordMinLength').val(),
        password_expiry: $('#passwordExpiry').val(),
        require_2fa: $('#require2FA').is(':checked'),
        require_strong_password: $('#requireStrongPassword').is(':checked'),
        ip_whitelist: $('#ipWhitelist').is(':checked')
    };
    
    try {
        const response = await apiRequest('/super-admin/settings/security', 'PUT', data);
        
        if (response.success) {
            showToast('Security settings saved successfully', 'success');
        }
    } catch (error) {
        console.error('Error saving security settings:', error);
        showToast(error.message || 'Error saving security settings', 'error');
    }
}

/**
 * Save maintenance settings
 */
async function saveMaintenanceSettings() {
    const data = {
        maintenance_mode: $('#maintenanceMode').is(':checked'),
        maintenance_message: $('#maintenanceMessage').val(),
        maintenance_end: $('#maintenanceEnd').val()
    };
    
    try {
        const response = await apiRequest('/super-admin/settings/maintenance', 'PUT', data);
        
        if (response.success) {
            showToast('Maintenance settings saved successfully', 'success');
            
            if (data.maintenance_mode) {
                showToast('Maintenance mode is now active', 'warning');
            }
        }
    } catch (error) {
        console.error('Error saving maintenance settings:', error);
        showToast(error.message || 'Error saving maintenance settings', 'error');
    }
}

/**
 * Save integration settings
 */
async function saveIntegrationSettings() {
    const data = {
        stripe_key: $('#stripeKey').val(),
        stripe_secret: $('#stripeSecret').val(),
        aws_key: $('#awsKey').val(),
        aws_secret: $('#awsSecret').val(),
        s3_bucket: $('#s3Bucket').val(),
        firebase_key: $('#firebaseKey').val(),
        firebase_sender_id: $('#firebaseSenderId').val()
    };
    
    try {
        const response = await apiRequest('/super-admin/settings/integrations', 'PUT', data);
        
        if (response.success) {
            showToast('Integration settings saved successfully', 'success');
        }
    } catch (error) {
        console.error('Error saving integration settings:', error);
        showToast(error.message || 'Error saving integration settings', 'error');
    }
}

/**
 * Toggle maintenance fields visibility
 */
function toggleMaintenanceFields() {
    const isEnabled = $('#maintenanceMode').is(':checked');
    $('#maintenanceFields, #maintenanceSchedule').toggle(isEnabled);
}

/**
 * Optimize database
 */
async function optimizeDatabase() {
    if (!confirm('This will optimize the database tables. Continue?')) {
        return;
    }
    
    try {
        showToast('Optimizing database...', 'info');
        
        const response = await apiRequest('/super-admin/maintenance/optimize-db', 'POST');
        
        if (response.success) {
            showToast('Database optimized successfully', 'success');
        }
    } catch (error) {
        console.error('Error optimizing database:', error);
        showToast(error.message || 'Error optimizing database', 'error');
    }
}

/**
 * Clear cache
 */
async function clearCache() {
    if (!confirm('This will clear all application cache. Continue?')) {
        return;
    }
    
    try {
        showToast('Clearing cache...', 'info');
        
        const response = await apiRequest('/super-admin/maintenance/clear-cache', 'POST');
        
        if (response.success) {
            showToast('Cache cleared successfully', 'success');
        }
    } catch (error) {
        console.error('Error clearing cache:', error);
        showToast(error.message || 'Error clearing cache', 'error');
    }
}

/**
 * Backup database
 */
async function backupDatabase() {
    try {
        showToast('Creating database backup...', 'info');
        
        const response = await apiRequest('/super-admin/maintenance/backup-db', 'POST');
        
        if (response.success) {
            showToast('Database backup created successfully', 'success');
            
            if (response.data.download_url) {
                window.location.href = response.data.download_url;
            }
        }
    } catch (error) {
        console.error('Error creating backup:', error);
        showToast(error.message || 'Error creating backup', 'error');
    }
}

/**
 * Use dummy settings for demo
 */
function useDummySettings() {
    const dummySettings = {
        platform_name: 'ComplainBox',
        support_email: 'support@complainbox.com',
        default_language: 'en',
        timezone: 'UTC',
        description: 'Enterprise complaint management platform',
        allow_registration: true,
        smtp_host: 'smtp.mailtrap.io',
        smtp_port: 587,
        smtp_username: 'username',
        from_email: 'noreply@complainbox.com',
        from_name: 'ComplainBox',
        smtp_encryption: true,
        session_timeout: 60,
        max_login_attempts: 5,
        password_min_length: 8,
        password_expiry: 90,
        require_2fa: false,
        require_strong_password: true,
        ip_whitelist: false,
        maintenance_mode: false,
        maintenance_message: 'We are currently performing scheduled maintenance.',
        maintenance_end: ''
    };
    
    populateSettings(dummySettings);
}
