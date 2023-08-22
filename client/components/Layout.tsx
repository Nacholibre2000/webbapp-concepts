// Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar'; // Adjust the import to your folder structure

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
