<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

/**
 * Service class for handling Task-related business logic.
 *
 * Provides CRUD operations for tasks.
 */
class TaskService
{
    /**
     * Get all tasks.
     */
    public function getAll(?string $searchTerm = null, ?int $projectId = null): Collection
    {
        return Task::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('priority', 'like', "%{$search}%");
            })
            ->when($projectId, function ($query, $projectId) {
                $query->where('project_id', $projectId);
            })
            ->with('project')
            ->orderBy('order_sequence', 'asc')
            ->get();
    }

    /**
     * Get all tasks for a specific project.
     */
    public function getByProject(int $projectId): Collection
    {
        return Task::where('project_id', $projectId)->get();
    }

    /**
     * Get a single task by ID.
     *
     * @throws ModelNotFoundException
     */
    public function getById(int $id): Task
    {
        return Task::findOrFail($id);
    }

    /**
     * Create a new task.
     */
    public function create(array $data): Task
    {
        return Task::create($data);
    }

    /**
     * Update an existing task.
     *
     * @throws ModelNotFoundException
     */
    public function update(int $id, array $data): Task
    {
        $task = $this->getById($id);
        $task->update($data);

        return $task;
    }

    /**
     * Delete a task.
     *
     * @throws ModelNotFoundException
     */
    public function delete(int $id): bool
    {
        $task = $this->getById($id);

        return $task->delete();
    }

    /**
     * Update order sequence for multiple tasks using a database transaction.
     */
    public function updateOrderSequence(array $orders): bool
    {
        DB::transaction(function () use ($orders) {
            foreach ($orders as $order) {
                $task = $this->getById($order['id']);
                $task->update(['order_sequence' => $order['order_sequence']]);
            }
        });

        return true;
    }
}
