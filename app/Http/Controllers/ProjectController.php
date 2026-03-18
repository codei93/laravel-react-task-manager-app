<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * The ProjectService instance.
     */
    protected ProjectService $projectService;

    /**
     * ProjectController constructor.
     */
    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Get all projects.
     */
    public function index(Request $request)
    {
        // Get search term from the URL query string
        $searchTerm = $request->query('search');

        return Inertia::render('Index', [
            'projects' => $this->projectService->getAll($searchTerm),
            'filters' => [
                'search' => $searchTerm
            ]
        ]);
    }

    /**
     * Get a single project by ID.
     */
    public function show(int $id): JsonResponse
    {
        return response()->json($this->projectService->getById($id));
    }

    /**
     * Create a new project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate(['name' => 'required|unique:projects|max:255', 'description' => 'nullable']);
        $this->projectService->create($validated);
        return back();
    }

    /**
     * Update an existing project.
     */
    public function update(Request $request, Project $project)
    {
        $validated = $request->validate(['name' => "required|unique:projects,name,{$project->id}|max:255", 'description' => 'nullable']);
        $this->projectService->update($project->id, $validated);
        return back();
    }

    /**
     * Delete a project.
     */
    public function destroy(int $id)
    {
        $this->projectService->delete($id);
        return back();
    }
}
