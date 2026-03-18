<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Represents a project entity in the application.
 *
 * A project can contain multiple tasks and serves as a container
 * for organizing related work items.
 */
class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get all tasks associated with this project.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
