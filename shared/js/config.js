/* ===== GLOBAL CONFIGURATION ===== */

const CONFIG = {
    // API Configuration
    API_BASE_URL: 'http://localhost/api',
    API_VERSION: 'v1',
    API_TIMEOUT: 30000, // 30 seconds
    
    // Application
    APP_NAME: 'ComplainBox',
    APP_VERSION: '1.0.0',
    APP_ENV: 'development', // development, staging, production
    
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    
    // File Upload
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALLOWED_FILE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
    
    // Date & Time
    DATE_FORMAT: 'MMM DD, YYYY',
    TIME_FORMAT: 'HH:mm A',
    DATETIME_FORMAT: 'MMM DD, YYYY HH:mm A',
    
    // Status Colors
    STATUS_COLORS: {
        pending: '#F59E0B',
        'in-progress': '#3B82F6',
        resolved: '#10B981',
        rejected: '#EF4444'
    },
    
    // Priority Levels
    PRIORITY_LEVELS: {
        low: { label: 'Low', color: '#10B981' },
        medium: { label: 'Medium', color: '#F59E0B' },
        high: { label: 'High', color: '#EF4444' },
        urgent: { label: 'Urgent', color: '#DC2626' }
    },
    
    // Roles
    ROLES: {
        SUPER_ADMIN: 'super_admin',
        ORG_ADMIN: 'org_admin',
        RESOLVER: 'resolver',
        USER: 'user'
    },
    
    // Local Storage Keys
    STORAGE_KEYS: {
        AUTH_TOKEN: 'complainbox_auth_token',
        USER_DATA: 'complainbox_user_data',
        THEME: 'complainbox_theme',
        SIDEBAR_STATE: 'complainbox_sidebar_state',
        LANGUAGE: 'complainbox_language'
    },
    
    // Notification Settings
    NOTIFICATION_DURATION: 4000, // 4 seconds
    
    // Table Settings
    TABLE_ROWS_PER_PAGE: [10, 25, 50, 100],
    
    // Chart Colors
    CHART_COLORS: [
        '#4F46E5', '#7C3AED', '#EC4899', '#10B981',
        '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'
    ]
};

// API Endpoints
const API_ENDPOINTS = {
    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    
    // Users
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    USER_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile/update',
    CHANGE_PASSWORD: '/users/change-password',
    
    // Organizations
    ORGANIZATIONS: '/organizations',
    ORGANIZATION_BY_ID: (id) => `/organizations/${id}`,
    
    // Departments
    DEPARTMENTS: '/departments',
    DEPARTMENT_BY_ID: (id) => `/departments/${id}`,
    
    // Categories
    CATEGORIES: '/categories',
    CATEGORY_BY_ID: (id) => `/categories/${id}`,
    
    // Complaints
    COMPLAINTS: '/complaints',
    COMPLAINT_BY_ID: (id) => `/complaints/${id}`,
    SUBMIT_COMPLAINT: '/complaints/submit',
    UPDATE_COMPLAINT: (id) => `/complaints/${id}/update`,
    DELETE_COMPLAINT: (id) => `/complaints/${id}/delete`,
    ASSIGN_COMPLAINT: (id) => `/complaints/${id}/assign`,
    UPDATE_STATUS: (id) => `/complaints/${id}/status`,
    ADD_COMMENT: (id) => `/complaints/${id}/comments`,
    UPLOAD_ATTACHMENT: (id) => `/complaints/${id}/attachments`,
    
    // Resolvers
    RESOLVERS: '/resolvers',
    RESOLVER_BY_ID: (id) => `/resolvers/${id}`,
    ASSIGNED_COMPLAINTS: '/resolvers/assigned-complaints',
    RESOLVER_PERFORMANCE: (id) => `/resolvers/${id}/performance`,
    
    // Dashboard
    DASHBOARD_STATS: '/dashboard/stats',
    RECENT_ACTIVITIES: '/dashboard/recent-activities',
    
    // Analytics
    ANALYTICS: '/analytics',
    COMPLAINT_TRENDS: '/analytics/complaint-trends',
    DEPARTMENT_STATS: '/analytics/department-stats',
    RESOLVER_STATS: '/analytics/resolver-stats',
    
    // Notifications
    NOTIFICATIONS: '/notifications',
    MARK_AS_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    
    // Reports
    REPORTS: '/reports',
    GENERATE_REPORT: '/reports/generate',
    EXPORT_REPORT: '/reports/export',
    
    // Subscriptions
    SUBSCRIPTION_PLANS: '/subscriptions/plans',
    CURRENT_SUBSCRIPTION: '/subscriptions/current',
    UPGRADE_PLAN: '/subscriptions/upgrade',
    PAYMENT_HISTORY: '/subscriptions/payments'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, API_ENDPOINTS };
}
