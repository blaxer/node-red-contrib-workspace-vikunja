# Node-RED Vikunja Tasks Node

A Node-RED node to display and manage Vikunja tasks on the workspace.

## Features

- Display tasks from Vikunja on the Node-RED workspace
- Toggle task completion status
- Add new tasks
- Edit existing tasks
- Auto-refresh support
- Show on all flows option
- Collapsible task descriptions with HTML rendering

## Installation

```bash
cd ~/.node-red
npm install nodered-contrib-workspace-vikunja
```

Or via the Node-RED Palette Manager.

## Configuration

The node requires the following configuration:

- **URL**: Your Vikunja server URL (e.g., `https://try.vikunja.io`)
- **Project ID**: ID of the project to display tasks from
- **API Token**: Your Vikunja API token (create one in Vikunja settings)
- **Show Completed**: Toggle to show/hide completed tasks
- **Show on all flows**: Display tasks on every flow in the workspace (not just the node's flow)
- **Refresh**: Auto-refresh interval in minutes (0 = disabled)

## Input

The node accepts messages with `msg.payload` containing:

- `'refresh'` - Force refresh tasks
- `{ action: 'add', title: '...', description: '...' }` - Add new task with optional description
- `{ action: 'toggle', id: 123 }` - Toggle task completion
- `{ action: 'delete', id: 123 }` - Delete task
- `{ action: 'update', id: 123, data: {...} }` - Update task

## Output

The node sends messages with all tasks in `msg.payload`.

## Usage Notes

- **Task descriptions**: Click on a task title to expand/collapse its description. Descriptions support HTML formatting.
- **Show on all flows**: When enabled, tasks appear on all flows. All task actions are still controlled by the original node.
- **Task position**: Drag the task container to reposition it on the workspace.

## Example Flow

```json
[
    {
        "id": "vikunja-tasks-1",
        "type": "vikunja-tasks",
        "name": "My Tasks",
        "vikunjaUrl": "https://try.vikunja.io",
        "projectId": 1,
        "token": "your-token",
        "showCompleted": false,
        "showOnAllFlows": false,
        "refreshInterval": 5
    }
]
```

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines first.
