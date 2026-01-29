# WebSocket Integration for Task Management

## Overview

This application now supports real-time task updates using WebSocket technology (Socket.IO). Users will see task status changes instantly without needing to refresh the page.

## Features

### Real-Time Updates

- **Task Creation**: When an admin creates a new task, the assigned employee sees it immediately
- **Task Status Updates**: When an employee changes a task status (accept, complete, fail, decline), the admin sees the update in real-time
- **Multi-User Sync**: All connected users see changes as they happen

## Implementation Details

### Backend (`Management-backend`)

#### 1. Socket.IO Server Setup (`src/server.js`)

- Integrated Socket.IO with Express server
- Configured CORS for cross-origin WebSocket connections
- Added connection/disconnection logging

#### 2. Real-Time Events (`src/controllers/taskController.js`)

The backend emits two types of events:

**`taskCreated`** - Emitted when a new task is created

```javascript
io.emit("taskCreated", populatedTask);
```

**`taskUpdated`** - Emitted when a task status changes

```javascript
io.emit("taskUpdated", populatedTask);
```

### Frontend (`Management`)

#### 1. Socket Service (`src/services/socket.js`)

- Singleton service managing WebSocket connection
- Handles connection lifecycle (connect, disconnect, reconnect)
- Provides methods to listen for task events

#### 2. React Hook (`src/hooks/useSocket.js`)

- Custom hook initializing WebSocket connection
- Connects automatically when user is authenticated
- Cleans up connection on component unmount

#### 3. Components with Real-Time Updates

**Employee Dashboard** (`EmployeeDashboard.jsx`)

- Listens for `taskCreated` events
- Listens for `taskUpdated` events
- Automatically refreshes task list when updates occur

**Task Page** (`TaskPage.jsx`)

- Real-time updates for filtered task views
- Validates updates belong to current user

**Admin Task Registry** (`TaskRegistry.jsx`)

- Instant updates when tasks are created or modified
- Shows all task status changes in real-time

## Usage

### For Developers

#### Testing WebSocket Connection

1. **Open Browser Console** to see connection logs:
   - `🔌 WebSocket connected: [socket-id]` - Connection successful
   - `🆕 New task created: [task-object]` - Task created event received
   - `📝 Task updated: [task-object]` - Task updated event received

2. **Multi-Window Testing**:
   - Open two browser windows
   - Login as admin in one, employee in another
   - Create/update tasks and watch real-time sync

#### Socket Connection States

The socket service handles:

- **Connecting**: Initial connection to server
- **Connected**: Active WebSocket connection
- **Reconnecting**: Auto-reconnect on connection loss
- **Disconnected**: Clean disconnection (logout/tab close)

### Configuration

#### Backend Environment

No additional environment variables needed. Socket.IO uses the same port as Express server.

#### Frontend Socket URL

Configure in `src/services/socket.js`:

```javascript
const SOCKET_URL = "https://task-management-backend-woep.onrender.com";
```

For local development:

```javascript
const SOCKET_URL = "http://localhost:5000";
```

## Benefits

1. **Improved User Experience**: No manual refresh needed
2. **Real-Time Collaboration**: Multiple users stay synchronized
3. **Instant Feedback**: Immediate visual confirmation of actions
4. **Reduced Server Load**: Fewer polling requests
5. **Scalability**: Efficient bi-directional communication

## Troubleshooting

### Connection Issues

1. Check browser console for WebSocket errors
2. Verify backend server is running
3. Ensure CORS configuration allows frontend domain
4. Check network firewall settings

### Events Not Firing

1. Verify user authentication (socket connects only when logged in)
2. Check console for event logs
3. Ensure task update actions are calling the API correctly

### Multiple Event Firing

If seeing duplicate updates:

1. Check for multiple useEffect dependencies
2. Verify event listeners are properly cleaned up
3. Ensure component isn't re-mounting unexpectedly

## Future Enhancements

Potential improvements:

- Room-based communication (separate channels per admin/employee)
- Typing indicators for collaborative editing
- Online/offline user status
- Push notifications for critical updates
- Optimistic UI updates before server confirmation

## Dependencies

**Backend:**

- `socket.io`: ^4.8.1

**Frontend:**

- `socket.io-client`: ^4.8.1

## Code Examples

### Listening for Custom Events

```javascript
// In any component
import socketService from "@services/socket";

useEffect(() => {
  const handleCustomEvent = (data) => {
    console.log("Custom event:", data);
  };

  socketService.getSocket()?.on("customEvent", handleCustomEvent);

  return () => {
    socketService.off("customEvent", handleCustomEvent);
  };
}, []);
```

### Emitting Custom Events (Backend)

```javascript
// In any controller
const io = req.app.get("io");
io.emit("customEvent", { message: "Hello from server!" });
```

---

**Last Updated**: January 29, 2026
**Version**: 1.0.0
