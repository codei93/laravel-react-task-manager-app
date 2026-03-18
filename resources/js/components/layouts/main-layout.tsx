/**
 * MainLayout Component
 * 
 * A layout component that provides the main structure for the application.
 * Includes a sidebar, main content area, and footer.
 * 
 * Features:
 * - Responsive sidebar navigation
 * - Scrollable main content area
 * - Fixed footer
 * - Consistent styling and spacing
 */

import React, { PropsWithChildren } from 'react';
import Sidebar from './side-bar';
import Footer from './footer';

/**
 * MainLayout Component
 * 
 * @param {React.ReactNode} children - Child components to render in the main content area
 * 
 * @returns {JSX.Element} Rendered layout with sidebar, main content, and footer
 */
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