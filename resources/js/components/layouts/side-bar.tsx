/**
 * Sidebar Component
 * 
 * A navigation sidebar that provides quick access to main application sections.
 * Shows active state based on current URL.
 * 
 * Features:
 * - Navigation links to Projects and Tasks
 * - Active state highlighting
 * - Support for route aliases
 * - Consistent styling with icons
 */

import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

/**
 * Sidebar Component
 * 
 * @returns {JSX.Element} Rendered sidebar navigation
 */
export default function Sidebar() {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    
    // Extract pathname from URL (remove query parameters)
    const pathname = url.split('?')[0];

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false);
            }
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    /**
     * Navigation items configuration
     * Each item includes name, href, icon, and optional aliases
     */
    const navItems = [
        { name: 'Projects', href: '/', icon: '📁', aliases: ['/projects'] },
        { name: 'Tasks', href: '/tasks', icon: '✅', aliases: [] },
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg"
            >
                {isOpen ? '✕' : '☰'}
            </button>
            
            {/* Sidebar Overlay for Mobile */}
            {isOpen && isMobile && (
                <div 
                    onClick={() => setIsOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                />
            )}

            <aside className={`
                fixed md:relative top-0 left-0 z-50
                w-64 bg-white h-screen flex flex-col border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 text-gray-900 font-bold text-xl flex items-center gap-2 border-b border-gray-100">
                    <span className="text-blue-600">■</span> TaskManager
                </div>
                
                <nav className="flex-1 px-3 space-y-1 mt-6">
                    {navItems.map((item) => {
                        const isActive = 
                            pathname === item.href || 
                            pathname.startsWith(item.href + '/') ||
                            (item.aliases && item.aliases.some(alias => pathname === alias || pathname.startsWith(alias + '/')));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => isMobile && setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition ${
                                    isActive 
                                        ? 'bg-gray-100 text-gray-900' 
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}