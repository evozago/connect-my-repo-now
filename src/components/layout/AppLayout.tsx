import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
}