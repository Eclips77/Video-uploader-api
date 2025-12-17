import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-text">
      <Sidebar />
      <main className="pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};
