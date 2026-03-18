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

/**
 * Sidebar Component
 * 
 * @returns {JSX.Element} Rendered sidebar navigation
 */
export default function Sidebar() {
    const { url } = usePage();
    
    // Extract pathname from URL (remove query parameters)
    const pathname = url.split('?')[0];

    /**
     * Navigation items configuration
     * Each item includes name, href, icon, and optional aliases
     */
    const navItems = [
        { name: 'Projects', href: '/', icon: '📁', aliases: ['/projects'] },
        { name: 'Tasks', href: '/tasks', icon: '✅', aliases: [] },
    ];

    return (
        <aside className="w-64 bg-white h-screen flex flex-col border-r border-gray-200">
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
    );
}