import React from 'react';
import Header from './components/common/Header';
import PassengerPortal from './portals/PassengerPortal';
import StaffPortal from './portals/StaffPortal';
import AdminPortal from './portals/AdminPortal';
import { useAppStore } from './store/appStore';

export default function App() {
  const { currentPortal } = useAppStore();

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      <Header />
      <main className="pt-20 pb-16">
        {currentPortal === 'passenger' && <PassengerPortal />}
        {currentPortal === 'staff' && <StaffPortal />}
        {currentPortal === 'admin' && <AdminPortal />}
      </main>
    </div>
  );
}
