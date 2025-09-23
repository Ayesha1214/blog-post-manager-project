# 🏛️ Architecture Overview - Full-Stack Blog Post Manager

This document outlines the architectural design, technology choices, and key components of the Full-Stack Blog Post Manager application. The system is designed for maintainability, scalability, and a robust user experience, adhering to modern best practices in full-stack development.

## 🌟 High-Level Architecture

The application follows a **Microservices-oriented architecture** with a clear separation of concerns between the frontend (UI), backend (API), and database. All services are containerized using Docker for consistent development, testing, and deployment environments.

```mermaid
graph TD
    User[User Browser] -->|HTTP/S| Frontend(React App)
    Frontend -->|HTTP/S API Calls| Backend(Micronaut API)
    Backend -->|JDBC| Database[PostgreSQL Database]

    subgraph Containerized Environment (Docker Compose)
        Backend
        Database
    end

Backend (API Layer)
    Framework: Micronaut (Java 21)
        Why Micronaut: Chosen for its fast startup times, low memory footprint, and compile-time dependency injection, making it ideal for microservices. It aligns with modern reactive and cloud-native principles.
    Language: Java 21
        Why Java: Leverages strong typing, mature ecosystem, and my existing proficiency.
    Database ORM: Micronaut Data JPA with Hibernate
        Why Micronaut Data JPA: Provides a simple, compile-time approach to data access, reducing boilerplate and improving performance compared to traditional runtime ORM solutions.
    Build Tool: Gradle
        Why Gradle: Flexible and powerful build automation, especially for multi-module projects and Docker integration.
    API Design: RESTful API
        Why RESTful: Standard for web services, ensuring statelessness, clear resource-based URLs, and standard HTTP methods.

Frontend (UI Layer)
    Library: React (TypeScript)
        Why React: Chosen for its component-based architecture, efficient UI updates (Virtual DOM), and large ecosystem.
    Language: TypeScript
        Why TypeScript: Enhances code quality, readability, and maintainability by adding static typing to JavaScript, reducing runtime errors.
    Styling: Tailwind CSS + Custom CSS
        Why Tailwind: Utility-first CSS framework for rapid UI development and highly customizable designs, integrated via CRACO. Custom CSS is used for complex animations and unique visual effects.
    Routing: React Router DOM
        Why React Router: Standard library for declarative routing in React applications, enabling seamless navigation between views.
    API Client: Axios
        Why Axios: Popular, promise-based HTTP client for making API requests from the browser.

Database Layer
    Database: PostgreSQL 15
        Why PostgreSQL: Robust, open-source relational database known for its reliability, feature richness, and strong support for data integrity. Ideal for persistent storage of blog post data.

Containerization & Deployment
    Containerization: Docker
        Why Docker: Ensures consistent environments across development and and deployment. Each service (backend, database) runs in its own isolated container.
    Orchestration: Docker Compose
        Why Docker Compose: Simplifies the management of multi-container Docker applications, allowing the entire stack to be built and run with a single command.
