# 🚀 Full-Stack Blog Post Manager

## 📋 Project Overview
A modern, high-performance, and visually stunning blog management system. This full-stack application allows users to create, view, update, and delete blog posts through an intuitive and interactive user interface, backed by a robust and containerized API.

## ✨ Features Implemented

### Core Functionality
- ✅ **Blog Post CRUD**: Comprehensive Create, Read, Update, and Delete operations for blog posts.
- ✅ **Dynamic Forms**: Multi-step, interactive forms for creating and editing posts with real-time validation.
- ✅ **Content Display**: Elegant and futuristic display of individual blog posts and a dynamic list view.
- ✅ **Search & Filtering**: Efficient searching of posts by title, content, and tags.

### Advanced Features (Bonus Points Achieved!)
- ✅ **Docker Containerization**: Full multi-container setup for the backend (Micronaut + PostgreSQL) for easy deployment and scalability.
- ✅ **Analytics Dashboard**: Visually impressive dashboard displaying key blog performance metrics (Total Posts, Published Posts, Views, etc.).
- ✅ **View Counter**: Automatic incrementing of post views when a post is accessed.
- ✅ **Responsive Design**: The entire application is designed to be fully responsive across various screen sizes.

## 🎨 Design Highlights (Frontend)
- **Ultra-Futuristic Aesthetic**: A unique, high-tech, and ethereal design with a captivating green color theme.
- **Dynamic Background**: An immersive, dark background with subtly animated geometric grids, shimmering light particles, and moving light trails that react to cursor movement.
- **Interactive Cursor**: A normal (circular), softly glowing cursor that harmonizes with the ethereal environment.
- **Elegant Typography**: A blend of futuristic fonts (`Orbitron`, `Rajdhani`, `Space Grotesk`, `Cinzel`) for a sophisticated tech-world feel.
- **Glassmorphism & Glowing Elements**: Futuristic cards, forms, and buttons with translucent effects, subtle glows, and dynamic hover animations (e.g., rotating border glows, inner light pulses).
- **Dynamic Hero Title**: A large, animated main title that shifts position and has a glitch effect on hover.

## 🚀 **Quick Start Guide**

### 🛠️ System Requirements
-   **Operating System**: Windows 10/11 (with WSL2 recommended) or macOS.
-   **RAM**: 8GB or more recommended.
-   **Disk Space**: 5GB or more free space.

### ⚙️ Prerequisites (Installation Instructions)

1.  **Git**:
    *   Install Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
2.  **Docker Desktop**:
    *   Install Docker Desktop: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
    *   **Important for Windows users**: Ensure [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) is installed and enabled, and Docker Desktop is configured to use the WSL2 backend.
    *   **Verify**: After installation, ensure Docker Desktop is running (whale icon 🐳 in system tray) and run `docker --version` in your terminal.
3.  **Node.js & npm**:
    *   Install Node.js (which includes npm): [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
    *   **Verify**: Run `node -v` and `npm -v` in your terminal.
4.  **CRACO (Create React App Configuration Override)**:
    *   This tool is used to customize Create React App's configuration (e.g., for Tailwind CSS). It's already included in your `package.json` dependencies, so you just need to ensure `npm install` runs it.

### 🏃 Running the Application

1.  **Clone the Repository:**
    Open your **WSL2 terminal** (e.g., Ubuntu) and run:
    ```bash
    git clone https://github.com/Ayesha1214/blog-post-manager.git
    # AFTER cloning, navigate into the project folder
    cd blog-post-manager
    ```
2.  **Install Frontend Dependencies:**
    Navigate to the `frontend` directory in your **Windows Command Prompt** (or PowerShell) and install dependencies, including CRACO and Tailwind.
    ```bash
    cd C:\Users\Ayesha\Desktop\blog-post-manager\frontend
    npm install
    ```
3.  **Start the Backend (with Docker Compose):**
    In your **WSL2 terminal** (in the project root `blog-post-manager`), run:
    ```bash
    docker-compose up --build
    ```
    *   *(Note: The initial build can take several minutes as Docker downloads images, builds the backend, and runs tests. Subsequent `docker-compose up` commands will be much faster.)*
    *   Wait for the logs to show `blog-backend | Startup completed... Server Running: http://<container_id>:8888`
4.  **Run the Frontend:**
    In the **same Windows Command Prompt** where you ran `npm install`, you have two options to run the frontend (CRACO will automatically handle the Tailwind configuration):

    *   **Option A: Development Mode (Recommended for Review)**
        This starts a development server with hot-reloading.
        ```bash
        npm start
        ```
        *   Your browser should automatically open to `http://localhost:3000`.

    *   **Option B: Production Build (Optimized)**
        This builds the optimized production assets. You'll then need to serve them.
        ```bash
        npm run build
        ```
        After building, you can serve the `build` folder using a simple static server (e.g., `serve` npm package or Python's `http.server` module).
        ```bash
        # Install 'serve' if you don't have it
        npm install -g serve
        # Navigate to the build folder and serve
        cd build
        serve -s .
        ```
        *   This will serve the production build, usually on `http://localhost:3000` or a similar port.

### Access the Application
-   **Frontend UI**: Navigate to `http://localhost:3000` in your web browser.
-   **Backend API Base**: `http://localhost:8888/api/posts`

### Testing the API (Example `curl` commands from WSL2 terminal)
```bash
# Check Backend Health
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
