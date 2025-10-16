# Multi-stage Dockerfile for building and running the Spring Boot (Java 17) app
# Builder: uses Maven + JDK 17 to produce the fat jar
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy only the pom first to leverage Docker cache for dependency download
COPY pom.xml ./
COPY src ./src

# build the application (skip tests for faster image builds by default)
RUN mvn -B -DskipTests package


# Runtime stage: small JRE image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the packaged jar. Use wildcard to be resilient to jar naming.
COPY --from=build /workspace/target/dataset-api-0.0.1-SNAPSHOT.jar ./app.jar

# Optional: create a non-root user for better security
RUN addgroup --system app && adduser --system --ingroup app app || true
USER app

# Expose default Spring Boot port
EXPOSE 8080

# Allow runtime JAVA_OPTS injection
ENV JAVA_OPTS=""

# Start the application (uses shell form so JAVA_OPTS is expanded)
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
