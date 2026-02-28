# Chat Application API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the request header:
```
Authorization: Bearer <your_jwt_token>
```

Or use cookies (automatically set after login).

---

## Authentication Endpoints

### POST /api/auth/register
Registers a new user account.

**Headers:**
- Content-Type: application/json

**Request Body:**
```json
{
  "username": "john",
  "email": "john@gmail.com",
  "password": "123"
}
```

**Response (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john",
  "email": "john@gmail.com"
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Email already registered

---

### POST /api/auth/login
Authenticates a user and returns a JWT token.

**Headers:**
- Content-Type: application/json

**Request Body:**
```json
{
  "email": "john@gmail.com",
  "password": "123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john",
    "email": "john@gmail.com"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### POST /api/auth/logout
Logs out the user by clearing the authentication cookie.

**Headers:**
- Content-Type: application/json

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

---

## User Endpoints
*All user endpoints require authentication*

### GET /api/users/me
Get the current authenticated user's profile.

**Headers:**
- Authorization: Bearer <your_jwt_token>

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "john",
  "email": "john@gmail.com"
}
```

---

### GET /api/users/search
Search for users by username or email.

**Headers:**
- Authorization: Bearer <your_jwt_token>

**Query Parameters:**
- `q` (required) - Search query for username/email

**Example URL:**
```
GET /api/users/search?q=john
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john",
    "email": "john@gmail.com"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "johnny",
    "email": "johnny@example.com"
  }
]
```

**Error Responses:**
- `400` - Search query is required

---

## Message Endpoints
*All message endpoints require authentication*

### POST /api/messages
Send a message to another user.

**Headers:**
- Authorization: Bearer <your_jwt_token>
- Content-Type: application/json

**Request Body:**
```json
{
  "chatId": "507f1f77bcf86cd799439011",
  "receiverId": "507f1f77bcf86cd799439012",
  "text": "Hello there!"
}
```

**Notes:**
- Either `chatId` OR `receiverId` is required
- If `chatId` is provided, message is sent to existing chat
- If only `receiverId` is provided, new chat is created automatically

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "chatId": "507f1f77bcf86cd799439011",
  "sender": "507f1f77bcf86cd799439011",
  "text": "Hello there!",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `400` - Text is required or neither chatId nor receiverId provided
- `404` - Chat not found (if chatId provided)

---

### DELETE /api/messages/:id
Delete a message (only the sender can delete their own messages).

**Headers:**
- Authorization: Bearer <your_jwt_token>
- Content-Type: application/json

**URL Parameters:**
- `id` - Message ID to delete

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "message": "Message deleted successfully"
}
```

**Error Responses:**
- `400` - Message ID required
- `403` - Not allowed to delete this message
- `404` - Message not found

---

## Chat Endpoints
*All chat endpoints require authentication*

### GET /api/chats
Get all chats for the authenticated user.

**Headers:**
- Authorization: Bearer <your_jwt_token>

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "participants": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "username": "john"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "username": "jane"
      }
    ],
    "latestMessage": {
      "_id": "507f1f77bcf86cd799439013",
      "text": "Hello there!",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### GET /api/chats/:chatId/messages
Get all messages in a specific chat.

**Headers:**
- Authorization: Bearer <your_jwt_token>

**URL Parameters:**
- `chatId` - Chat ID

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "chatId": "507f1f77bcf86cd799439011",
    "sender": "507f1f77bcf86cd799439011",
    "text": "Hello there!",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "chatId": "507f1f77bcf86cd799439011",
    "sender": "507f1f77bcf86cd799439012",
    "text": "Hi John!",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
]
```

**Error Responses:**
- `404` - Chat not found or user not a participant

---

## WebSocket Events

### Connection Authentication
WebSocket connections require JWT authentication during handshake.

**Connection:**
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token_here'
  }
});
```

### Events

#### joinChat
Join a 1-on-1 chat room.

**Emit:**
```javascript
socket.emit('joinChat', {
  otherUserId: '507f1f77bcf86cd799439012'
});
```

**Response (Success):**
- User joins the chat room

**Response (Error):**
```javascript
socket.on('error', (message) => {
  // 'Chat does not exist'
});
```

---

#### sendMessage
Send a message through WebSocket.

**Emit:**
```javascript
socket.emit('sendMessage', {
  otherUserId: '507f1f77bcf86cd799439012',
  text: 'Hello there!'
});
```

**Broadcast to Room:**
```javascript
socket.on('newMessage', (message) => {
  // Message object same as HTTP API response
});
```

---

#### deleteMessage
Delete a message through WebSocket.

**Emit:**
```javascript
socket.emit('deleteMessage', {
  messageId: '507f1f77bcf86cd799439013',
  otherUserId: '507f1f77bcf86cd799439012'
});
```

**Broadcast to Room:**
```javascript
socket.on('messageDeleted', (data) => {
  // { messageId: '507f1f77bcf86cd799439013' }
});
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Application Constraints

- **1-to-1 Chat Only**: All chats are limited to exactly 2 participants
- **Real-time Communication**: Use WebSocket events for instant messaging
- **Authentication Required**: All operations except register/login require valid JWT
- **Message Ownership**: Users can only delete their own messages

---

## Testing with Postman

1. **Register User**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login` (copy the token)
3. **Set Authorization**: Add Bearer token to headers
4. **Test Other Endpoints**: Use the token for authenticated requests

---

## Environment Variables

Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - Token expiration (default: 15m)
- `CLIENT_URL` - Frontend URL for CORS
- `NODE_ENV` - Environment (development/production)
