# Auth Service

Enterprise authentication microservice built with Clean Architecture.

## Architecture Layers

- **Domain**: Business entities (User)
- **Application**: Use cases (LoginUseCase)
- **Infrastructure**: External dependencies (DB, Repositories)
- **Interfaces**: HTTP API endpoints

## Local Development

```bash
npm install
cp .env.example .env
npm start
```

## Docker Build

```bash
docker build -t auth-service .
docker run -p 3000:3000 auth-service
```

## API

- POST /login - Authenticate user
- GET /health - Health check
