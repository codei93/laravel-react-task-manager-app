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
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar />

            <div className="flex-1 flex flex-col relative min-h-0">
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}