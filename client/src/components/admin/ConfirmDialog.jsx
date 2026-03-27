export default function ConfirmDialog({
  open = false,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(2px)',
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          width: '100%',
          maxWidth: 360,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          padding: 24,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--text-1)',
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--text-3)',
            marginBottom: 24,
          }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              background: 'var(--bg-hover)',
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              transition: '0.2s',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px',
              background: danger ? '#ef4444' : '#C67C4E',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              transition: '0.2s',
              boxShadow: danger
                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                : '0 4px 12px rgba(198, 124, 78, 0.3)',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
