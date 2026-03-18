/**
 * ProjectFormModal Component
 * 
 * A modal dialog for creating and editing projects.
 * Handles form submission, validation, and error display.
 * 
 * Features:
 * - Create new projects
 * - Edit existing projects
 * - Form validation with error messages
 * - Loading state during submission
 * - Auto-reset on close
 */

import React, { useEffect } from 'react';
import { route } from 'ziggy-js';
import { useForm } from '@inertiajs/react';
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

/**
 * Project interface for type safety
 */
interface Project {
    id?: number;
    name: string;
    description: string | null;
}

/**
 * Props for ProjectFormModal component
 */
interface Props {
    isOpen: boolean;
    onClose: () => void;
    project?: Project | null;
}

/**
 * ProjectFormModal Component
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when modal is closed
 * @param {Project | null} project - Project to edit (null for create)
 * 
 * @returns {JSX.Element} Rendered modal dialog
 */
export default function ProjectFormModal({ isOpen, onClose, project }: Props) {
    /**
     * Form state management using Inertia's useForm hook
     */
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: project?.name || '',
        description: project?.description || '',
    });

    /**
     * Effect to sync form data when project or modal state changes
     */
    useEffect(() => {
        if (project) {
            setData({ name: project.name, description: project.description || '' });
        } else {
            reset();
        }
        clearErrors();
    }, [project, isOpen]);

    /**
     * Handle form submission
     * Determines whether to create or update based on project existence
     */
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const action = project ? put : post;
        const url = project ? route('projects.update', project.id) : route('projects.store');

        action(url, {
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        {project ? 'Edit Project' : 'Create Project'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-xs font-bold uppercase text-gray-500">
                            Project Name
                        </Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. Website Redesign"
                            className={errors.name ? "border-red-500" : "border-gray-200"}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-xs font-bold uppercase text-gray-500">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Briefly describe the project..."
                            className="border-gray-200 min-h-[100px]"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="text-gray-500"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-gray-900 hover:bg-black text-white"
                        >
                            {processing ? 'Saving...' : project ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}