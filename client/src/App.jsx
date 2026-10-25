import React from 'react';
import Header from './components/common/Header';
import PassengerPortalComplete from './portals/PassengerPortalComplete';
import StaffPortalComplete from './portals/StaffPortalComplete';
import AdminPortalComplete from './portals/AdminPortalComplete';
import { useAppStore } from './store/appStore';

export default function App() {
  const { currentPortal } = useAppStore();

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <Header />
      <main className="pt-20 pb-16">
        {currentPortal === 'passenger' && <PassengerPortalComplete />}
        {currentPortal === 'staff' && <StaffPortalComplete />}
        {currentPortal === 'admin' && <AdminPortalComplete />}
      </main>
    </div>
  );
}
