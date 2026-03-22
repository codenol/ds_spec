import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ProgressBar } from 'primereact/progressbar';
import { AppLayout } from '../layout/AppLayout';
import { StatusBadge } from 'uikit/StatusBadge/StatusBadge';

const CARDS = [
  {
    "id": "agents",
    "label": "Агентов онлайн",
    "stateKey": "agentsOnline",
    "icon": "pi pi-server",
    "color": "#22c55e"
  },
  {
    "id": "tasks",
    "label": "Задач за сегодня",
    "stateKey": "tasksToday",
    "icon": "pi pi-calendar",
    "color": "#3b82f6"
  },
  {
    "id": "alerts",
    "label": "Активных алертов",
    "stateKey": "activeAlerts",
    "icon": "pi pi-exclamation-triangle",
    "color": "#f59e0b"
  },
  {
    "id": "errors",
    "label": "Ошибок за час",
    "stateKey": "errorsLastHour",
    "icon": "pi pi-times-circle",
    "color": "#ef4444"
  }
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(() => {
    setLoading(true);
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setError(null); })
      .catch(() => setError('Не удалось загрузить статистику'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, []);

  return (
  <AppLayout breadcrumbTrail={[{ label: 'Дашборд' }]}>
    {error && (
      <Message severity="error" text={error} className="mb-3 w-full" />
    )}
    <div className="grid">
      {CARDS.map((card) => (
          <div key={card.id} className="col-12 md:col-6 xl:col-3">
            <div className="card flex align-items-center gap-3 p-3">
              <i className="{`${card.icon} text-2xl`}" style={({ color: card.color })} />
              <div>
                <div className="text-500 text-sm">{card.label}</div>
                <div className="text-900 font-bold text-xl">{loading ? '…' : stats?.[card.stateKey] ?? '–'}</div>
              </div>
            </div>
          </div>
      ))}
    </div>
    <div className="flex justify-content-end mt-3">
      <Button label="Обновить" icon="pi pi-refresh" onClick={loadStats} loading={loading} className="p-button-outlined" size="small" />
    </div>
  </AppLayout>
  );
};

export default Dashboard;
