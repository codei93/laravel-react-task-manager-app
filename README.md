# Task Manager Project

A task management application built with Laravel, Inertia.js, React, and Tailwind CSS.

## Offline Installation Guide (Zip Distribution)

This project is distributed as a zip file. The `node_modules` and `vendor` folders are **not included** to keep the file size small. You will need to install these dependencies locally.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **PHP 8.2+** with the following extensions:
    *   OpenSSL
    *   PDO
    *   Mbstring
    *   Tokenizer
    *   XML
    *   Ctype
    *   JSON
2.  **Composer** (PHP package manager)
3.  **Node.js** (LTS version recommended) & **npm**
4.  **MySQL** (or MariaDB) database server
5.  **Database management tool** (optional, e.g., phpMyAdmin, TablePlus, or command line)

---

### Step 1: Extract the Project

Extract the zip file to your desired directory (e.g., `C:\projects\task-manager` or `/var/www/task-manager`).

### Step 2: Configure the Environment

1.  The `.env` file is included in the zip. Open it in your text editor.
2.  Update the database credentials to match your MySQL setup:
    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=task_manager
    DB_USERNAME=root
    DB_PASSWORD=your_mysql_password
    ```
3.  **Important**: Generate the application key by running the following command in your terminal (in the project root):
    ```bash
    php artisan key:generate
    ```

### Step 3: Setup the Database

1.  **Create the Database**:
    *   Open your MySQL client (command line or GUI).
    *   Create a new database named `task_manager`:
        ```sql
        CREATE DATABASE task_manager;
        ```
    *   If you prefer a different database name, update the `DB_DATABASE` value in your `.env` file accordingly.

2.  **Run Migrations**:
    *   In your terminal, navigate to the project root and run:
        ```bash
        php artisan migrate
        ```
    *   This will create all the necessary tables in your database.

3.  **(Optional) Seed the Database**:
    *   To populate the database with sample data, run:
        ```bash
        php artisan db:seed
        ```

### Step 4: Install Dependencies

Since the zip file does not include `node_modules` or `vendor`, you need to install them:

1.  **Install PHP Dependencies**:
    ```bash
    composer install
    ```

2.  **Install Node.js Dependencies**:
    ```bash
    npm install
    ```

### Step 5: Build the Frontend

Compile the frontend assets (CSS and JavaScript):
```bash
npm run build
```

### Step 6: Run the Application

You can now start the local development server:

```bash
php artisan serve
```

The application will be available at `http://127.0.0.1:8000`.

---

### Directory Structure Overview

*   `app/`: Contains the core application logic (Models, Services, Controllers).
*   `resources/js/`: Contains the React frontend components and Inertia.js pages.
*   `database/`: Contains database migrations and seeders.
*   `routes/`: Defines the application routes.
*   `vendor/`: (Generated) PHP dependencies.
*   `node_modules/`: (Generated) JavaScript dependencies.

### Troubleshooting

*   **"Class not found" error**: Run `composer dump-autoload`.
*   **Frontend assets not loading**: Ensure you ran `npm install` and `npm run build`.
*   **Database connection error**: Verify your MySQL credentials in `.env` and ensure the MySQL server is running.
*   **Permission issues**: Ensure the project directory has appropriate read/write permissions.

### Development

To run the project in development mode (with hot-reloading for frontend and backend):

```bash
composer run dev
```

This will start the PHP server, queue worker, logs, and Vite dev server simultaneously.
