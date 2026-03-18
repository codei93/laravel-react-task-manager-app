import React, { PropsWithChildren } from 'react';
import Sidebar from './side-bar';
import Footer from './footer';

export default function MainLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <main className="flex-1 overflow-y-auto p-10">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}