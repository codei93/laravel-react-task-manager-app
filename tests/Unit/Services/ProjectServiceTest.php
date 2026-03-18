<?php

namespace Tests\Unit\Services;

use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * E2E Tests for ProjectService
 *
 * These tests verify the complete functionality of the ProjectService,
 * including CRUD operations and search functionality.
 */
class ProjectServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ProjectService $projectService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->projectService = new ProjectService;
    }

    /**
     * Test getting all projects without search term
     */
    public function test_get_all_projects_without_search(): void
    {
        // Arrange: Create some test projects
        Project::factory()->count(3)->create();

        // Act: Get all projects
        $projects = $this->projectService->getAll();

        // Assert: All projects are returned
        $this->assertCount(3, $projects);
        $this->assertInstanceOf(Collection::class, $projects);
    }

    /**
     * Test getting all projects with search term
     */
    public function test_get_all_projects_with_search_term(): void
    {
        // Arrange: Create projects with specific names
        Project::factory()->create(['name' => 'Project Alpha']);
        Project::factory()->create(['name' => 'Project Beta']);
        Project::factory()->create(['name' => 'Gamma Project']);

        // Act: Search for "Alpha"
        $projects = $this->projectService->getAll('Alpha');

        // Assert: Only matching projects are returned
        $this->assertCount(1, $projects);
        $this->assertEquals('Project Alpha', $projects->first()->name);
    }

    /**
     * Test getting all projects with search term matching description
     */
    public function test_get_all_projects_with_search_in_description(): void
    {
        // Arrange: Create projects with specific descriptions
        Project::factory()->create(['name' => 'Project 1', 'description' => 'This is a test project']);
        Project::factory()->create(['name' => 'Project 2', 'description' => 'Another description']);

        // Act: Search for "test"
        $projects = $this->projectService->getAll('test');

        // Assert: Project with matching description is returned
        $this->assertCount(1, $projects);
        $this->assertEquals('Project 1', $projects->first()->name);
    }

    /**
     * Test getting a single project by ID
     */
    public function test_get_project_by_id(): void
    {
        // Arrange: Create a project
        $project = Project::factory()->create(['name' => 'Test Project']);

        // Act: Get the project by ID
        $foundProject = $this->projectService->getById($project->id);

        // Assert: The correct project is returned
        $this->assertEquals($project->id, $foundProject->id);
        $this->assertEquals('Test Project', $foundProject->name);
    }

    /**
     * Test getting a non-existent project by ID throws exception
     */
    public function test_get_non_existent_project_by_id_throws_exception(): void
    {
        // Arrange: No projects exist

        // Assert: Exception is thrown
        $this->expectException(ModelNotFoundException::class);

        // Act: Try to get a non-existent project
        $this->projectService->getById(999);
    }

    /**
     * Test creating a new project
     */
    public function test_create_project(): void
    {
        // Arrange: Prepare project data
        $projectData = [
            'name' => 'New Project',
            'description' => 'This is a new project',
        ];

        // Act: Create the project
        $project = $this->projectService->create($projectData);

        // Assert: Project was created successfully
        $this->assertNotNull($project->id);
        $this->assertEquals('New Project', $project->name);
        $this->assertEquals('This is a new project', $project->description);
        $this->assertDatabaseHas('projects', ['name' => 'New Project']);
    }

    /**
     * Test updating an existing project
     */
    public function test_update_project(): void
    {
        // Arrange: Create a project
        $project = Project::factory()->create(['name' => 'Original Name']);

        // Act: Update the project
        $updatedProject = $this->projectService->update($project->id, [
            'name' => 'Updated Name',
            'description' => 'Updated description',
        ]);

        // Assert: Project was updated successfully
        $this->assertEquals('Updated Name', $updatedProject->name);
        $this->assertEquals('Updated description', $updatedProject->description);
        $this->assertDatabaseHas('projects', ['name' => 'Updated Name']);
        $this->assertDatabaseMissing('projects', ['name' => 'Original Name']);
    }

    /**
     * Test updating a non-existent project throws exception
     */
    public function test_update_non_existent_project_throws_exception(): void
    {
        // Arrange: No projects exist

        // Assert: Exception is thrown
        $this->expectException(ModelNotFoundException::class);

        // Act: Try to update a non-existent project
        $this->projectService->update(999, ['name' => 'Updated']);
    }

    /**
     * Test deleting a project
     */
    public function test_delete_project(): void
    {
        // Arrange: Create a project
        $project = Project::factory()->create();

        // Act: Delete the project
        $result = $this->projectService->delete($project->id);

        // Assert: Project was deleted successfully
        $this->assertTrue($result);
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    /**
     * Test deleting a non-existent project throws exception
     */
    public function test_delete_non_existent_project_throws_exception(): void
    {
        // Arrange: No projects exist

        // Assert: Exception is thrown
        $this->expectException(ModelNotFoundException::class);

        // Act: Try to delete a non-existent project
        $this->projectService->delete(999);
    }

    /**
     * Test that projects are returned with tasks count
     */
    public function test_get_all_projects_includes_tasks_count(): void
    {
        // Arrange: Create a project with tasks
        $project = Project::factory()->create();
        $project->tasks()->create([
            'title' => 'Task 1',
            'priority' => 'medium',
        ]);
        $project->tasks()->create([
            'title' => 'Task 2',
            'priority' => 'high',
        ]);

        // Act: Get all projects
        $projects = $this->projectService->getAll();

        // Assert: Projects include tasks_count
        $this->assertCount(1, $projects);
        $this->assertEquals(2, $projects->first()->tasks_count);
    }

    /**
     * Test that projects are returned in latest order
     */
    public function test_get_all_projects_returns_latest_first(): void
    {
        // Arrange: Create projects at different times
        $oldProject = Project::factory()->create(['name' => 'Old Project']);
        sleep(1);
        $newProject = Project::factory()->create(['name' => 'New Project']);

        // Act: Get all projects
        $projects = $this->projectService->getAll();

        // Assert: Newer project is returned first
        $this->assertEquals('New Project', $projects->first()->name);
        $this->assertEquals('Old Project', $projects->last()->name);
    }

    /**
     * Test empty search returns all projects
     */
    public function test_empty_search_returns_all_projects(): void
    {
        // Arrange: Create some projects
        Project::factory()->count(2)->create();

        // Act: Search with empty string
        $projects = $this->projectService->getAll('');

        // Assert: All projects are returned
        $this->assertCount(2, $projects);
    }

    /**
     * Test null search returns all projects
     */
    public function test_null_search_returns_all_projects(): void
    {
        // Arrange: Create some projects
        Project::factory()->count(2)->create();

        // Act: Search with null
        $projects = $this->projectService->getAll(null);

        // Assert: All projects are returned
        $this->assertCount(2, $projects);
    }
}
