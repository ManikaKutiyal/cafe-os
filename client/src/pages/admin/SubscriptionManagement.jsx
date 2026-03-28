import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import AdminLayout from '../../components/admin/AdminLayout';
import PlanCard from '../../components/admin/PlanCard';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { PageSpinner, ErrorBanner, EmptyState } from '../../components/admin/SkeletonLoader';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import {
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  fetchPlanDistribution,
  fetchTenants,
  fetchInvoices,
  fetchBillingSummary,
  fetchLogs,
} from '../../services/adminApi';

const chartColors = ['#c67c4e', '#0f766e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

const emptyForm = {
  planName: '',
  price: '',
  featureList: '',
  orderLimit: 100,
  staffLimit: 5,
  planStatus: 'Active',
};

const fieldStyle = {
  width: '100%',
  minHeight: 46,
  borderRadius: 14,
  border: '1px solid var(--border)',
  background: 'var(--bg-base)',
  color: 'var(--text-1)',
  padding: '0 14px',
  boxSizing: 'border-box',
  fontSize: 13,
};

const textareaStyle = {
  ...fieldStyle,
  padding: '12px 14px',
  minHeight: 110,
  resize: 'vertical',
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 800,
  color: 'var(--text-3)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
  display: 'block',
};

function CompactTooltip({ active, payload, label, money = false }) {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '10px 12px',
      fontSize: 12,
      color: 'var(--text-1)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ fontWeight: 800 }}>{label}</div>
      <div style={{ marginTop: 4, color: 'var(--text-3)' }}>
        {money ? `₹${Number(payload[0]?.value || 0).toLocaleString('en-IN')}` : payload[0]?.value || 0}
      </div>
    </div>
  );
}

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      setError(null);
      const [plansRes, distributionRes, tenantsRes, invoicesRes, billingRes, logsRes] = await Promise.all([
        fetchPlans(),
        fetchPlanDistribution(),
        fetchTenants({ page: 1, limit: 500 }),
        fetchInvoices({ page: 1, limit: 300 }),
        fetchBillingSummary(),
        fetchLogs({ page: 1, limit: 60 }),
      ]);

      setPlans(plansRes.data || []);
      setDistribution(distributionRes.data || []);
      setTenants(tenantsRes.data || []);
      setInvoices(invoicesRes.data || []);
      setBilling(billingRes.data || null);
      setLogs(logsRes.data || []);
    } catch (fetchError) {
      console.error('[SubscriptionManagement] Failed to load page', fetchError);
      setError(fetchError.message || 'Failed to load subscriptions page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const countMap = useMemo(
    () => Object.fromEntries(distribution.map(({ plan, count }) => [plan, count])),
    [distribution],
  );

  const totalTenants = useMemo(
    () => distribution.reduce((sum, row) => sum + (row.count || 0), 0),
    [distribution],
  );

  const paidPlans = useMemo(
    () => plans.filter((plan) => Number(plan.price || 0) > 0).length,
    [plans],
  );

  const featureCount = useMemo(
    () => new Set(
      plans.flatMap((plan) => (Array.isArray(plan.featureList) ? plan.featureList : []))
    ).size,
    [plans],
  );

  const priceMap = useMemo(
    () => Object.fromEntries(plans.map((plan) => [plan.planName, Number(plan.price || 0)])),
    [plans],
  );

  const expiringSoon = useMemo(() => {
    const now = Date.now();

    return tenants
      .filter((tenant) => tenant.status === 'Active' && tenant.planExpiryDate)
      .map((tenant) => ({
        ...tenant,
        daysLeft: Math.ceil((new Date(tenant.planExpiryDate).getTime() - now) / 86400000),
      }))
      .filter((tenant) => tenant.daysLeft >= 0 && tenant.daysLeft <= 30)
      .sort((left, right) => left.daysLeft - right.daysLeft)
      .slice(0, 5);
  }, [tenants]);

  const trendData = useMemo(() => billing?.trend || [], [billing]);

  const planRevenueCards = useMemo(() => {
    const revenueByPlan = billing?.revenueByPlan || [];

    return revenueByPlan
      .filter((plan) => plan.plan)
      .map((plan) => ({
        plan: plan.plan,
        tenantCount: plan.tenantCount || countMap[plan.plan] || 0,
        revenue: plan.revenue || 0,
        unitPrice: plan.unitPrice || priceMap[plan.plan] || 0,
      }))
      .sort((left, right) => right.revenue - left.revenue);
  }, [billing, countMap, priceMap]);

  const activityRows = useMemo(() => {
    const invoiceRows = invoices.map((invoice) => ({
      id: `invoice-${invoice._id}`,
      entity: invoice.tenantName || 'Tenant',
      action: invoice.status === 'Paid' ? 'Payment received' : invoice.status || 'Invoice updated',
      plan: invoice.planName || '—',
      amount: invoice.amount || 0,
      ts: new Date(invoice.billingDate || invoice.createdAt || 0).getTime(),
    }));

    const logRows = logs.map((log, index) => ({
      id: `log-${index}`,
      entity: log.target || log.targetEntity || 'System',
      action: log.action || log.details || 'Activity',
      plan: '—',
      amount: 0,
      ts: new Date(log.createdAt || 0).getTime(),
    }));

    return [...invoiceRows, ...logRows]
      .filter((row) => Number.isFinite(row.ts))
      .sort((left, right) => right.ts - left.ts)
      .slice(0, 8);
  }, [invoices, logs]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId('');
    setShowForm(true);
  };

  const openEdit = (plan) => {
    setEditId(plan._id);
    setForm({
      planName: plan.planName || '',
      price: String(plan.price ?? ''),
      featureList: Array.isArray(plan.featureList) ? plan.featureList.join(', ') : '',
      orderLimit: plan.orderLimit ?? 100,
      staffLimit: plan.staffLimit ?? 5,
      planStatus: plan.planStatus || 'Active',
    });
    setShowForm(true);
  };

  const resetEditor = () => {
    setForm(emptyForm);
    setEditId('');
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        planName: form.planName.trim(),
        price: Number(form.price || 0),
        featureList: form.featureList
          .split(',')
          .map((feature) => feature.trim())
          .filter(Boolean),
        orderLimit: Number(form.orderLimit || 0),
        staffLimit: Number(form.staffLimit || 0),
        planStatus: form.planStatus,
      };

      if (editId) {
        await updatePlan(editId, payload);
        toast.success('Plan updated');
      } else {
        await createPlan(payload);
        toast.success('Plan created');
      }

      resetEditor();
      await load();
    } catch (submitError) {
      console.error('[SubscriptionManagement] Failed to save plan', submitError);
      toast.error(submitError.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePlan(id);
      toast.success('Plan deleted');
      setConfirm(null);
      await load();
    } catch (deleteError) {
      console.error('[SubscriptionManagement] Failed to delete plan', deleteError);
      toast.error(deleteError.message || 'Failed to delete plan');
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Revenue Architecture"
        title="Subscriptions"
        subtitle="Curate pricing tiers, monitor plan adoption, and manage the recurring revenue engine for every cafe workspace."
        actions={<Button onClick={openCreate}>New Plan</Button>}
      />

      {loading ? <PageSpinner message="Loading subscription workspace..." /> : null}
      {error ? <ErrorBanner message={error} /> : null}

      {!loading && !error ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
            <MetricCard label="Plans" value={plans.length} subtitle="Published subscription tiers" accent="#c67c4e" icon="💳" />
            <MetricCard label="Paid tiers" value={paidPlans} subtitle="Revenue-generating plans" accent="#22c55e" icon="💰" />
            <MetricCard label="Assigned tenants" value={totalTenants} subtitle="Active workspaces in the pricing model" accent="#0f766e" icon="🏪" />
            <MetricCard label="Feature keys" value={featureCount} subtitle="Unique packaged capabilities" accent="#3b82f6" icon="⚑" />
          </div>

          {showForm ? (
            <Card
              title={editId ? 'Edit subscription plan' : 'Create subscription plan'}
              subtitle="Use comma-separated feature keys like POS, INVENTORY, STAFF_MANAGEMENT."
              accent="#c67c4e"
              style={{ marginBottom: 20 }}
            >
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Plan Name</label>
                    <input
                      required
                      value={form.planName}
                      onChange={(event) => setForm((current) => ({ ...current, planName: event.target.value }))}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Monthly Price</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Order Limit</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.orderLimit}
                      onChange={(event) => setForm((current) => ({ ...current, orderLimit: event.target.value }))}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Staff Limit</label>
                    <input
                      required
                      type="number"
                      min="0"
                      value={form.staffLimit}
                      onChange={(event) => setForm((current) => ({ ...current, staffLimit: event.target.value }))}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Status</label>
                    <select
                      value={form.planStatus}
                      onChange={(event) => setForm((current) => ({ ...current, planStatus: event.target.value }))}
                      style={fieldStyle}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Feature Keys</label>
                    <textarea
                      rows="4"
                      value={form.featureList}
                      onChange={(event) => setForm((current) => ({ ...current, featureList: event.target.value }))}
                      style={textareaStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
                  <Button type="button" variant="ghost" onClick={resetEditor}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editId ? 'Update Plan' : 'Create Plan'}
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(280px, 0.95fr)', gap: 18, marginBottom: 20 }}>
            <Card
              title="Revenue curve"
              subtitle="Monthly invoice revenue generated across the billing ledger."
              accent="#c67c4e"
            >
              {trendData.length ? (
                <div style={{ width: '100%', height: 290 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="subscriptionRevenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c67c4e" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#c67c4e" stopOpacity="0.04" />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CompactTooltip money />} cursor={{ stroke: '#c67c4e', strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#c67c4e" strokeWidth={3} fill="url(#subscriptionRevenueFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  icon="📉"
                  title="No revenue trend yet"
                  subtitle="Generate invoices or seed demo billing data to bring this chart to life."
                />
              )}
            </Card>

            <Card
              title="Renewals due soon"
              subtitle="Active tenants with plan expiry dates approaching in the next 30 days."
              accent="#0f766e"
              actions={(
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/subscriptions/renewals')}>
                  View All
                </Button>
              )}
            >
              {expiringSoon.length ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  {expiringSoon.map((tenant) => (
                    <div
                      key={tenant._id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: 12,
                        alignItems: 'center',
                        padding: '12px 14px',
                        borderRadius: 16,
                        background: 'var(--bg-base)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 14,
                        background: 'rgba(15,118,110,0.12)',
                        color: '#0f766e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                      }}>
                        {String(tenant.cafeName || 'C').slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-1)' }}>{tenant.cafeName}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-3)' }}>
                          {tenant.subscriptionPlan} • expires in {tenant.daysLeft} day{tenant.daysLeft === 1 ? '' : 's'}
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#c67c4e' }}>
                        ₹{Number(priceMap[tenant.subscriptionPlan] || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="⏱"
                  title="No renewals due soon"
                  subtitle="Everything in the current tenant set looks comfortably scheduled."
                />
              )}
            </Card>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)', gap: 18, marginBottom: 20 }}>
            <Card
              title="Plan adoption"
              subtitle="Tenant distribution across subscription tiers."
              accent="#3b82f6"
            >
              {distribution.length ? (
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distribution} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <XAxis dataKey="plan" tick={{ fill: 'var(--text-3)', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip content={<CompactTooltip />} cursor={{ fill: 'rgba(59,130,246,0.08)' }} />
                      <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                        {distribution.map((_, index) => (
                          <Cell key={index} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  icon="📊"
                  title="No plan adoption yet"
                  subtitle="Assign tenants to plans to reveal uptake patterns here."
                />
              )}
            </Card>

            <Card
              title="Revenue by plan"
              subtitle="Current recurring value and tenant count by tier."
              accent="#8b5cf6"
            >
              {planRevenueCards.length ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  {planRevenueCards.map((plan, index) => (
                    <div
                      key={plan.plan}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 14,
                        alignItems: 'center',
                        padding: '14px 16px',
                        borderRadius: 16,
                        border: '1px solid var(--border)',
                        background: `linear-gradient(90deg, ${chartColors[index % chartColors.length]}12, transparent)`,
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-1)' }}>{plan.plan}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-3)' }}>
                          {plan.tenantCount} tenant{plan.tenantCount === 1 ? '' : 's'} • ₹{Number(plan.unitPrice).toLocaleString('en-IN')}/month
                        </div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 900, color: '#c67c4e' }}>
                        ₹{Number(plan.revenue).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="🧾"
                  title="No plan revenue yet"
                  subtitle="Once invoice activity starts, this panel will break down plan performance."
                />
              )}
            </Card>
          </div>

          {!plans.length ? (
            <EmptyState
              icon="💳"
              title="No plans yet"
              subtitle='Start with "New Plan" to create your first subscription tier.'
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 20, marginBottom: 20 }}>
              {plans.map((plan) => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  tenantCount={countMap[plan.planName] ?? 0}
                  onEdit={() => openEdit(plan)}
                  onDelete={() => setConfirm({ id: plan._id, name: plan.planName })}
                />
              ))}
            </div>
          )}

          <Card
            title="Recent subscription activity"
            subtitle="Latest billing and tenant-level platform activity touching the subscription lifecycle."
            accent="#0f766e"
          >
            {activityRows.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--text-3)' }}>
                      {['Entity', 'Action', 'Plan', 'Amount'].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            padding: '10px 8px',
                            borderBottom: '1px solid var(--border)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            fontSize: 10,
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activityRows.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 8px', color: 'var(--text-1)', fontWeight: 700 }}>{row.entity}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-2)' }}>{row.action}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-2)' }}>{row.plan}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-1)', fontWeight: 800 }}>
                          {row.amount ? `₹${Number(row.amount).toLocaleString('en-IN')}` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon="📋"
                title="No recent activity"
                subtitle="Billing events and tenant changes will show up here once the system is in motion."
              />
            )}
          </Card>
        </>
      ) : null}

      {confirm ? (
        <ConfirmDialog
          open
          danger
          title="Delete Plan"
          message={`Delete "${confirm.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
