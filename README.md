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

Install Docker and Docker Compose

Setup the project

Run
```
docker-compose up
```

## > Rest API Docs

`<host_url>/api-docs`

## > WebSocket Events

### Server Side

### Client Side

#### Publish channels

```
// Emit in every session
socket.emit('initiate', {
    token                    // JWT Token
}
```
```
// Emit when open a conversation
socket.emit('join_conversation', {
    token,                  // JWT Token
    partner_id              // Partner's Id
}
```
```
// Emit when send an message
socket.emit('send_message', {
    token,                  // JWT Token
    partner_id,             // Partner's Id
    content                 // Message's content
}
```
#### Subcribe channels

```
// Emitted when an action succeeded
socket.on('action_success', {
    action,                 // JWT Token
    data                    // Action's data
}
```
```
// Emitted when open a conversation
socket.on('receive_message', {
    message_id,             // Message's Id
    content,                // Message's Content
    created_at              // Timestamp 
}
```
```
/*
 * Emitted when a connection is closed by the server
 * Disconnect socket
 */

socket.on('disconnect', {})
```