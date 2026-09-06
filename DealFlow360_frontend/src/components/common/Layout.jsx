import React from 'react';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-600 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <footer className="bg-white border-t border-blue-100 py-4 text-center text-xs text-slate-500 font-mono">
        DealFlow360 &bull; Self Governing Sales Operations Platform &bull; Integrated with Spring Boot Backend
      </footer>
    </div>
  );
};
