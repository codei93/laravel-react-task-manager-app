import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Project {
    id: number;
    name: string;
}

interface Task {
    id?: number;
    title: string;
    description: string | null;
    priority: string;
    project_id: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
    projects: Project[]; // To populate the project selector
}

export default function TaskFormModal({ isOpen, onClose, task, projects }: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: '',
        description: '',
        priority: 'medium',
        project_id: null as number | null,
    });

    // Sync form data when modal opens or task changes
    useEffect(() => {
        if (task) {
            setData({
                title: task.title,
                description: task.description || '',
                priority: task.priority,
                project_id: task.project_id,
            });
        } else {
           setData({
                title: '',
                description:'',
                priority: 'medium',
                project_id: 0,
            });
        }
        clearErrors();
    }, [task, isOpen]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (task?.id) {
            put(route('tasks.update', task.id), {
                onSuccess: () => { onClose(); reset(); },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => { onClose(); reset(); },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-5 py-4">
                    {/* Project Selection */}
                    <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase text-gray-500">Project</Label>
                        <Select 
                            value={data.project_id ? String(data.project_id) : ''}
                            onValueChange={(val: any) => setData('project_id', parseInt(val))}
                            items={projects.map(p => ({ value: p.id.toString(), label: p.name }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {projects.map((p) => (
                                        <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.project_id && <p className="text-red-500 text-xs">{errors.project_id}</p>}
                    </div>

                    {/* Task Title */}
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase text-gray-500">Task Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e: any) => setData('title', e.target.value)}
                            className={errors.title ? "border-red-500" : "border-gray-200"}
                        />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                    </div>

                    {/* Priority & Description */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase text-gray-500">Priority</Label>
                        <Select 
                            value={data.priority} 
                            onValueChange={(val: any) => setData('priority', val)}
                            items={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' }
                            ]}
                        >
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label className="text-xs font-bold uppercase text-gray-500">Description</Label>
                        <Textarea
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            className="border-gray-200 min-h-[80px]"
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-100">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-gray-500">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-gray-900 hover:bg-black text-white px-8">
                            {processing ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}