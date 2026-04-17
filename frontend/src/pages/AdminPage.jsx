import React, { useState } from 'react';
import AdminLayout from '../admin/layout/AdminLayout';
import PageList from '../admin/pages/PageList';
import SectionManager from '../admin/sections/SectionManager';

export default function AdminPage() {
  const [tab, setTab] = useState('pages');
  const [selectedPage, setSelectedPage] = useState(null);

  const tabs = [
    { id: 'pages', label: 'Pages' },
  ];

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab} tabs={tabs}>
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