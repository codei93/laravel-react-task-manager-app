import { usePage } from '@inertiajs/react';

export default function Footer() {
    const { props } = usePage();
    const { author, linkedin, github } = props.app;

    return (
        <footer className="h-12 border-t border-gray-200 bg-white px-8 flex items-center justify-between text-xs text-gray-400">
             <div>© 2026 Task Manager v1.0</div>
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-gray-600 font-medium">
                     <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                         {author?.charAt(0) || 'A'}
                     </div>
                     {author}
                 </div>
                 {linkedin && (
                     <a href={linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
                         LinkedIn
                     </a>
                 )}
                 {github && (
                     <a href={github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">
                         GitHub
                     </a>
                 )}
             </div>
         </footer>
    );
}