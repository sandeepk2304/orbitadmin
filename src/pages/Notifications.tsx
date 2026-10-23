import { useNotifications } from '../hooks/useNotifications';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { BellRing, Eye, Trash2, CheckCheck, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications();

  const handleMarkAll = () => {
    markAllAsRead();
  };

  const getIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
        );
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
        );
      case 'error':
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle size={18} />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Info size={18} />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <PageHeader
        title="System Notifications"
        description="Review background server operations, audit logs, rate-limit warnings, and SaaS milestones."
        action={
          notifications.length > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          )
        }
      />

      {/* Notifications list feed */}
      {notifications.length === 0 ? (
        <EmptyState
          title="Inbox completely clear"
          description="You are all caught up! No background system alerts or logs are currently reported."
          icon={BellRing}
        />
      ) : (
        <div className="bg-white dark:bg-[#1a1a27] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors divide-y divide-gray-100 dark:divide-white/5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 flex items-start gap-4 transition-all relative ${
                !notif.read ? 'bg-indigo-50/20 dark:bg-indigo-500/[0.01]' : ''
              }`}
            >
              {/* Notif Status Dot indicator */}
              {!notif.read && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full" />
              )}

              {getIcon(notif.type)}

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h4 className={`text-sm text-[#11191f] dark:text-white leading-tight ${!notif.read ? 'font-bold' : 'font-semibold'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 dark:text-[#8a8a9e] font-semibold">{notif.createdAt}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-[#8a8a9e] mt-1.5 leading-relaxed max-w-2xl">
                  {notif.message}
                </p>
              </div>

              {/* Actions panel */}
              <div className="flex items-center gap-1.5 shrink-0 self-center">
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                    title="Mark as Read"
                  >
                    <Eye size={15} />
                  </button>
                )}
                <button
                  onClick={() => clearNotification(notif.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Dismiss Alert"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
