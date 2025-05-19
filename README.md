## Features

- Create, Read, Update, Delete Customers
- Customer fields: First Name, Last Name, Email (unique), Contact Number
- Search customers by name or email
- Data sync to Elasticsearch for searching (using HTTP client)
- Dockerized with 4 services: API, Controller (Nginx), Database, Elasticsearch

## Prerequisites

- Docker & Docker Compose installed
- Node.js and Angular CLI (for frontend development)

## Setup & Run

### 1. Clone the repo

```bash
gh repo clone 1-kaiser/technical-exam-crud
cd technical-exam-crud
```

### 2. Start the docker environment

```bash
docker-compose up -d --build
```

### 3. Setup Laravel backend

```bash
docker exec -it api-container-name bash
composer install
php artisan migrate
php artisan key:generate
exit
```

### 4. Setup and run Angular frontend

```bash
cd customer-frontend
npm install
ng serve --open
```

### Testing

- Backend tests can be run inside the api container with PHPUnit.

- Frontend unit tests via

```bash
ng test
```
