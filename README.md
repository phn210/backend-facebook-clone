# Backend service for Facebook clone mobile app

## > Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

Install MongoDB

### Step 2: Setup the project

Fork or download this project.

Then copy the `.env.example` file and rename it to `.env`. In this file you have to add your database connection information, swagger information

Create a new database with the name you have in your `.env`-file.

Install dependencies
```
npm i
```

### Step 3: Start the server

Run
```
npm start
```

## > API Routes

Access API Docs at
```
http[s]:<hostname>[:<port>]/api-docs
```

## > Project Structure

| Name                              | Description |
| --------------------------------- | ----------- |
| **src/**                          | Source files |
| **src/api/controllers/**          | REST API Controllers |
| **src/api/controllers/responses** | Response codes with json response bodies  |
| **src/api/middlewares/**          | Express Middlewares |
| **src/api/models/**               | Mongoose Models |
| **src/api/services/**             | Service layer |
| **src/lib/**                      | The core features like env variables and other utils |
| **src/database/**                 | Database connectors |
| **src/static/**                   | Static assets (contract abis, circuit artifacts, etc.) |
| .env.example                      | Environment configurations example |

## > Docker



