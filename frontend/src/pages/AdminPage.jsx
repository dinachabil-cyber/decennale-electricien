import React, { useState } from 'react';
import AdminLayout from '../admin/AdminLayout';
import PageList from '../admin/pages/PageList';
import SectionManager from '../admin/sections/SectionManager';

export default function AdminPage() {
  const [tab, setTab] = useState('pages');
  const [selectedPage, setSelectedPage] = useState(null);

  const tabs = [
    { id: 'pages', label: 'Pages' },
  ];

  const handleTabChange = (tabId) => {
    setTab(tabId);
    if (tabId === 'pages') {
      setSelectedPage(null);
    }
  };

  return (
    <AdminLayout activeTab={tab} onTabChange={handleTabChange} tabs={tabs}>
      {tab === 'pages' && !selectedPage && (
        <PageList
          onSelectPage={(page) => { setSelectedPage(page); setTab('sections'); }}
        />
      )}

      {tab === 'sections' && selectedPage && (
        <SectionManager
          page={selectedPage}
          onBack={() => { setSelectedPage(null); setTab('pages'); }}
        />
      )}
    </AdminLayout>
  );
}