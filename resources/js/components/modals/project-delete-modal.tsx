/**
 * ProjectDeleteModal Component
 * 
 * A confirmation dialog for deleting projects.
 * Shows the project name and warns about permanent deletion of associated tasks.
 * 
 * Features:
 * - Confirmation dialog with project details
 * - Warning about associated task deletion
 * - Loading state during deletion
 * - Prevents accidental deletions
 */

import React from 'react';
import { useForm } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Props for ProjectDeleteModal component
 */
interface Props {
    isOpen: boolean;
    onClose: () => void;
    project: { id: number; name: string } | null;
}

/**
 * ProjectDeleteModal Component
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Callback when modal is closed
 * @param {object | null} project - Project to delete (id and name)
 * 
 * @returns {JSX.Element} Rendered confirmation dialog
 */
export default function ProjectDeleteModal({ isOpen, onClose, project }: Props) {
    /**
     * Form state for delete operation
     */
    const { delete: destroy, processing } = useForm();

    /**
     * Handle delete confirmation
     * Calls the destroy method with the project ID
     */
    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;

        destroy(route('projects.destroy', project.id), {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500">
                        This will permanently delete <span className="font-bold text-gray-900">"{project?.name}"</span> and all associated tasks. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} className="border-gray-200">
                        Cancel
                    </AlertDialogCancel>
                    {/* We use a standard button here to handle the manual submit with processing state */}
                    <button
                        disabled={processing}
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {processing ? "Deleting..." : "Delete Project"}
                    </button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}