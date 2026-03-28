import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { useNotifications } from '../../hooks/useNotifications';
import { notificationVisualMap } from '../../utils/adminConstants';
import { formatDateTime, formatRelativeTime } from '../../utils/adminFormat';
import {
  IconAlert,
  IconBell,
  IconCheck,
  IconSearch,
  IconX,
} from '../../components/admin/icons';

const pageSize = 12;

const tabs = [
  { key: 'ALL', label: 'All' },
  { key: 'UNREAD', label: 'Unread' },
  { key: 'ALERTS', label: 'Alerts' },
  { key: 'ACTIVITY', label: 'Activity' },
];

const iconMap = {
  info: IconBell,
  success: IconCheck,
  warning: IconAlert,
  error: IconX,
};

const pageStyle = {
  maxWidth: 1060,
  margin: '0 auto',
};

const softSurface = {
  background: 'rgba(255,255,255,0.74)',
  border: '1px solid rgba(206,183,163,0.45)',
  boxShadow: '0 18px 40px rgba(90,55,28,0.06)',
  backdropFilter: 'blur(10px)',
};

function getTabFilters(activeTab) {
  if (activeTab === 'UNREAD') {
    return { type: 'ALL', read: 'UNREAD' };
  }

  return { type: 'ALL', read: 'ALL' };
}

function matchesTab(notification, activeTab) {
  if (activeTab === 'ALERTS') {
    return notification.type === 'warning' || notification.type === 'error';
  }

  if (activeTab === 'ACTIVITY') {
    return notification.type === 'info' || notification.type === 'success';
  }

  return true;
}

function buildActionLabel(notification) {
  if (notification.type === 'error') return 'Resolve';
  if (notification.type === 'warning') return 'View Details';
  if (notification.type === 'success') return 'Review';
  return 'Open';
}

function buildDismissLabel(notification) {
  if (notification.isRead) return 'Read';
  if (notification.type === 'success') return 'Archive';
  if (notification.type === 'error') return 'Dismiss';
  if (notification.type === 'warning') return 'Acknowledge';
  return 'Mark as read';
}

function getTypeLabel(notification) {
  if (notification.type === 'error') return 'System Alert';
  if (notification.type === 'warning') return 'Attention';
  if (notification.type === 'success') return 'Update';
  return 'Activity';
}

function extractTitle(notification) {
  const message = String(notification.message || '').trim();
  if (!message) return 'Notification';

  const firstSentence = message.split(/[.!?]/).find(Boolean)?.trim();
  if (firstSentence && firstSentence.length <= 72) return firstSentence;
  if (message.length <= 72) return message;
  return `${message.slice(0, 69).trim()}...`;
}

function extractBody(notification, title) {
  const message = String(notification.message || '').trim();
  if (!message) return 'No additional detail provided.';
  if (message === title) return 'Open this notification to view more context and navigate to the source screen.';

  const remainder = message.replace(title, '').trim().replace(/^[.:,-]\s*/, '');
  if (remainder) return remainder;
  return 'Open this notification to view more context and navigate to the source screen.';
}

export default function Notifications() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('ALL');
  const [query, setQuery] = useState('');
  const { type, read } = getTabFilters(activeTab);
  const {
    notifications,
    stats,
    loading,
    error,
    busyId,
    markAllRead,
    markOneRead,
  } = useNotifications({
    page,
    limit: pageSize,
    type,
    read,
  });

  const filteredNotifications = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return notifications
      .filter((notification) => matchesTab(notification, activeTab))
      .filter((notification) => {
        if (!normalized) return true;

        return [
          notification.message,
          notification.type,
          notification.link,
        ].some((value) => String(value || '').toLowerCase().includes(normalized));
      });
  }, [activeTab, notifications, query]);

  return (
    <AdminLayout>
      <div style={pageStyle}>
        <section
          style={{
            ...softSurface,
            borderRadius: 28,
            padding: '24px 24px 20px',
            marginBottom: 22,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(252,249,246,0.92) 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#9f6a3c' }}>
                Event Center
              </div>
              <h1 style={{ margin: '8px 0 0', fontSize: 38, lineHeight: 1, letterSpacing: '-0.05em', color: '#1d130d', fontFamily: '"Fraunces", Georgia, serif' }}>
                Notifications
              </h1>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  minWidth: 240,
                  height: 48,
                  borderRadius: 16,
                  background: '#f0ece8',
                  border: '1px solid rgba(176,145,116,0.16)',
                  padding: '0 16px',
                }}
              >
                <IconSearch size={16} style={{ color: '#7b5e47', flexShrink: 0 }} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search alerts..."
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    color: '#1d130d',
                    fontSize: 14,
                  }}
                />
              </div>

              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(198,124,78,0.22), rgba(198,124,78,0.08))',
                  border: '1px solid rgba(198,124,78,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                👨‍💼
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {tabs.map((tab) => {
                const selected = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setPage(1);
                    }}
                    style={{
                      minWidth: 82,
                      height: 40,
                      borderRadius: 14,
                      border: '1px solid transparent',
                      padding: '0 18px',
                      background: selected ? '#321c12' : '#e6e3e0',
                      color: selected ? '#fff7ef' : '#5f4c3f',
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => markAllRead()}
              disabled={!stats.unread || busyId === 'all'}
              style={{
                border: 'none',
                background: 'transparent',
                color: !stats.unread || busyId === 'all' ? '#bfae9f' : '#9f6a3c',
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: !stats.unread || busyId === 'all' ? 'not-allowed' : 'pointer',
              }}
            >
              {busyId === 'all' ? 'Marking...' : 'Mark All As Read'}
            </button>
          </div>
        </section>

        {error ? (
          <div
            style={{
              ...softSurface,
              borderRadius: 24,
              padding: 20,
              marginBottom: 18,
              color: '#b42318',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(254,242,242,0.96) 100%)',
            }}
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div
            style={{
              ...softSurface,
              borderRadius: 28,
              padding: 28,
              color: '#7b5e47',
              fontSize: 14,
            }}
          >
            Loading notifications...
          </div>
        ) : filteredNotifications.length ? (
          <div style={{ display: 'grid', gap: 18 }}>
            {filteredNotifications.map((notification) => {
              const Icon = iconMap[notification.type] || IconBell;
              const visual = notificationVisualMap[notification.type] || notificationVisualMap.info;
              const title = extractTitle(notification);
              const body = extractBody(notification, title);

              return (
                <article
                  key={notification.id}
                  style={{
                    ...softSurface,
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '4px minmax(0, 1fr)',
                    borderRadius: 28,
                    overflow: 'hidden',
                    background: notification.isRead
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(252,250,247,0.94) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(254,249,244,0.98) 100%)',
                  }}
                >
                  <div style={{ background: visual.color, opacity: notification.isRead ? 0.35 : 1 }} />

                  <div style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: 18, minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 16,
                            background: visual.background,
                            color: visual.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase', color: visual.color }}>
                            {getTypeLabel(notification)}
                          </div>
                          <div style={{ marginTop: 8, fontSize: 17, lineHeight: 1.28, fontWeight: 900, color: '#18110d' }}>
                            {title}
                          </div>
                          <div style={{ marginTop: 10, maxWidth: 760, fontSize: 14, lineHeight: 1.65, color: '#5f4c3f' }}>
                            {body}
                          </div>

                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                            {notification.link ? (
                              <Button
                                size="sm"
                                onClick={async () => {
                                  await markOneRead(notification, { silent: true });
                                  navigate(notification.link);
                                }}
                                style={{
                                  minWidth: 118,
                                  background: '#4a2d1b',
                                  boxShadow: 'none',
                                }}
                              >
                                {buildActionLabel(notification)}
                              </Button>
                            ) : null}

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markOneRead(notification)}
                              disabled={busyId === notification.id || notification.isRead}
                              style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#6d4d32',
                                paddingLeft: 8,
                                paddingRight: 8,
                              }}
                            >
                              {busyId === notification.id ? 'Saving...' : buildDismissLabel(notification)}
                            </Button>
                          </div>

                          {!notification.isRead ? (
                            <div style={{ marginTop: 14, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9f6a3c' }}>
                              Unread
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div style={{ minWidth: 88, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#6d4d32' }}>
                        {formatRelativeTime(notification.timestamp)}
                        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 500, color: '#9b8a7b' }}>
                          {formatDateTime(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div style={{ ...softSurface, borderRadius: 28, padding: 18 }}>
            <EmptyState
              icon="🔔"
              title="No notifications match this view"
              subtitle="Try switching tabs or clearing the search to see more activity."
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginTop: 18 }}>
          <div style={{ fontSize: 13, color: '#7b5e47' }}>
            Showing {filteredNotifications.length} of {notifications.length} items on page {stats.page} of {stats.pages}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={stats.page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((current) => Math.min(stats.pages, current + 1))}
              disabled={stats.page >= stats.pages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
