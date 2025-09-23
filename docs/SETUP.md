# ⚙️ Setup Guide - Full-Stack Blog Post Manager

This guide provides detailed, step-by-step instructions to set up your development environment and run the Full-Stack Blog Post Manager application locally. The project utilizes Docker for easy containerization of the backend services.

## 🛠️ System Requirements

Before you begin, ensure your system meets the following minimum requirements:

-   **Operating System**: Windows 10/11 (with [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) recommended for optimal Docker performance) or macOS.
-   **RAM**: 8GB or more recommended.
-   **Disk Space**: 5GB or more free space.
-   **Internet Connection**: Required for downloading dependencies and Docker images.

## ⚙️ Prerequisites (Installation Instructions)

Please install the following software on your machine:

1.  **Git**:
    *   **Purpose**: Version control system for cloning the repository.
    *   **Installation**: Download and install from [https://git-scm.com/downloads](https://git-scm.com/downloads).
    *   **Verification**: Open your terminal (WSL2 terminal on Windows) and run `git --version`.

2.  **Docker Desktop**:
    *   **Purpose**: Manages Docker containers for the backend (Micronaut API and PostgreSQL database).
    *   **Installation**: Download and install from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).
    *   **Important for Windows users**:
        *   Ensure [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) is installed and enabled.
        *   In Docker Desktop settings, go to `Settings > Resources > WSL Integration` and ensure your WSL distribution (e.g., Ubuntu) is enabled.
    *   **Verification**: Ensure Docker Desktop is running (you should see the whale icon 🐳 in your system tray). In your **WSL2 terminal**, run `docker --version` and `docker ps`.

3.  **Java Development Kit (JDK) 21**:
    *   **Purpose**: Required for building the Micronaut backend.
    *   **Installation**: Download and install JDK 21 (e.g., from [OpenJDK](https://openjdk.org/)). Ensure `JAVA_HOME` is set up correctly.
    *   **Verification**: In your terminal, run `java -version` (should show version 21 or higher).

4.  **Gradle**:
    *   **Purpose**: Build automation tool for the Micronaut backend. The project uses a Gradle Wrapper (`./gradlew`), so a global installation is not strictly required but ensures system-wide availability.
    *   **Verification**: In your terminal, run `gradle -v` (if globally installed) or `./gradlew -v` (within the `backend` directory).

5.  **Node.js & npm**:
    *   **Purpose**: Required for the React frontend (running the development server, installing packages, building for production). `npm` (Node Package Manager) is bundled with Node.js.
    *   **Installation**: Download and install the LTS version from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
    *   **Verification**: In your **Windows Command Prompt** (or PowerShell), run `node -v` and `npm -v`.
6.  **CRACO (Create React App Configuration Override)**:
    *   **Purpose**: This tool is used to customize Create React App's configuration (e.g., for Tailwind CSS). It's already included in your `package.json` dependencies, so you just need to ensure `npm install` runs it.

## 🏃 Running the Application (Step-by-Step)

Follow these steps to get the full-stack application running on your local machine:

1.  **Clone the Repository:**
    Open your **WSL2 terminal** (e.g., Ubuntu) and clone the project:
    ```bash
    git clone https://github.com/Ayesha1214/blog-post-manager.git
    # Navigate into the project's root directory
    cd blog-post-manager
    ```
2.  **Install Frontend Dependencies:**
    Navigate to the `frontend` directory in your **Windows Command Prompt** (or PowerShell) and install all Node.js dependencies:
    ```bash
    cd C:\Users\Ayesha\Desktop\blog-post-manager\frontend
    npm install
    ```
    *   *(This step installs React, Tailwind CSS, CRACO, and other frontend libraries.)*
3.  **Start the Backend (with Docker Compose):**
    Go back to your **WSL2 terminal** (in the project root `blog-post-manager`). This command will build your backend Docker image (which includes running tests), create the PostgreSQL database container, and start both services.
    ```bash
    docker-compose up --build --force-recreate
    ```
    *   *(**Important**: The initial run of this command will take several minutes as it downloads Docker images, builds the Java backend, and runs all tests. Subsequent `docker-compose up` commands will be much faster due to Docker caching.)*
    *   Wait for the logs to settle and show: `blog-backend | Startup completed... Server Running: http://<container_id>:8888`
4.  **Run the Frontend:**
    In the **same Windows Command Prompt** where you ran `npm install`, start the React development server:
    ```bash
    npm start
    ```
    *   Your browser should automatically open to `http://localhost:3000`.
    *   *(CRACO will automatically handle the Tailwind CSS compilation and integration.)*

### Access the Application

-   **Frontend UI**: Open your web browser and navigate to `http://localhost:3000`.
-   **Backend API Base URL**: `http://localhost:8888/api/posts`

### Testing the Backend API (Example `curl` commands from WSL2 terminal)
Once the backend containers are running, you can test the API directly:
```bash
# Check Backend Health Endpoint
curl http://localhost:8888/health

# Get all posts (should be empty initially)
curl http://localhost:8888/api/posts

# Create a new blog post
curl -X POST http://localhost:8888/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"First Post from API","content":"This is exciting content!","author":"Ayesha Namrata","published":true}'

# Get all posts again (should now show your new post)
curl http://localhost:8888/api/posts

# View a specific post (replace <ID> with the ID from the created post)
curl http://localhost:8888/api/posts/<ID>
