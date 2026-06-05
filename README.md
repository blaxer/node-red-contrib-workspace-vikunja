# Node-RED Vikunja Tasks Node

A Node-RED node to display and manage Vikunja tasks on the workspace.

## Features

- Display tasks from Vikunja on the Node-RED workspace
- Toggle task completion status
- Add new tasks
- Edit existing tasks
- Auto-refresh support

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
- **Refresh**: Auto-refresh interval in minutes (0 = disabled)

## Input

The node accepts messages with `msg.payload` containing:

- `'refresh'` - Force refresh tasks
- `{ action: 'add', title: '...' }` - Add new task
- `{ action: 'toggle', id: 123 }` - Toggle task completion
- `{ action: 'delete', id: 123 }` - Delete task
- `{ action: 'update', id: 123, data: {...} }` - Update task

## Output

The node sends messages with all tasks in `msg.payload`.

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
        "refreshInterval": 5
    }
]
```

## License

MIT

## Contributing

Contributions are welcome! Please read the contributing guidelines first.
