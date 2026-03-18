<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Service class for handling Project-related business logic.
 *
 * Provides CRUD operations for projects.
 */
class ProjectService
{
    /**
     * Get all projects.
     */
    public function getAll(string $searchTerm = null): Collection
    {
        return Project::query()
            ->when($searchTerm, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->withCount('tasks')
            ->latest()
            ->get();
    }

    /**
     * Get a single project by ID.
     *
     * @throws ModelNotFoundException
     */
    public function getById(int $id): Project
    {
        return Project::findOrFail($id);
    }

    /**
     * Create a new project.
     */
    public function create(array $data): Project
    {
        return Project::create($data);
    }

    /**
     * Update an existing project.
     *
     * @throws ModelNotFoundException
     */
    public function update(int $id, array $data): Project
    {
        $project = $this->getById($id);
        $project->update($data);

        return $project;
    }

    /**
     * Delete a project.
     *
     * @throws ModelNotFoundException
     */
    public function delete(int $id): bool
    {
        $project = $this->getById($id);

        return $project->delete();
    }
}
