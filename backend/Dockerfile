FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Set GRADLE_USER_HOME to manage Gradle cache within Docker
ENV GRADLE_USER_HOME=/app/.gradle

# Copy Gradle wrapper and build files first (for better caching)
COPY gradlew .
COPY gradle gradle/
COPY build.gradle .
COPY settings.gradle .
COPY gradle.properties* ./

# Fix line endings and make gradlew executable
RUN sed -i 's/\r$//' ./gradlew && chmod +x ./gradlew

# Copy source code
COPY src src/

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# Expose the application port
EXPOSE 8888

# Run the application
CMD ["./gradlew", "run", "--no-daemon"]
