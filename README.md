# Campus Connect - React Native Mobile App

A comprehensive college management mobile application built with React Native and Expo, powered by Express.js backend and MongoDB database. Connects students, teachers, and administrators with integrated group chat, event management, and notifications.

## Features

### Student Features
- ?? Take mock tests created by teachers
- ?? View test results and performance analytics
- ? Ask doubts to teachers with real-time replies
- ?? Request and manage library books
- ?? Download study notes uploaded by teachers
-  View announcements and updates
-  Join community discussions
-  Register for college events
-  Get instant notifications
-  Join interest-based group chats with priorities
-  Access WhatsApp AI support

### Teacher Features
-  Create and manage mock tests
-  Upload study materials (PDFs)
-  View and reply to student doubts
-  Post announcements to students
-  Participate in community discussions
-  Create and manage college events
-  Manage event attendance
-  Access group chats for coordination
-  Send notifications to students

### Admin Features
-  Approve/reject student and teacher registrations
-  Manage library (add books, mark availability, handle requests, set fines)
-  Track and manage fines for overdue books
-  View system analytics and user statistics
-  Full system control and user management

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Storage**: Local device storage (SecureStore for tokens)
- **Real-time**: Event-driven notifications system
- **Navigation**: React Navigation (Stack Navigator)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- MongoDB (local or cloud - MongoDB Atlas)
- Backend server running on port 5000

## Setup Instructions

### 1. Backend Setup

**Prerequisites:**
- MongoDB running locally or MongoDB Atlas account

**Steps:**

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start backend server
npm start
# Server should be running on http://localhost:5000
```

**Verify backend is running:**
```bash
curl http://localhost:5000
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Fix dependency conflicts (if any)
npx expo install --fix

# Start Metro bundler
npm start
```

**Then:**
- Press `a` for Android emulator (auto-connects to 10.0.2.2:5000)
- Press `i` for iOS simulator
- Press `w` for web
- Scan QR code with Expo Go app on your phone

### 3. MongoDB Configuration

**Local MongoDB:**
```bash
# Start MongoDB locally
mongod
# The app will connect to mongodb://127.0.0.1:27017/campass
```

**MongoDB Atlas (Cloud):**
- Update backend connection string with your MongoDB Atlas URL
- Format: `mongodb+srv://username:password@cluster.mongodb.net/campass?retryWrites=true&w=majority`

## Project Structure

```
mobile-app/
+-- backend/                 # Express server
¦   +-- server.js
¦   +-- package.json
¦   +-- middleware/
¦   ¦   +-- auth.js          # JWT verification
¦   +-- models/              # MongoDB schemas
¦   +-- routes/              # API endpoints
¦   +-- scripts/
¦       +-- add-dummy-data.js
+-- config/
¦   +-- api.js               # API service (auto-detects Android emulator)
+-- context/
¦   +-- UserContext.js       # Authentication context
+-- components/
¦   +-- NotificationBadge.js
¦   +-- UserHeader.js
¦   +-- WhatsAppAIButton.js  # Global WhatsApp AI button
+-- services/                # API service layer
+-- data/
¦   +-- mockGroupChatData.js # Mock group chat data (8 groups)
+-- screens/                 # UI screens by role
¦   +-- SplashScreen.js
¦   +-- RoleSelectorScreen.js
    auth/
    student/
    teacher/
    admin/
 App.js                   # Main navigation
 app.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Tests
- `GET /api/tests` - Get all tests
- `POST /api/tests/results` - Submit test result
- `GET /api/tests/results/my` - Get user's test results

### Library
- `GET /api/library/books` - Get all books
- `POST /api/library/requests` - Request a book
- `GET /api/library/requests/my` - Get user's requests

### Doubts
- `GET /api/doubts` - Get all doubts
- `POST /api/doubts` - Post a new doubt
- `POST /api/doubts/:id/reply` - Reply to a doubt

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Upload note

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `POST /api/events/:id/register` - Register for event

### Notifications
- `GET /api/notifications` - Get notifications
- `GET /api/notifications/count` - Get unread count

### Admin
- `GET /api/admin/users/pending` - Get pending approvals
- `POST /api/admin/users/:id/approve` - Approve user
- `GET /api/admin/fines` - Get fines

## Key Features

### Group Chat System
- 8 interest-based groups with role-based filtering
- Priority system (Low/Medium/High)
- Search and sort functionality
- Mock data for demonstration
- **Location**: `screens/student/GroupChatListScreen.js`, `screens/teacher/TeacherGroupChatScreen.js`

### Test Results with Mock Data
- 4 sample test results included
- Automatic percentage calculation
- Toggle via `USE_MOCK` in `TestResultsScreen.js`
- **Location**: `screens/student/TestResultsScreen.js`

### WhatsApp AI Support
- Global floating button on all screens
- Green WhatsApp-branded button (bottom-right)
- Links to: https://wa.me/15551572631
- **Location**: `components/WhatsAppAIButton.js`

### API Auto-Detection
- Automatically detects Android emulator (uses 10.0.2.2:5000)
- Respects EXPO_PUBLIC_API_URL environment variable
- Logs chosen base URL at startup
- **Location**: `config/api.js`

## Troubleshooting

### Network Errors

**"Network request failed" on Android emulator:**
```bash
# The app auto-uses 10.0.2.2:5000 for Android emulator
# Make sure backend is running:
curl http://localhost:5000

# Check Windows Firewall allows port 5000
```

**"Network request failed" on physical device:**
```bash
# Find your PC IP
ipconfig

# Set environment variable (replace with your IP):
$env:EXPO_PUBLIC_API_URL='http://192.168.x.x:5000/api'

# Restart Metro
npm start
```

### MongoDB Connection Errors

**"Cannot connect to MongoDB":**
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas with proper connection string
- Check backend logs for connection details

### Build/Version Issues

**"Project incompatible with Expo":**
```bash
npx expo install --fix
# or
npx expo install expo@latest
```

## Environment Variables

**Frontend (.env):**
```
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campass
NODE_ENV=development
```

## Testing

**Test as Student:**
1. Signup with role "student"
2. Go to Test Results - see 4 mock results
3. Tap Group Chats - see 7 student groups
4. Tap WhatsApp button () - opens WhatsApp

**Test as Teacher:**
1. Signup with role "teacher"
2. Access Group Chats - see 7 teacher groups
3. Create tests, upload notes, manage events

**Test as Admin:**
1. Signup with role "admin"
2. Access dashboard - approve users, manage library, set fines

## GitHub Repository

https://github.com/Kavya7089/compass-Connect-mobile-app

## Recent Updates

-  Group chat feature with 8 interest groups
-  Global WhatsApp AI button
-  Mock test results data
-  API auto-detection for Android emulator
-  Fixed API response handling
-  Event management system
-  Community discussions platform

## License

Campus Connect college management system
