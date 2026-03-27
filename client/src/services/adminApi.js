import { apiRequest } from './api';

function withQuery(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        acc[key] = value;
      }

      return acc;
    }, {}),
  ).toString();

  return query ? `${path}?${query}` : path;
}

// Tenants
export const fetchTenants = (params = {}) =>
  apiRequest({ url: withQuery('/admin/tenants', params), method: 'get' });

export const fetchTenantById = (id) =>
  apiRequest({ url: `/admin/tenants/${id}`, method: 'get' });

export const createTenant = (data) =>
  apiRequest({ url: '/admin/tenants', method: 'post', data });

export const updateTenant = (id, data) =>
  apiRequest({ url: `/admin/tenants/${id}`, method: 'patch', data });

export const updateTenantStatus = (id, status) =>
  apiRequest({ url: `/admin/tenants/${id}/status`, method: 'patch', data: { status } });

export const trackTenantActivity = (id, orders = 0) =>
  apiRequest({ url: `/admin/tenants/${id}/activity`, method: 'patch', data: { orders } });

export const deleteTenant = (id) =>
  apiRequest({ url: `/admin/tenants/${id}`, method: 'delete' });

// Plans
export const fetchPlans = () =>
  apiRequest({ url: '/admin/plans', method: 'get' });

export const fetchPlanDistribution = () =>
  apiRequest({ url: '/admin/plans/distribution', method: 'get' });

export const createPlan = (data) =>
  apiRequest({ url: '/admin/plans', method: 'post', data });

export const updatePlan = (id, data) =>
  apiRequest({ url: `/admin/plans/${id}`, method: 'patch', data });

export const deletePlan = (id) =>
  apiRequest({ url: `/admin/plans/${id}`, method: 'delete' });

// Features
export const fetchFeatures = () =>
  apiRequest({ url: '/admin/features', method: 'get' });

export const updateFeature = (id, updates) =>
  apiRequest({ url: `/admin/features/${id}`, method: 'patch', data: updates });

export const fetchFeatureImpact = (id, params = {}) =>
  apiRequest({ url: withQuery(`/admin/features/${id}/impact`, params), method: 'get' });

export const previewFeatureUpdate = (id, data) =>
  apiRequest({ url: `/admin/features/${id}/preview`, method: 'post', data });

export const resolveFeatureFlags = (tenantId, plan) =>
  apiRequest({
    url: withQuery('/admin/features/resolve', { tenantId, plan }),
    method: 'get',
  });

export const searchFeatureTenants = (params = {}) =>
  apiRequest({ url: withQuery('/admin/features/tenants/search', params), method: 'get' });

// Admin Users
export const fetchUsers = () =>
  apiRequest({ url: '/admin/users', method: 'get' });

export const fetchRolePermissions = () =>
  apiRequest({ url: '/admin/users/role-permissions', method: 'get' });

export const createUser = (data) =>
  apiRequest({ url: '/admin/users', method: 'post', data });

export const updateUser = (id, data) =>
  apiRequest({ url: `/admin/users/${id}`, method: 'patch', data });

export const deleteUser = (id) =>
  apiRequest({ url: `/admin/users/${id}`, method: 'delete' });

// Logs
export const fetchLogs = (params = {}) =>
  apiRequest({ url: withQuery('/admin/logs', params), method: 'get' });

// Analytics
export const fetchAnalytics = () =>
  apiRequest({ url: '/admin/analytics', method: 'get' });

export const fetchTenantUsage = () =>
  apiRequest({ url: '/admin/analytics/tenant-usage', method: 'get' });

// Alerts
export const fetchAlerts = (params = {}) =>
  apiRequest({ url: withQuery('/admin/alerts', params), method: 'get' });

export const updateAlertStatus = (id, status) =>
  apiRequest({ url: `/admin/alerts/${id}/status`, method: 'patch', data: { status } });

// Notifications
export const fetchNotifications = (params = {}) =>
  apiRequest({ url: withQuery('/admin/notifications', params), method: 'get' });

export const markNotificationRead = (id) =>
  apiRequest({ url: `/admin/notifications/${id}/read`, method: 'patch' });

export const markAllNotificationsRead = () =>
  apiRequest({ url: '/admin/notifications/read-all', method: 'patch' });

// Invoices / Billing
export const fetchInvoices = (params = {}) =>
  apiRequest({ url: withQuery('/admin/invoices', params), method: 'get' });

export const createInvoice = (data) =>
  apiRequest({ url: '/admin/invoices', method: 'post', data });

export const updateInvoice = (id, data) =>
  apiRequest({ url: `/admin/invoices/${id}`, method: 'patch', data });

export const fetchBillingSummary = () =>
  apiRequest({ url: '/admin/invoices/summary', method: 'get' });

export const fetchTenantBillingDetails = (tenantId) =>
  apiRequest({ url: `/admin/invoices/tenant/${tenantId}/details`, method: 'get' });

export const seedInvoices = () =>
  apiRequest({ url: '/admin/invoices/seed', method: 'post' });

export const cleanupInvoices = (confirm = false) =>
  apiRequest({ url: '/admin/invoices/cleanup', method: 'post', data: { confirm } });
