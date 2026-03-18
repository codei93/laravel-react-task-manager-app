import React, { useState, useEffect } from 'react';

import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import MainLayout from '@/components/layouts/main-layout';
import { Button } from '@/components/ui/button';

import ProjectFormModal from '@/components/modals/project-form-modal';
import ProjectDeleteModal from '@/components/modals/project-delete-modal';

interface Project {
    id: number;
    name: string;
    description: string | null;
    tasks_count: number;
}

interface Props {
    projects: Project[];
    filters: {
        search?: string;
    };
}

export default function Index({ projects, filters }: Props) {
    // State for the search input, pre-filled from URL filters
    const [search, setSearch] = useState(filters.search || '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

    const handleCreateClick = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (project: any) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (project: any) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };
    
    // Handle Live Search with Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/projects', 
                { search: search }, 
                { 
                    preserveState: true, 
                    replace: true 
                }
            );
        }, 300); // 300ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <MainLayout>
            <Head title="Projects" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-sm text-gray-500">Manage your project CRUD effortlessly.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <span className="text-xs">🔍</span>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects..."
                            className="block w-64 pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-300 transition"
                        />
                        {search && (
                            <button 
                                onClick={() => setSearch('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-gray-500"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                   <Button onClick={handleCreateClick} className="bg-gray-900 text-white">
                    + New Project
                   </Button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Project Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Tasks</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {project.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {project.description || <span className="text-gray-300 italic">No description</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                                            {project.tasks_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm space-x-4">
                                        <Button onClick={()=>handleEditClick(project)} className="bg-gray-900 text-white">
                                          Edit
                                        </Button>
                                  
                                        <Button 
                                            onClick={() => router.get(route('tasks.index'), { project_id: project.id })} 
                                            className="bg-blue-600 text-white"
                                        >
                                            View
                                        </Button>

                                        <Button onClick={() => handleDeleteClick(project)} className="bg-red-700 text-white">Delete</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center">
                                    <p className="text-gray-400 text-sm font-medium">
                                        {search ? `No results found for "${search}"` : "No projects created yet."}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ProjectFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                project={selectedProject} 
            />

            <ProjectDeleteModal 
                isOpen={isDeleteModalOpen} 
                onClose={() => setIsDeleteModalOpen(false)} 
                project={projectToDelete} 
            />
        </MainLayout>
    );
}