# 💸 Flow-Fi Microservices Project

A microservices-based wallet and transaction system built with **Spring Boot**, **Spring Cloud (Eureka, Gateway)**, **PostgreSQL**, **React**, and **Docker**.

---

## 🚀 Services Overview

| Service             | Port  | Description                         |
|---------------------|-------|-------------------------------------|
| Service Discovery   | 8761  | Eureka registry for service lookup |
| API Gateway         | 8080  | Routes all incoming requests       |
| PostgreSQL          | 5432  | Backend database                   |

---

## 📛 Microservice Naming Conventions

| Type               | Naming Format                     | Example                                   |
|--------------------|------------------------------------|-------------------------------------------|
| Project Directory  | kebab-case                         | `servicename-service(e.g. login-service)` |
| Docker Container   | kebab-case                         | `servicename-service`                           |
| Spring App Name    | lowercase with hyphen (`spring.application.name`) | `servicename-service`                           |
| Eureka ID          | same as app name                   | `servicename-service`                           |
| Gateway Route ID   | same as app name                   | `servicename-service`                           |

---

## ➕ How to Add a New Microservice

### Step 1: Create Spring Boot Project

1. Name it using the convention (e.g., `transaction-service`).
2. Add required dependencies (Spring Web, Spring Boot DevTools, _Eureka Client_, etc.).
3. Set `spring.application.name=transaction-service` in `application.properties`.

---

### Step 2: Create Dockerfile

Place this in the root of your microservice project:

```Dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/your-app-name.jar app.jar
EXPOSE <your-port>
ENTRYPOINT ["java", "-jar", "app.jar"]
```
Replace <your-port> and your-app-name.jar accordingly.

### Step 3: Register in docker-compose.yml
Add this under services::

```yaml
  transaction-service:
    build: ./transaction-service
    container_name: transaction-service
    ports:
      - "8083:8083"
    depends_on:
      - service-discovery
    networks:
      - flownet   
```
### Step 4: Register in API Gateway
Add to application.properties of api-gateway:

```properties
spring.cloud.gateway.routes[2].id=transaction-service
spring.cloud.gateway.routes[2].uri=http://transaction-service:8083
spring.cloud.gateway.routes[2].predicates[0]=Path=/transaction-service/**
```
### ⚙️ Run All Services
```bash
docker-compose up --build
```

### 🗃 Directory Layout
```pgsql
flow-fi/
├── service-discovery/
├── api-gateway/
├── servicename-service/     <-- newly added service
├── docker-compose.yml
├── README.md
```
### 🔗 Service URLs
Service	URL
Eureka	http://localhost:8761
Gateway	http://localhost:8080
Login Service	http://localhost:8080/login-service/
Contact Service	http://localhost:8080/contact-service/
Transaction	http://localhost:8080/transaction-service/

### 🛑 .gitignore Important
```bash
# PostgreSQL and target files
/PGDATA/
/target/
/.idea/
/*.iml
*.log
```

### 🧾 Contribution Guide
Clone the repo and create a new branch:
```bash
git checkout -b feature/my-service
```
Add your microservice using steps above.

```bash
Test locally with docker-compose up --build.
```
Commit and push changes.

Open a PR and request review.