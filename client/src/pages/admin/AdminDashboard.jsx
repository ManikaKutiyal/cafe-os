import AdminLayout from '../../components/admin/AdminLayout';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import { DashboardSkeleton, ErrorBanner } from '../../components/admin/SkeletonLoader';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import MetricCard from '../../components/ui/MetricCard';
import { useDashboardOverview } from '../../hooks/useDashboardOverview';
import { formatMoney } from '../../utils/adminFormat';

export default function AdminDashboard() {
  const {
    analytics,
    billingSummary,
    loading,
    error,
  } = useDashboardOverview();

  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Control Center"
        title="Platform dashboard"
        subtitle="A Super Admin view of revenue, tenant health, feature rollout, and live system activity."
      />

      {loading ? <DashboardSkeleton /> : null}
      {error ? <ErrorBanner message={error} /> : null}

      {!loading && !error && !analytics ? (
        <EmptyState
          icon="☕"
          title="No platform data yet"
          subtitle="Connect the backend and start creating tenants to unlock live SaaS metrics."
        />
      ) : null}

      {!loading && !error && analytics ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
            <MetricCard label="Total tenants" value={analytics.totalCafes} subtitle="Registered workspaces across the platform" accent="#c67c4e" icon="🏪" />
            <MetricCard label="Active tenants" value={analytics.activeTenants} subtitle={`${analytics.suspendedTenants} suspended · ${analytics.expiredTenants} expired`} accent="#22c55e" icon="⚡" />
            <MetricCard label="Platform MRR" value={formatMoney(billingSummary?.mrr || analytics.mrr || 0)} trend={billingSummary?.monthlyGrowthPct || 0} subtitle="Recurring subscription revenue" accent="#0f766e" icon="💰" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, marginBottom: 24 }}>
            <AnalyticsChart
              type="bar"
              data={analytics.tenantGrowth}
              dataKey="count"
              title="Tenant growth"
              subtitle="New tenants created across the last 30 days"
              color="#c67c4e"
            />
            <AnalyticsChart
              type="area"
              data={analytics.activityTrend}
              dataKey="count"
              title="Activity volume"
              subtitle="Tracked admin and platform events"
              color="#0f766e"
            />
            <AnalyticsChart
              type="line"
              data={analytics.revenueGrowth}
              dataKey="amount"
              title="Revenue trend"
              subtitle="Estimated MRR progression"
              color="#3b82f6"
              valuePrefix="₹"
            />
          </div>

          <Card title="Recent activity" subtitle="The latest admin and system events flowing into the platform.">
            {analytics.recentLogs?.length ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {analytics.recentLogs.map((log, index) => (
                  <div key={`${log.action}-${index}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', paddingBottom: 12, borderBottom: index < analytics.recentLogs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 14, background: 'rgba(198,124,78,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      📋
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-1)' }}>{log.action}</div>
                      <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5 }}>
                        {log.target || log.details}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon="📋"
                title="No activity yet"
                subtitle="Recent billing, tenant, and feature events will appear here."
                compact
              />
            )}
          </Card>
        </>
      ) : null}
    </AdminLayout>
  );
}
