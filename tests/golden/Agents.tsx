import React, { useMemo, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { StatusBadge } from 'uikit/StatusBadge/StatusBadge';
import { AppLayout } from '../layout/AppLayout';

const STATUS_OPTIONS = [
  {
    "label": "Все статусы",
    "value": ""
  },
  {
    "label": "Активен",
    "value": "success"
  },
  {
    "label": "Предупреждение",
    "value": "warning"
  },
  {
    "label": "Критично",
    "value": "critical"
  },
  {
    "label": "Остановлен",
    "value": "stop"
  }
];

const MOCK_AGENTS = [
  {
    "id": "1",
    "name": "agent-prod-01",
    "type": "monitor",
    "host": "10.0.0.1",
    "version": "2.4.1",
    "statusCode": "success",
    "statusName": "Активен",
    "lastSeen": "2026-03-21"
  },
  {
    "id": "2",
    "name": "agent-prod-02",
    "type": "backup",
    "host": "10.0.0.2",
    "version": "2.4.0",
    "statusCode": "warning",
    "statusName": "Нагрузка",
    "lastSeen": "2026-03-21"
  },
  {
    "id": "3",
    "name": "agent-dev-01",
    "type": "monitor",
    "host": "10.0.1.1",
    "version": "2.5.0",
    "statusCode": "load",
    "statusName": "Обновление",
    "lastSeen": "2026-03-21"
  },
  {
    "id": "4",
    "name": "agent-stg-01",
    "type": "deploy",
    "host": "10.0.2.1",
    "version": "2.3.9",
    "statusCode": "stop",
    "statusName": "Остановлен",
    "lastSeen": "2026-03-20"
  }
];

const Agents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [agents, setAgents] = useState<AgentRow[]>(MOCK_AGENTS);
  const [selection, setSelection] = useState<AgentRow[]>([]);
  const [menuRow, setMenuRow] = useState<AgentRow | null>(null);

  const rowMenuRef = useRef<Menu>(null);

  const filteredAgents = useMemo(
    () => agents.filter(a => (!searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())) && (!statusFilter || a.statusCode === statusFilter)),
    [agents, searchQuery, statusFilter],
  );

  return (
  <AppLayout breadcrumbTrail={[{ label: 'Агенты' }]}>
    <div className="flex flex-wrap align-items-center gap-2 mb-3">
      <InputText placeholder="Поиск по имени" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-inputtext-sm" />
      <Dropdown value={statusFilter} options={STATUS_OPTIONS} onChange={(e) => setStatusFilter(e.value)} optionLabel="label" placeholder="Статус" className="p-inputtext-sm" style={{"width":"12rem"}} />
      <Button label="Добавить агента" className="p-button-pr" size="small" />
      <Button label="Экспорт" className="p-button-outlined" size="small" icon="pi pi-download" />
      <Button icon="pi pi-cog" className="p-button-rounded p-button-outlined" size="small" aria-label="Настройки таблицы" />
    </div>
    <div className="card" style={{"minWidth":0,"overflow":"auto","padding":0}}>
      <DataTable value={filteredAgents} selection={selection} onSelectionChange={(e) => setSelection(Array.isArray(e.value) ? e.value : [])} dataKey="id" sortMode="single" removableSort size="small" stripedRows selectionMode="multiple" rowClassName={() => 'cursor-pointer'}>
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
        <Column field="name" header="Имя агента" sortable />
        <Column field="type" header="Тип" sortable />
        <Column field="host" header="Хост" sortable />
        <Column field="version" header="Версия" />
        <Column header="Статус" body={(row) => <StatusBadge code={row.statusCode} name={row.statusName} />} />
        <Column field="lastSeen" header="Последняя активность" sortable />
        <Column headerStyle={{ width: '3rem' }} body={(row) => <Button icon='pi pi-ellipsis-v' className='p-button-text p-button-rounded' onClick={(e) => { setMenuRow(row); rowMenuRef.current?.toggle(e); }} />} />
      </DataTable>
    </div>
    <Menu model={[{ label: 'Открыть', icon: 'pi pi-eye' }, { label: 'Редактировать', icon: 'pi pi-pencil' }, { separator: true }, { label: 'Удалить', icon: 'pi pi-trash' }]} popup ref={rowMenuRef} />
  </AppLayout>
  );
};

export default Agents;
