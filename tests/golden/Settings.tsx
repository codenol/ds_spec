import React, { useCallback, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { AppLayout } from '../layout/AppLayout';

const LOCALE_OPTIONS = [
  {
    "label": "Русский",
    "value": "ru"
  },
  {
    "label": "English",
    "value": "en"
  }
];

const TZ_OPTIONS = [
  {
    "label": "UTC",
    "value": "UTC"
  },
  {
    "label": "Europe/Moscow",
    "value": "Europe/Moscow"
  },
  {
    "label": "Asia/Novosibirsk",
    "value": "Asia/Novosibirsk"
  }
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [locale, setLocale] = useState<string>('ru');
  const [timezone, setTimezone] = useState<string>('UTC');
  const [apiKey, setApiKey] = useState<string>('');
  const [dirty, setDirty] = useState<boolean>(false);

  const handleSave = useCallback(() => {
    // persist settings
    fetch('/api/settings', { method: 'POST', body: JSON.stringify({ locale, timezone, apiKey }) })
      .then(() => setDirty(false));
  }, [locale, timezone, apiKey]);

  const handleReset = useCallback(() => {
    setLocale('ru'); setTimezone('UTC'); setApiKey(''); setDirty(false); setConfirmVisible(false);
  }, []);

  return (
  <AppLayout breadcrumbTrail={[{ label: 'Настройки' }]}>
    <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
      <TabPanel header="Общие">
        <div className="flex flex-column gap-3 p-3">
          <div className="flex flex-column gap-1">
            <label>Язык интерфейса</label>
            <Dropdown value={locale} options={LOCALE_OPTIONS} onChange={(e) => { setLocale(e.value); setDirty(true); }} optionLabel="label" style={({ width: '16rem' })} />
          </div>
          <div className="flex flex-column gap-1">
            <label>Часовой пояс</label>
            <Dropdown value={timezone} options={TZ_OPTIONS} onChange={(e) => { setTimezone(e.value); setDirty(true); }} optionLabel="label" style={({ width: '16rem' })} />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="API">
        <div className="flex flex-column gap-3 p-3">
          <div className="flex flex-column gap-1">
            <label>API-ключ</label>
            <InputText value={apiKey} onChange={(e) => { setApiKey(e.target.value); setDirty(true); }} placeholder="sk-..." style={({ width: '24rem' })} />
          </div>
        </div>
      </TabPanel>
    </TabView>
    <div className="flex gap-2 mt-3">
      <Button label="Сохранить" icon="pi pi-check" onClick={handleSave} disabled={!dirty} size="small" />
      <Button label="Сбросить" icon="pi pi-refresh" onClick={() => setConfirmVisible(true)} className="p-button-outlined p-button-danger" size="small" />
    </div>
    <Dialog header="Сбросить настройки?" visible={confirmVisible} onHide={() => setConfirmVisible(false)} style={({ width: '24rem' })} footer={(<div className='flex gap-2 justify-content-end'><Button label='Отмена' className='p-button-outlined' onClick={() => setConfirmVisible(false)} /><Button label='Сбросить' className='p-button-danger' onClick={handleReset} /></div>)}>
      <p>Все настройки будут возвращены к значениям по умолчанию. Продолжить?</p>
    </Dialog>
  </AppLayout>
  );
};

export default Settings;
