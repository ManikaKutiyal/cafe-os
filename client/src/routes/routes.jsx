/**
 * Central Routes Registry
 * 
 * This file aggregates routes from all feature modules.
 * To add a new feature:
 * 1. Import its routes array.
 * 2. Spread it into the 'allRoutes' array.
 * 
 * This pattern minimizes merge conflicts.
 */

// Example Import (Uncomment when you have feature routes)
// import { useCaseRoutes } from '../pages/UseCase/useCaseRoutes';
import Dashboard from "../pages/superAdmin/Dashboard";

// ── Admin Portal (noorsetia branch) ──────────────────────────
import AdminDashboard from "../pages/admin/AdminDashboard";
import TenantManagement from "../pages/admin/TenantManagement";
import SubscriptionManagement from "../pages/admin/SubscriptionManagement";
import FeatureFlags from "../pages/admin/FeatureFlags";
import UserManagement from "../pages/admin/UserManagement";
import ActivityLogs from "../pages/admin/ActivityLogs";
import Analytics from "../pages/admin/Analytics";
import TenantUsage from "../pages/admin/TenantUsage";
import SystemAlerts from "../pages/admin/SystemAlerts";
import BillingHistory from "../pages/admin/BillingHistory";


export const allRoutes = [
    // ...useCaseRoutes,

    // placeholder home route
    {
        path: '/',
        element: <div>Welcome to Cafe OS - Modular Routing is active!</div>
    },

    // ── Legacy super-admin dashboard (existing) ──────────────
    {
        path: "/admin",
        element: <Dashboard />
    },

    // ── New Admin Portal routes ───────────────────────────────
    { path: "/admin/dashboard", element: <AdminDashboard /> },
    { path: "/admin/tenants",   element: <TenantManagement /> },
    { path: "/admin/subscriptions", element: <SubscriptionManagement /> },
    { path: "/admin/features",  element: <FeatureFlags /> },
    { path: "/admin/feature-flags",  element: <FeatureFlags /> },
    { path: "/admin/users",     element: <UserManagement /> },
    { path: "/admin/logs",      element: <ActivityLogs /> },
    { path: "/admin/analytics", element: <Analytics /> },
    { path: "/admin/tenant-usage", element: <TenantUsage /> },
    { path: "/admin/alerts", element: <SystemAlerts /> },
    { path: "/admin/billing", element: <BillingHistory /> },
import React from 'react';
import { ownerRoutes } from './ownerRoutes';
import LandingPage from '../pages/LandingPage/LandingPage';

export const allRoutes = [
    ...ownerRoutes,
    { path: '/', element: <LandingPage /> },
];
