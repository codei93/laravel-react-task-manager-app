import React, { useState, useEffect } from 'react';

import MainLayout from '@/components/layouts/main-layout';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import TaskFormModal from '@/components/modals/task-form-modal';
import TaskDeleteModal from '@/components/modals/task-delete-modal';

interface Task {
    id: number;
    title: string;
    description: string | null;
    priority: string;
    project: { name: string };
    project_id: number;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    tasks_count: number;
}

interface Props {
    projects: Project[];
    tasks: Task[];
    filters: { search?: string };
}

export default function Index({ projects, tasks, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [localTasks, setLocalTasks] = useState(tasks);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<any>(null);
    
    const handleCreate = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = (task: Task) => {
        setTaskToDelete(task);
        setIsDeleteOpen(true);
    }

    // Sync local state when props change (important for search/filters)
    useEffect(() => { setLocalTasks(tasks); }, [tasks]);

    // Handle Search with Debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('tasks.index'), { search }, { preserveState: true, replace: true });
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    // Handle Drag and Drop
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(localTasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalTasks(items);

        const orders = items.map((task, index) => ({
            id: task.id,
            order_sequence: index,
        }));

        router.post(route('tasks.reorder'), { orders }, { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Tasks" />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    <p className="text-sm text-gray-500">Manage and reorder your project tasks.</p>
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

                     <Button onClick={handleCreate} className="bg-gray-900 text-white">
                        + New Task
                      </Button>
                </div>
            </div>

            {/* Draggable Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="w-10 px-6 py-4"></th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Task Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Project</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <Droppable droppableId="tasks-list">
                            {(provided) => (
                                <tbody {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-gray-100">
                                    {localTasks.map((task, index) => (
                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                            {(provided, snapshot) => (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`${snapshot.isDragging ? 'bg-gray-50 shadow-inner' : 'bg-white'} hover:bg-gray-50/50 transition`}
                                                >
                                                    <td {...provided.dragHandleProps} className="px-6 py-4 text-gray-300 hover:text-gray-600 cursor-grab">
                                                        ⣿
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                        {task.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase border border-gray-200">
                                                            {task.project.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                                            task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            task.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                        }`}>
                                                            {task.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm space-x-4">
                                                      <Button onClick={()=>handleEdit(task)} className="bg-gray-900 text-white">
                                                                                             Edit
                                                      </Button>
                                                                                     
                                                      <Button onClick={() => handleDelete(task)} className="bg-red-700 text-white">Delete</Button>
                                                    </td>
                                                </tr>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {localTasks.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                No tasks found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            )}
                        </Droppable>
                    </table>
                </DragDropContext>
            </div>

        <TaskFormModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            task={selectedTask} 
            projects={projects}
            /> 

        <TaskDeleteModal 
            isOpen={isDeleteOpen} 
            onClose={() => setIsDeleteOpen(false)} 
            task={taskToDelete} 
          />    
        </MainLayout>
    );
}