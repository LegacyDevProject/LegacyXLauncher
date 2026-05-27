import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[72px] lg:ml-[220px]">
        <TopBar />
        <main className="p-4 lg:p-6 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}