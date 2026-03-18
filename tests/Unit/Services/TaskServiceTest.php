<?php

namespace Tests\Unit\Services;

use App\Models\Project;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * E2E Tests for TaskService
 *
 * These tests verify the complete functionality of the TaskService,
 * including CRUD operations, search functionality, and project filtering.
 */
class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    protected TaskService $taskService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->taskService = new TaskService;
    }

    /**
     * Test getting all tasks without filters
     */
    public function test_get_all_tasks_without_filters(): void
    {
        // Arrange: Create some test tasks
        $project = Project::factory()->create();
        Task::factory()->count(3)->create(['project_id' => $project->id]);

        // Act: Get all tasks
        $tasks = $this->taskService->getAll();

        // Assert: All tasks are returned
        $this->assertCount(3, $tasks);
        $this->assertInstanceOf(Collection::class, $tasks);
    }

    /**
     * Test getting all tasks with search term
     */
    public function test_get_all_tasks_with_search_term(): void
    {
        // Arrange: Create tasks with specific titles
        $project = Project::factory()->create();
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Fix login bug']);
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Update dashboard']);
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Deploy to production']);

        // Act: Search for "login"
        $tasks = $this->taskService->getAll('login');

        // Assert: Only matching tasks are returned
        $this->assertCount(1, $tasks);
        $this->assertEquals('Fix login bug', $tasks->first()->title);
    }

    /**
     * Test getting all tasks with search in description
     */
    public function test_get_all_tasks_with_search_in_description(): void
    {
        // Arrange: Create tasks with specific descriptions
        $project = Project::factory()->create();
        Task::factory()->create([
            'project_id' => $project->id,
            'title' => 'Task 1',
            'description' => 'This task involves database optimization',
        ]);
        Task::factory()->create([
            'project_id' => $project->id,
            'title' => 'Task 2',
            'description' => 'Another task description',
        ]);

        // Act: Search for "database"
        $tasks = $this->taskService->getAll('database');

        // Assert: Task with matching description is returned
        $this->assertCount(1, $tasks);
        $this->assertEquals('Task 1', $tasks->first()->title);
    }

    /**
     * Test getting all tasks with search in priority
     */
    public function test_get_all_tasks_with_search_in_priority(): void
    {
        // Arrange: Create tasks with different priorities
        $project = Project::factory()->create();
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 1', 'priority' => 'high']);
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 2', 'priority' => 'medium']);
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 3', 'priority' => 'low']);

        // Act: Search for "high"
        $tasks = $this->taskService->getAll('high');

        // Assert: Only high priority tasks are returned
        $this->assertCount(1, $tasks);
        $this->assertEquals('high', $tasks->first()->priority);
    }

    /**
     * Test getting all tasks filtered by project
     */
    public function test_get_all_tasks_filtered_by_project(): void
    {
        // Arrange: Create tasks for different projects
        $project1 = Project::factory()->create(['name' => 'Project 1']);
        $project2 = Project::factory()->create(['name' => 'Project 2']);

        Task::factory()->create(['project_id' => $project1->id, 'title' => 'Task for Project 1']);
        Task::factory()->create(['project_id' => $project2->id, 'title' => 'Task for Project 2']);

        // Act: Get tasks for Project 1 only
        $tasks = $this->taskService->getAll(null, $project1->id);

        // Assert: Only tasks from Project 1 are returned
        $this->assertCount(1, $tasks);
        $this->assertEquals('Task for Project 1', $tasks->first()->title);
    }

    /**
     * Test getting all tasks with both search and project filter
     */
    public function test_get_all_tasks_with_search_and_project_filter(): void
    {
        // Arrange: Create tasks for different projects
        $project1 = Project::factory()->create(['name' => 'Project 1']);
        $project2 = Project::factory()->create(['name' => 'Project 2']);

        Task::factory()->create(['project_id' => $project1->id, 'title' => 'Fix login bug in Project 1']);
        Task::factory()->create(['project_id' => $project1->id, 'title' => 'Update dashboard']);
        Task::factory()->create(['project_id' => $project2->id, 'title' => 'Fix login bug in Project 2']);

        // Act: Search for "dashboard" in Project 1 only
        $tasks = $this->taskService->getAll('dashboard', $project1->id);

        // Assert: Only matching task from Project 1 is returned
        $this->assertCount(1, $tasks);
        $this->assertEquals('Update dashboard', $tasks->first()->title);
        $this->assertEquals($project1->id, $tasks->first()->project_id);
    }

    /**
     * Test getting tasks ordered by order_sequence
     */
    public function test_get_all_tasks_ordered_by_sequence(): void
    {
        // Arrange: Create tasks with different order sequences
        $project = Project::factory()->create();
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Third Task', 'order_sequence' => 2]);
        Task::factory()->create(['project_id' => $project->id, 'title' => 'First Task', 'order_sequence' => 0]);
        Task::factory()->create(['project_id' => $project->id, 'title' => 'Second Task', 'order_sequence' => 1]);

        // Act: Get all tasks
        $tasks = $this->taskService->getAll();

        // Assert: Tasks are returned in correct order
        $this->assertEquals('First Task', $tasks[0]->title);
        $this->assertEquals('Second Task', $tasks[1]->title);
        $this->assertEquals('Third Task', $tasks[2]->title);
    }

    /**
     * Test getting tasks with project relationship loaded
     */
    public function test_get_all_tasks_includes_project_relationship(): void
    {
        // Arrange: Create a task with a project
        $project = Project::factory()->create(['name' => 'Test Project']);
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'title' => 'Test Task',
        ]);

        // Act: Get all tasks
        $tasks = $this->taskService->getAll();

        // Assert: Project relationship is loaded
        $this->assertCount(1, $tasks);
        $this->assertNotNull($tasks->first()->project);
        $this->assertEquals('Test Project', $tasks->first()->project->name);
    }

    /**
     * Test getting tasks for a specific project
     */
    public function test_get_by_project(): void
    {
        // Arrange: Create tasks for different projects
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();

        Task::factory()->create(['project_id' => $project1->id, 'title' => 'Task 1']);
        Task::factory()->create(['project_id' => $project2->id, 'title' => 'Task 2']);

        // Act: Get tasks for Project 1
        $tasks = $this->taskService->getByProject($project1->id);

        // Assert: Only tasks from Project 1 are returned
        $this->assertCount(1, $tasks);
        $this->assertEquals('Task 1', $tasks->first()->title);
    }

    /**
     * Test getting a single task by ID
     */
    public function test_get_task_by_id(): void
    {
        // Arrange: Create a task
        $project = Project::factory()->create();
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'title' => 'Test Task',
        ]);

        // Act: Get the task by ID
        $foundTask = $this->taskService->getById($task->id);

        // Assert: The correct task is returned
        $this->assertEquals($task->id, $foundTask->id);
        $this->assertEquals('Test Task', $foundTask->title);
    }

    /**
     * Test getting a non-existent task by ID throws exception
     */
    public function test_get_non_existent_task_by_id_throws_exception(): void
    {
        // Arrange: No tasks exist

        // Assert: Exception is thrown
        $this->expectException(ModelNotFoundException::class);

        // Act: Try to get a non-existent task
        $this->taskService->getById(999);
    }

    /**
     * Test creating a new task
     */
    public function test_create_task(): void
    {
        // Arrange: Prepare task data
        $project = Project::factory()->create();
        $taskData = [
            'project_id' => $project->id,
            'title' => 'New Task',
            'description' => 'This is a new task',
            'priority' => 'medium',
        ];

        // Act: Create the task
        $task = $this->taskService->create($taskData);

        // Assert: Task was created successfully
        $this->assertNotNull($task->id);
        $this->assertEquals('New Task', $task->title);
        $this->assertEquals('This is a new task', $task->description);
        $this->assertEquals('medium', $task->priority);
        $this->assertDatabaseHas('tasks', ['title' => 'New Task']);
    }

    /**
     * Test updating an existing task
     */
    public function test_update_task(): void
    {
        // Arrange: Create a task
        $project = Project::factory()->create();
        $task = Task::factory()->create([
            'project_id' => $project->id,
            'title' => 'Original Title',
            'priority' => 'low',
        ]);

        // Act: Update the task
        $updatedTask = $this->taskService->update($task->id, [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'priority' => 'high',
        ]);

        // Assert: Task was updated successfully
        $this->assertEquals('Updated Title', $updatedTask->title);
        $this->assertEquals('Updated description', $updatedTask->description);
        $this->assertEquals('high', $updatedTask->priority);
        $this->assertDatabaseHas('tasks', ['title' => 'Updated Title']);
        $this->assertDatabaseMissing('tasks', ['title' => 'Original Title']);
    }

    /**
     * Test updating a non-existent task throws exception
     */
    public function test_update_non_existent_task_throws_exception(): void
    {
        // Arrange: No tasks exist

        // Assert: Exception is thrown
        $this->expectException(ModelNotFoundException::class);

        // Act: Try to update a non-existent task
        $this->taskService->update(999, ['title' => 'Updated']);
    }

    /**
     * Test deleting a task
     */
    public function test_delete_task(): void
    {
        // Arrange: Create a task
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        // Act: Delete the task
        $result = $this->taskService->delete($task->id);

        // Assert: Task was deleted successfully
        $this->assertTrue($result);
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /**
     * Test deleting a non-existent task throws exception
     */
    public function test_delete_non_existent_task_throws_exception(): void
    {
        // Arrange: No tasks exist

        // Assert: Exception is thrown
        $this->expectException(ModelNotFoundException::class);

        // Act: Try to delete a non-existent task
        $this->taskService->delete(999);
    }

    /**
     * Test updating order sequence for multiple tasks
     */
    public function test_update_order_sequence(): void
    {
        // Arrange: Create tasks with initial order
        $project = Project::factory()->create();
        $task1 = Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 1', 'order_sequence' => 0]);
        $task2 = Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 2', 'order_sequence' => 1]);
        $task3 = Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 3', 'order_sequence' => 2]);

        // Act: Update order sequence
        $orders = [
            ['id' => $task1->id, 'order_sequence' => 2],
            ['id' => $task2->id, 'order_sequence' => 0],
            ['id' => $task3->id, 'order_sequence' => 1],
        ];
        $result = $this->taskService->updateOrderSequence($orders);

        // Assert: Order was updated successfully
        $this->assertTrue($result);

        // Refresh tasks from database
        $task1->refresh();
        $task2->refresh();
        $task3->refresh();

        $this->assertEquals(2, $task1->order_sequence);
        $this->assertEquals(0, $task2->order_sequence);
        $this->assertEquals(1, $task3->order_sequence);
    }

    /**
     * Test empty search returns all tasks
     */
    public function test_empty_search_returns_all_tasks(): void
    {
        // Arrange: Create some tasks
        $project = Project::factory()->create();
        Task::factory()->count(2)->create(['project_id' => $project->id]);

        // Act: Search with empty string
        $tasks = $this->taskService->getAll('');

        // Assert: All tasks are returned
        $this->assertCount(2, $tasks);
    }

    /**
     * Test null search returns all tasks
     */
    public function test_null_search_returns_all_tasks(): void
    {
        // Arrange: Create some tasks
        $project = Project::factory()->create();
        Task::factory()->count(2)->create(['project_id' => $project->id]);

        // Act: Search with null
        $tasks = $this->taskService->getAll(null);

        // Assert: All tasks are returned
        $this->assertCount(2, $tasks);
    }

    /**
     * Test null project ID returns all tasks
     */
    public function test_null_project_id_returns_all_tasks(): void
    {
        // Arrange: Create tasks for different projects
        $project1 = Project::factory()->create();
        $project2 = Project::factory()->create();

        Task::factory()->create(['project_id' => $project1->id]);
        Task::factory()->create(['project_id' => $project2->id]);

        // Act: Get all tasks with null project ID
        $tasks = $this->taskService->getAll(null, null);

        // Assert: All tasks are returned
        $this->assertCount(2, $tasks);
    }
}
