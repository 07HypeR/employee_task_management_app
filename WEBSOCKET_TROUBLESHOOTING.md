# WebSocket Troubleshooting Guide

## Current Status

**✅ Frontend Changes:** Complete and loaded
**❓ Backend Changes:** Need verification

## Step-by-Step Debugging

### 1. Check Browser Console

Open your browser's Developer Console (press F12) and look for these logs:

**On Page Load:**

```
🔄 Connecting to WebSocket... https://task-management-backend-woep.onrender.com
✅ WebSocket connected: [socket-id]
👂 Registering listener for: taskCreated
👂 Registering listener for: taskUpdated
```

**If you see "Queuing listener" messages:**

```
⏸️ Queuing listener for: taskCreated (socket not connected yet)
```

This means listeners are being registered before connection completes (normal - they'll attach when connected).

**When listeners attach:**

```
📎 Attaching queued listener for: taskCreated
📎 Attaching queued listener for: taskUpdated
```

### 2. Check Debug Panel

Look at the top-right corner of your screen. You should see a **WebSocket Debug Panel** showing:

- ✅ Connected: Yes/No
- Socket ID
- Queued Listeners count

**Click "Test Connection"** to verify the socket is initialized.

### 3. Test Event Reception

**📨 ALL incoming events are logged automatically**

When the backend emits any event, you'll see:

```
📨 Received event: taskCreated [{task object}]
```

If you DON'T see this log when creating/updating tasks, the backend isn't emitting events.

### 4. Test Task Creation (Admin → Employee)

1. **Open TWO browser windows/tabs:**
   - Window A: Login as **Employee**
   - Window B: Login as **Admin** (use incognito or different browser)

2. **In Admin window (B):**
   - Create a new task
   - Assign it to the Employee

3. **Watch both consoles:**

**Admin Console Should Show:**

```
📨 Received event: taskCreated [Object]
🆕 Registry: New task created: {task}
```

**Employee Console Should Show:**

```
📨 Received event: taskCreated [Object]
🆕 EmployeeDashboard: New task created: {task}
🔍 Checking if task is for user: [employeeId] Task assigned to: [employeeId]
✅ Task is for this user, refreshing tasks...
```

### 5. Test Task Update (Employee → Admin)

1. **In Employee window (A):**
   - Click "Accept" on a task

2. **Watch both consoles:**

**Employee Console:**

```
📨 Received event: taskUpdated [Object]
📝 EmployeeDashboard: Task updated: {task}
✅ Task belongs to this user, refreshing tasks...
```

**Admin Console:**

```
📨 Received event: taskUpdated [Object]
📝 Registry: Task updated: {task}
```

## Common Issues & Solutions

### Issue 1: Socket Connects But No Events Received

**Symptom:**

```
✅ WebSocket connected: abc123
```

But no `📨 Received event:` logs when creating/updating tasks.

**Solution:**
The backend is NOT emitting events. This means:

- Backend server hasn't been restarted with WebSocket changes
- OR backend is deployed on Render but changes haven't been deployed

**Fix:**

- If running locally: Restart backend server
- If on Render: Redeploy the backend

### Issue 2: Socket Doesn't Connect

**Symptom:**

```
🔄 Connecting to WebSocket...
🔥 WebSocket connection error: ...
```

**Solutions:**

1. Check if backend server is running
2. Check CORS settings on backend
3. Try browser's network tab to see WebSocket connection attempts
4. Check if firewall is blocking WebSocket

### Issue 3: Events Received But UI Doesn't Update

**Symptom:**

```
📨 Received event: taskCreated [Object]
🆕 EmployeeDashboard: New task created: {task}
⏭️ Task not for this user, skipping refresh
```

**Solution:**
The task filtering logic is working correctly - this task isn't for the current user. This is expected behavior.

If you see:

```
✅ Task is for this user, refreshing tasks...
```

But UI still doesn't update, check if `fetchTasks()` is working properly.

### Issue 4: Multiple Event Firings

**Symptom:**
Same event received multiple times.

**Solution:**
Component is re-mounting or re-subscribing. Check dependency arrays in useEffect.

## Backend Deployment Check

### If Backend is on Render:

1. **Check if backend has latest code:**
   - Go to Render dashboard
   - Check last deployment time
   - Look for Socket.IO changes in deployment logs

2. **Redeploy if needed:**
   - Push backend changes to GitHub
   - Render will auto-deploy (if auto-deploy enabled)
   - OR manually trigger deploy on Render dashboard

3. **Check backend logs:**
   Look for these startup messages:

   ```
   🚀 Server running on port 5000
   📝 Environment: production
   🔌 WebSocket server ready
   ```

   When client connects:

   ```
   ✅ Client connected: [socket-id]
   ```

### If Backend is Local:

1. **Ensure socket.io is installed:**

   ```bash
   cd Management-backend
   npm list socket.io
   ```

   Should show `socket.io@4.x.x`

2. **Restart the server:**

   ```bash
   npm run dev
   ```

3. **Update frontend socket URL** (if testing locally):
   Edit `src/services/socket.js` line 3:
   ```javascript
   const SOCKET_URL = "http://localhost:5000";
   ```

## Quick Test Commands

### Test in Browser Console:

```javascript
// Check socket status
socketService.getStatus();

// Check if socket exists
socketService.getSocket();

// Check socket connection
socketService.getSocket()?.connected;
```

## Expected Console Output (Complete Flow)

### Page Load:

```
🔄 Connecting to WebSocket... https://task-management-backend-woep.onrender.com
🏠 EmployeeDashboard: Setting up socket listeners for user: [userId]
👂 Registering listener for: taskCreated
⏸️ Queuing listener for: taskCreated (socket not connected yet)
👂 Registering listener for: taskUpdated
⏸️ Queuing listener for: taskUpdated (socket not connected yet)
✅ WebSocket connected: abc123
📎 Attaching queued listener for: taskCreated
📎 Attaching queued listener for: taskUpdated
```

### Task Created:

```
📨 Received event: taskCreated [{...}]
🆕 EmployeeDashboard: New task created: {...}
🔍 Checking if task is for user: [userId] Task assigned to: [userId]
✅ Task is for this user, refreshing tasks...
```

### Task Updated:

```
📨 Received event: taskUpdated [{...}]
📝 EmployeeDashboard: Task updated: {...}
🔍 Checking if task belongs to user: [userId] Task assigned to: [userId]
✅ Task belongs to this user, refreshing tasks...
```

## Next Steps

1. ✅ Check console logs
2. ✅ Check Debug Panel
3. ✅ Test with two windows
4. ✅ Verify backend is emitting events
5. ✅ If no events: Redeploy/restart backend

---

**Debug Panel:** The debug panel at top-right shows real-time status. It will log events as they arrive!

**Remove Debug Panel:** After fixing, remove `<SocketDebugPanel />` from `App.jsx`
