# Vikunja Node-RED Node - Complete Project Plan

## Current Status: v1.0.5 - Table Column Widths & API Fix (COMMIT: 4067f6f)

### Completed
- [x] Table displays on workspace using z-index configuration
- [x] Task title and 3 buttons (toggle, edit, delete) in 2 columns
- [x] Collapse functionality added
- [x] Drag functionality added
- [x] Filter by `done` field
- [x] Auto-refresh support
- [x] No external dependencies (uses Node.js built-in http/https)
- [x] Admin endpoint for task actions (toggle, edit, delete, add, update)
- [x] Fixed task creation to use PUT method per Vikunja API spec
- [x] Removed z-index configuration, hardcoded to 1000
- [x] Fixed table column widths: first column 100%, second column auto
- [x] Added grid lines to task table
- [x] Removed debug console.log statements

### Files
- `node/vikunja-tasks.js` - Node runtime logic
- `node/vikunja-tasks.html` - Node UI with workspace display
- `node/lib/api.js` - API client (Node.js built-in http/https)
- `package.json` - Package configuration
- `PROJECT_PLAN.md` - This file
- `README.md` - User documentation

### Completed
- [x] Created package.json with all dependencies (node-red)
- [x] Created basic node structure (HTML + JS)
- [x] Implemented configuration dialog with all parameters
- [x] Added credential support (API token)
- [x] Created API client library (using Node.js built-in http/https modules)
- [x] Added task loading and display logic
- [x] Created interactive UI with task rendering
- [x] Implemented input handlers for task actions (refresh, add, toggle, delete, update)
- [x] Created README with installation and usage instructions
- [x] Created sample flow file for testing

### In Progress
- [ ] Test with real Vikunja instance to verify API endpoints
- [ ] Verify task interaction handlers work correctly

### Next Phase
- [ ] Test with real Vikunja instance
- [ ] Add i18n support
- [ ] Add unit tests
- [ ] Publish to npm

---

## Design Overview

### Node Type
- **Category**: Output node (display on workspace)
- **Function**: Display and interact with Vikunja tasks directly in Node-RED workspace
- **Type**: `vikunja-tasks`

### Key Features
1. Display tasks from Vikunja on the Node-RED workspace
2. Click to toggle task completion status
3. Add new tasks
4. Edit existing tasks
5. Refresh task list

### Configuration Parameters
- **Vikunja URL**: Server URL (e.g., `https://try.vikunja.io`)
- **API Token**: Authentication token (stored as credential)
- **Project ID**: Project to display tasks from
- **Refresh Interval**: Auto-refresh frequency (optional, in minutes)
- **Show Completed**: Toggle to show/hide completed tasks

---

## Architecture

### File Structure
```
nodered-contrib-workspace-vikunja/
├── package.json              # Node package configuration
├── README.md                 # User documentation
├── CHANGELOG.md              # Version history
├── PROJECT_PLAN.md          # This file - planning and status
├── API_DOCUMENTATION.md     # Vikunja API reference
├── DEVELOPMENT_NOTES.md     # Development notes and troubleshooting
├── node/
│   ├── vikunja-tasks.js     # Node runtime logic
│   ├── vikunja-tasks.html   # Node UI (HTML/JS/CSS)
│   └── lib/
│       └── api.js           # API client library
└── examples/
    └── sample-flow.json     # Example flow
```

### Component Architecture

#### 1. Node Runtime (vikunja-tasks.js)
- Extends Node-RED node base class
- Handles API communication with Vikunja
- Manages task state
- Emits messages on event triggers
- Auto-refresh support
- Error handling

#### 2. Node UI (vikunja-tasks.html)
- Renders task cards on workspace
- Handles user interactions (click, edit, add)
- Uses CSS Grid/Flexbox for task layout
- Real-time updates

#### 3. API Client (lib/api.js)
- Uses axios for HTTP requests
- Handles authentication via Bearer token
- Centralized error handling
- Methods: getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion

---

## Implementation Tasks

### Phase 1: Basic Structure ✅ COMPLETE
- [x] Create package.json with Node-RED dependencies
- [x] Create basic node structure (HTML + JS)
- [x] Implement configuration dialog
- [x] Add credential support (API token)
- [x] Create API client library (using Node.js built-in http/https modules)
- [x] Implement task loading
- [x] Create SVG icon

### Phase 2: Core Functionality ✅ COMPLETE
- [x] Implement Vikunja API client (no external dependencies)
- [x] Fetch tasks from API
- [x] Display tasks as widgets on workspace canvas
- [x] Handle task rendering (card layout)
- [x] Add interactive task widgets with toggle/delete buttons

### Phase 3: Fix Errors ✅ COMPLETE
- [x] Removed browser DOM APIs from Node.js code
- [x] Fixed credential type registration
- [x] Cleaned up node registration

### Phase 4: Workspace Display ✅ COMPLETE
- [x] Implemented frontend comms for canvas widgets
- [x] Tasks appear on workspace canvas as interactive widgets
- [x] Click to toggle completion or delete
- [x] Follows the workspace-banner pattern

### Phase 5: Polish ✅ COMPLETE
- [x] Made task spacing tighter
- [x] Implemented 2-column grid layout (name + buttons)
- [x] Added collapse/expand capability
- [x] Fixed showCompleted filter
- [x] Fixed button display issues

### Phase 6: API Fix ✅ COMPLETE
- [x] Changed task creation from POST to PUT per Vikunja API spec
- [x] Removed manual Content-Length header

### Phase 7: Interaction ✅ COMPLETE
- [x] Implement click to toggle completion
- [x] Add new task functionality
- [x] Edit existing task functionality
- [x] Delete task functionality

### Phase 8: Polish ✅ COMPLETE
- [x] Add refresh button
- [x] Implement auto-refresh (optional)
- [x] Add error handling and status indicators
- [x] Add help documentation
- [x] Create icons

### Phase 9: Code Cleanup ✅ COMPLETE
- [x] Removed z-index configuration from node config
- [x] Removed z-index input field from UI
- [x] Removed z-index from help documentation

### Phase 10: Table Layout Fix ✅ COMPLETE
- [x] Set first column to 100% width
- [x] Removed width from button column to auto-size
- [x] Added border to all table cells for grid lines

---

## API Integration Details

### Vikunja API Endpoints Used
```
Base URL: {vikunja-url}/api/v1

GET    /projects/{id}/tasks    - List tasks
PUT    /projects/{id}/tasks    - Create task
POST   /tasks/{id}             - Update task
DELETE /tasks/{id}             - Delete task
POST   /tasks/{id}             - Toggle completion (send done: true/false)
```

### Request Headers
```
Authorization: Bearer {api-token}
Content-Type: application/json
```

### Task Data Model
```json
{
  "id": 123,
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "due_date": "2024-01-01",
  "priority": 0,
  "project_id": 1
}
```

### Message Format

**Input Messages:**
- `msg.payload = 'refresh'` - Force refresh tasks
- `msg.payload = { action: 'add', title: '...', description: '...' }` - Add task
- `msg.payload = { action: 'toggle', id: 123 }` - Toggle completion
- `msg.payload = { action: 'delete', id: 123 }` - Delete task
- `msg.payload = { action: 'update', id: 123, data: {...} }` - Update task

**Output Messages:**
- `msg.payload` - Array of tasks
- `msg.topic` - Always 'tasks'
- `msg.projectId` - Current project ID

---

## Next Steps

1. **Test with real Vikunja instance** - Verify all API endpoints work correctly
2. **Verify task interaction handlers** - Ensure click handlers and buttons work
3. **Add i18n support** - Internationalization for multiple languages
4. **Add unit tests** - Test API client and node logic
5. **Publish to npm** - Make available to Node-RED community

---

## Known Limitations

1. **Workspace Display**: Tasks are displayed as node properties, not actual widgets on the workspace canvas
2. **Task Editing UI**: Editing requires input messages, not direct UI editing
3. **Error Recovery**: Basic error handling, could be improved with retry logic
4. **API Endpoint Verification**: Need to verify against actual Vikunja API

---

## Development Notes

### Key Design Decisions
- Output node type (displays on workspace)
- Single input accepting actions (refresh, add, toggle, delete, update)
- Single output sending task list updates
- Uses axios for HTTP requests
- Bearer token authentication
- Configurable refresh interval

### Security Considerations
- API tokens stored as credentials (not in flow)
- HTTPS recommended for production
- Token should have minimal required permissions

### Troubleshooting
- Check Vikunja URL is correct
- Verify API token is valid
- Check project ID exists
- Verify network connectivity
- Check browser console for errors

---

## Files Reference

### package.json
- Node-RED dependency
- axios dependency for HTTP requests
- Node-RED node registration

### node/vikunja-tasks.js
- Main node runtime logic
- Task loading and management
- Input message handlers
- Auto-refresh timer

### node/vikunja-tasks.html
- Node configuration UI
- Help documentation
- Task display CSS
- JavaScript for node registration

### node/lib/api.js
- Vikunja API client
- HTTP request handling
- Error handling
- Task CRUD operations

### examples/sample-flow.json
- Example Node-RED flow
- Shows node configuration
- Example input messages

---

## Session Notes
- Starting fresh build
- Focus on workspace display first
- Keep it simple initially, add features incrementally
- All documentation in single PROJECT_PLAN.md file

---

## Summary

### Project Files Created

| File | Purpose |
|------|---------|
| `package.json` | Node package configuration |
| `PROJECT_PLAN.md` | **Single comprehensive file** with all planning and status |
| `README.md` | User documentation |
| `node/vikunja-tasks.js` | Node runtime logic |
| `node/vikunja-tasks.html` | Node UI (HTML/CSS/JS) |
| `node/lib/api.js` | API client library |
| `examples/sample-flow.json` | Example flow |

### Node Configuration Parameters
- **Vikunja URL**: Server URL (e.g., `https://try.vikunja.io`)
- **Project ID**: Project to display tasks from
- **API Token**: Authentication token (credential)
- **Show Completed**: Toggle to show/hide completed tasks
- **Refresh Interval**: Auto-refresh frequency in minutes (0 = disabled)

**Note**: Node uses Node.js built-in `http`/`https` modules - no external dependencies required

### Node Actions
- **Input**: `refresh`, `add`, `toggle`, `delete`, `update`
- **Output**: Task list array

### Status: v1.0.5 - Table column widths fixed, z-index removed, grid lines added, PUT method for task creation

**⚠️ CRITICAL: Admin Endpoint Pattern for HTML Button Actions**
- HTML buttons MUST use `fetch()` to call admin endpoint `/vikunja-tasks/:id/action`
- DO NOT use `RED.comms.publish()` from HTML - it won't reach node input handlers
- Admin endpoint is the ONLY reliable way to get onclick events from HTML to node runtime
- This pattern was discovered after nearly a full day of debugging

**⚠️ CRITICAL: Vikunja API v1 Endpoints**
- Use PUT /projects/{id}/tasks to create new tasks (NOT POST)
- POST /tasks/{id} with { "done": true } toggles completion
- POST /tasks/{id} with { "title": "..." } updates task title
- Use GET /projects/{id}/tasks to fetch tasks from a project

**⚠️ CRITICAL: HTML Table Layout Best Practices**
- When displaying interactive widgets on Node-RED workspace, use HTML TABLE elements (not divs)
- Div-based layouts break the Node-RED editor design surface and create spacing issues
- Use HTML deprecated `align="right"` attribute for table cell content alignment (not CSS textAlign)
- Table cells with colspan work correctly with align="right"
- Append table rows directly to tables, not to container divs
- For header with title and button: use table with 2 cells - left for title, right for button

**⚠️ CRITICAL: Git Best Practices**
- NEVER run `git reset --hard` unless you're absolutely sure you want to discard changes
- Running `git reset --hard HEAD~N` resets the branch pointer but commits still exist in reflog
- Use `git log` to verify commits before resetting
- Use `git reflog` to recover from accidental resets
- Always check `git status` and `git log` before running reset commands

- Uses RED.comms for frontend communication (same pattern as workspace-banner)
- Tasks appear in a 2-column grid layout (name + 3 buttons)
- Click to toggle completion, edit, or delete
- Drag the task container to reposition
- Collapse/expand tasks with arrow button (right-aligned in header table)
- Show completed tasks filter works
- Auto-refresh support
- Node status shows active task count
- Admin endpoint working for all task actions (toggle, edit, delete, add, update)
- HTML buttons use fetch API for task interactions
- Task creation uses PUT method per Vikunja API spec
- Table layout: first column 100%, second column auto-sized
- Grid lines visible on all table cells
