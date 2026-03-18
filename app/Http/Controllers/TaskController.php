<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Services\ProjectService;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * The TaskService instance.
     */
    protected TaskService $taskService;

    /**
     * The ProjectService instance.
     */
    protected ProjectService $projectService;

    /**
     * TaskController constructor.
     */
    public function __construct(TaskService $taskService, ProjectService $projectService)
    {
        $this->taskService = $taskService;
        $this->projectService = $projectService;
    }

    /**
     * Get all tasks.
     */
    public function index(Request $request)
    {
        // Get search term from the URL query string
        $searchTerm = $request->query('search');

        return Inertia::render('Tasks/Index', [
            'projects' => $this->projectService->getAll(),
            'tasks' => $this->taskService->getAll($searchTerm),
            'filters' => [
                'search' => $searchTerm,
            ],
        ]);
    }

    /**
     * Get a single task by ID.
     */
    public function show(int $id): JsonResponse
    {
        return response()->json($this->taskService->getById($id));
    }

    /**
     * Create a new task.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|unique:tasks,title|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        $this->taskService->create($validated);

        return back();
    }

    /**
     * Update an existing task.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        $this->taskService->update($task->id, $validated);

        return back();
    }

    /**
     * Delete a task.
     */
    public function destroy(int $id)
    {
        $this->taskService->delete($id);

        return back();
    }

    /**
     * Reorder tasks by updating their order_sequence.
     */
    public function reorder(Request $request)
    {
        $orders = $request->input('orders');

        $this->taskService->updateOrderSequence($orders);

        return back();
    }
}
