import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
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
import { Button } from '../ui/button';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    task: { id: number; title: string } | null;
}

export default function TaskDeleteModal({ isOpen, onClose, task }: Props) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!task) return;

        destroy(route('tasks.destroy', task.id), {
            onSuccess: () => onClose(),
            preserveScroll: true,
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-white border-gray-200">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900 font-bold">
                        Delete Task?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500">
                        Are you sure you want to delete <span className="font-semibold text-gray-800">"{task?.title}"</span>? 
                        This action will remove the task permanently from the project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel 
                        onClick={onClose} 
                        className="border-gray-200 text-gray-500 hover:bg-gray-50 "
                    >
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        disabled={processing}
                        onClick={handleDelete}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {processing ? "Deleting..." : "Delete Task"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}