# Vikunja API Reference

**Version:** v2.3.0  
**Base URL:** `/api/v1`  
**Authentication:** JWT Bearer Token via `Authorization: Bearer <token>` header

---

## Table of Contents
1. [Projects](#projects)
2. [Tasks](#tasks)
3. [Task Operations](#task-operations)
4. [Labels](#labels)
5. [Assignees](#assignees)
6. [Attachments](#attachments)
7. [Comments](#comments)
8. [Authentication](#authentication)
9. [Pagination & Headers](#pagination--headers)
10. [Error Handling](#error-handling)

---

## Projects

### List All Projects
```
GET /api/v1/projects
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page
- `s` (string): Search by title
- `is_archived` (boolean): Include archived projects
- `expand=permissions`: Include max permission level

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Project Name",
    "description": "Project description",
    "created": "2024-01-01T00:00:00Z",
    "updated": "2024-01-01T00:00:00Z",
    "is_archived": false,
    "permission": 1
  }
]
```

### Create Project
```
PUT /api/v1/projects
```

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "parent_id": 1
}
```

**Response (201):** Created project object

### Get Project by ID
```
GET /api/v1/projects/{id}
```

**Response (200):** Project object

### Update Project
```
POST /api/v1/projects/{id}
```

**Request Body:** Project object with updated fields

### Delete Project
```
DELETE /api/v1/projects/{id}
```

**Response (200):**
```json
{"message": "Project deleted successfully"}
```

---

## Tasks

### List Tasks in Project
```
GET /api/v1/projects/{project_id}/tasks
```

**Query Parameters:**
- `page` (integer): Page number
- `per_page` (integer): Items per page
- `expand`: Comma-separated list (e.g., `assignees,labels,comments`)
- `filter`: Vikunja filter query string

**Response (200):**
```json
[
  {
    "id": 123,
    "title": "Task Title",
    "description": "Task description",
    "done": false,
    "due_date": "2024-12-31T00:00:00Z",
    "priority": 0,
    "position": 0,
    "project_id": 1,
    "created": "2024-01-01T00:00:00Z",
    "updated": "2024-01-01T00:00:00Z",
    "assignees": [],
    "labels": [],
    "comments": []
  }
]
```

### Create Task
```
PUT /api/v1/projects/{project_id}/tasks
```

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "due_date": "2024-12-31T00:00:00Z",
  "priority": 0,
  "bucket_id": 1
}
```

**Response (201):** Created task object

### Get Task by ID
```
GET /api/v1/tasks/{id}
```

**Response (200):** Task object

### Update Task
```
POST /api/v1/tasks/{id}
```

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "done": true,
  "due_date": "2024-12-31T00:00:00Z",
  "priority": 1
}
```

**Response (200):** Updated task object

### Delete Task
```
DELETE /api/v1/tasks/{id}
```

**Response (200):**
```json
{"message": "Task deleted"}
```

---

## Task Operations

### Update Task Position
```
POST /api/v1/tasks/{id}/position
```

**Request Body:**
```json
{
  "project_view_id": 1,
  "position": 123.45
}
```

### Mark Task as Read
```
POST /api/v1/tasks/{task_id}/read
```

### Duplicate Task
```
PUT /api/v1/tasks/{task_id}/duplicate
```

**Response (201):**
```json
{
  "duplicated_task": { /* task object */ }
}
```

---

## Labels

### List Labels
```
GET /api/v1/labels
```

**Query Parameters:**
- `page`, `per_page`, `s` (search)

### Create Label
```
PUT /api/v1/labels
```

**Request Body:**
```json
{
  "title": "High Priority",
  "hex_color": "#ff0000"
}
```

### Update Label
```
PUT /api/v1/labels/{id}
```

### Delete Label
```
DELETE /api/v1/labels/{id}
```

### Add Label to Task
```
PUT /api/v1/tasks/{task_id}/labels/{label_id}
```

### Remove Label from Task
```
DELETE /api/v1/tasks/{task_id}/labels/{label_id}
```

### Bulk Update Task Labels
```
POST /api/v1/tasks/{task_id}/labels/bulk
```

**Request Body:**
```json
{
  "label": [1, 2, 3]
}
```

---

## Assignees

### Get Task Assignees
```
GET /api/v1/tasks/{task_id}/assignees
```

### Add Assignee
```
PUT /api/v1/tasks/{task_id}/assignees
```

**Request Body:**
```json
{
  "user_id": 1
}
```

### Bulk Assignees
```
POST /api/v1/tasks/{task_id}/assignees/bulk
```

**Request Body:**
```json
{
  "assignee": [1, 2, 3]
}
```

### Remove Assignee
```
DELETE /api/v1/tasks/{task_id}/assignees/{user_id}
```

---

## Attachments

### Get Task Attachments
```
GET /api/v1/tasks/{task_id}/attachments
```

### Upload Attachment
```
PUT /api/v1/tasks/{task_id}/attachments
```
**Content-Type:** `multipart/form-data`

**Form Fields:**
- `files`: File upload (multiple allowed)

### Download Attachment
```
GET /api/v1/tasks/{task_id}/attachments/{attachment_id}
```

**Query Parameters:**
- `preview_size`: `sm`, `md`, `lg`, or `xl`

### Delete Attachment
```
DELETE /api/v1/tasks/{task_id}/attachments/{attachment_id}
```

---

## Comments

### Get Task Comments
```
GET /api/v1/tasks/{task_id}/comments
```

**Query Parameters:**
- `order_by`: `asc` or `desc`

### Create Comment
```
PUT /api/v1/tasks/{task_id}/comments
```

**Request Body:**
```json
{
  "comment": "Task comment text"
}
```

### Update Comment
```
POST /api/v1/tasks/{task_id}/comments/{comment_id}
```

### Delete Comment
```
DELETE /api/v1/tasks/{task_id}/comments/{comment_id}
```

---

## Authentication

### Login
```
POST /api/v1/login
```

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password",
  "long_token": false
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here"
}
```

### Get Current User
```
GET /api/v1/user
```

**Response (200):**
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "name": "User Name",
  "settings": { /* user settings */ }
}
```

---

## Pagination & Headers

All paginated endpoints return these headers:
- `X-Pagination-Total-Pages`: Total number of pages
- `X-Pagination-Result-Count`: Number of items in response

Single-item endpoints (project, task) return:
- `X-Max-Permission`: User's permission level (0=Read, 1=Read&Write, 2=Admin)

---

## Error Handling

All errors include:
- HTTP status code
- Error code (integer)
- Human-readable message

**Response Format:**
```json
{
  "code": 1001,
  "message": "Error message"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `403`: Forbidden (no access)
- `404`: Not Found
- `500`: Internal Server Error

---

## Task Object Structure

```json
{
  "id": 123,
  "identifier": "PRJ-42",
  "title": "Task Title",
  "description": "Task description",
  "done": false,
  "done_at": "2024-01-01T00:00:00Z",
  "due_date": "2024-12-31T00:00:00Z",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-01-02T00:00:00Z",
  "priority": 0,
  "position": 0,
  "percent_done": 0,
  "hex_color": "#ff0000",
  "index": 42,
  "project_id": 1,
  "bucket_id": 1,
  "is_favorite": false,
  "is_unread": false,
  "created": "2024-01-01T00:00:00Z",
  "created_by": { /* user object */ },
  "updated": "2024-01-01T00:00:00Z",
  "assignees": [{ /* user objects */ }],
  "labels": [{ /* label objects */ }],
  "attachments": [{ /* attachment objects */ }],
  "comments": [{ /* comment objects */ }],
  "reminders": [{ /* reminder objects */ }],
  "repeat_after": 86400,
  "repeat_mode": 0,
  "subscription": { /* subscription object */ }
}
```

---

## User Object Structure

```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "name": "User Name",
  "created": "2024-01-01T00:00:00Z",
  "updated": "2024-01-01T00:00:00Z",
  "bot_owner_id": 0
}
```

---

## Permission Levels

| Value | Name | Description |
|-------|------|-------------|
| 0 | Read Only | View only |
| 1 | Read & Write | Create/edit content |
| 2 | Admin | Manage project/settings |

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Task positions use float64 for fine-grained sorting
- Some fields are system-controlled and cannot be set via API (e.g., `created`, `updated`, `done_at`)
- Use the `/info` endpoint to check instance configuration and feature availability
