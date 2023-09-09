// Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar'; // Adjust the import to your folder structure
import Sidebar from './Sidebar'; // Import the Sidebar component

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  console.log("Layout component rendered");  // debugging
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
