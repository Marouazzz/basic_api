# Project Setup and Execution

## Backend

### Run Tests

Run the Jest tests:

```bash
npm test
```

### Build Docker Image

```bash
docker build -t basic_api .
```

### Run Docker Container

```bash
docker run -d -p 3000:3000 --name basic_api basic_api
```

The backend API will be available at `http://localhost:3000`.

## Frontend

### Build Docker Image

```bash
docker build -t basic_api_frontend:latest -f client/Dockerfile .
```

### Run Docker Container

```bash
docker run -d -p 8080:80 --name basic_api_frontend basic_api_frontend
```

The frontend will be available at `http://localhost:8080`.
# Project Setup and Execution

## Backend

### 1. Run Tests

Run the Jest test suite:

```bash
npm test
```  

### 2. Build Docker Image

```bash
docker build -t basic_api .
```

### 3. Run Docker Container

```bash
docker run -d -p 3000:3000 --name basic_api basic_api
```

The backend API will be available at:

**http://localhost:3000**

## Frontend

### 1. Build Docker Image

```bash
docker build -t basic_api_frontend:latest -f client/Dockerfile .
```

### 2. Run Docker Container

```bash
docker run -d -p 8080:80 --name basic_api_frontend basic_api_frontend:latest
```

The frontend application will be available at:

**http://localhost:8080**
