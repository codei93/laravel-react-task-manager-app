# Task Manager Project

A task management application built with Laravel, Inertia.js, React, and Tailwind CSS.

**Source Code:** [https://github.com/codei93/laravel-react-task-manager-app](https://github.com/codei93/laravel-react-task-manager-app)

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
3.  **Node.js** (LTS version recommended) & **Yarn** (Install via `npm install -g yarn` if not already installed)
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
    yarn install
    ```

### Step 5: Build the Frontend

Compile the frontend assets (CSS and JavaScript):
```bash
yarn build
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

### Development

To run the project in development mode:

1.  **Start the Backend Server** (in one terminal):
    ```bash
    php artisan serve
    ```
    This will start the PHP development server at `http://127.0.0.1:8000`.

2.  **Start the Frontend Dev Server** (in a separate terminal):
    ```bash
    yarn dev
    ```
    This will start the Vite dev server for hot-reloading frontend assets.

> **Note:**
>   Alternatively, you can run `composer run dev` to start the backend, queue worker, logs, and Vite dev server simultaneously (this command uses `npm run dev` internally).

---

## Deployment to Laravel Cloud via GitHub

Follow these steps to deploy your Task Manager application to Laravel Cloud using GitHub integration.

### Prerequisites for Deployment

1.  **Laravel Cloud Account**: Sign up at [Laravel Cloud](https://laravel.cloud)
2.  **GitHub Repository**: Your project must be pushed to a GitHub repository
3.  **Laravel Cloud Project**: Create a new project on Laravel Cloud linked to your GitHub repository

### Step 1: Prepare Your Project for Deployment

Ensure your project is ready for production deployment:

1.  **Update `.env` for Production**:
    *   Set `APP_ENV=production`
    *   Set `APP_DEBUG=false`
    *   Configure your production database credentials
    *   Set `ASSET_URL` to your CDN if using one

2.  **Configure Build Steps**:
    *   Laravel Cloud automatically runs `composer install` and `yarn install` during deployment
    *   The build process will automatically run `yarn build` to compile frontend assets

3.  **Database Migrations**:
    *   Laravel Cloud can automatically run migrations after deployment
    *   Ensure your migrations are ready for production

### Step 2: Connect GitHub Repository

1.  **Push your code to GitHub**:
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

2.  **Create a new project on Laravel Cloud**:
    *   Go to [Laravel Cloud](https://laravel.cloud)
    *   Click "New Project"
    *   Select "GitHub" as the source
    *   Choose your repository
    *   Configure your project settings

### Step 3: Configure Environment Variables

In your Laravel Cloud project dashboard:

1.  Go to **Environment** tab
2.  Add your environment variables:
    *   `APP_KEY` (Laravel Cloud can generate this automatically)
    *   `DB_CONNECTION` (e.g., `mysql`)
    *   `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
    *   Any other production-specific variables

### Step 4: Configure Build Settings

In your Laravel Cloud project dashboard:

1.  Go to **Settings** → **Build**
2.  Configure the build command:
    *   **Build Command**: `yarn build`
    *   **Install Command**: `yarn install --frozen-lockfile`
    *   **Output Directory**: `public/build` (or wherever Vite outputs)

### Step 5: Deploy Your Application

1.  **Automatic Deployment**:
    *   Laravel Cloud can automatically deploy when you push to your main branch
    *   Enable "Auto-deploy" in your project settings

2.  **Manual Deployment**:
    *   Go to your Laravel Cloud project dashboard
    *   Click "Deploy" or "Trigger Deploy"
    *   Select the branch to deploy
    *   Wait for the deployment to complete

3.  **Monitor Deployment**:
    *   Check the deployment logs for any errors
    *   Verify the deployment status shows "Success"

### Step 6: Post-Deployment Tasks

After successful deployment:

1.  **Run Migrations** (if not automated):
    *   Go to **Databases** tab in Laravel Cloud
    *   Click "Run Migrations" or use the CLI

2.  **Seed Database** (optional):
    *   Run `php artisan db:seed` if needed

3.  **Verify Deployment**:
    *   Visit your application URL
    *   Test all functionality

### Laravel Cloud CLI (Alternative)

You can also use the Laravel Cloud CLI for deployment:

1.  **Install the CLI**:
    ```bash
    composer global require laravel/cloud-cli
    ```

2.  **Login to Laravel Cloud**:
    ```bash
    cloud login
    ```

3.  **Deploy from CLI**:
    ```bash
    cloud deploy
    ```

### Troubleshooting Deployment

*   **Build Failures**: Check the build logs in Laravel Cloud dashboard
*   **Database Connection**: Verify database credentials in environment variables
*   **Asset Loading**: Ensure `ASSET_URL` is configured if using CDN
*   **Migration Errors**: Check migration files and run manually if needed

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure production database
- [ ] Set strong application key
- [ ] Configure file storage (S3, etc.)
- [ ] Set up cache driver (Redis, etc.)
- [ ] Configure queue driver
- [ ] Set up SSL/HTTPS
- [ ] Configure domain/DNS

---

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
