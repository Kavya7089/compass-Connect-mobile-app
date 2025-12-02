# System Architecture Overview

## 🏗️ Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAMPUS CONNECT                              │
│                  Events & Notifications System                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  STUDENT DASHBOARDS:                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ StudentDashboard                                            │   │
│  │ ├── 📅 Events (NEW) ────────────┐                           │   │
│  │ ├── 🔔 Notifications (NEW) ─────┼── Quick Links            │   │
│  │ ├── 📝 Tests                    │                           │   │
│  │ ├── 📊 Results                  │                           │   │
│  │ └── ... other menus ────────────┘                           │   │
│  │                                                             │   │
│  │ NotificationBadge (🔔 badge in header)                     │   │
│  │ │ Auto-refresh: 5 seconds                                 │   │
│  │ │ Shows unread count (9+ format)                          │   │
│  │ └ Tap to navigate to NotificationsScreen                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  STUDENT SCREENS (NEW):                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ EventsScreen            │  │ NotificationsScreen              │ │
│  ├─────────────────────────┤  ├──────────────────────────────────┤ │
│  │ Filter: All/Upcoming/   │  │ Type: Alert/Reminder/Notice/    │ │
│  │ Registered/Past         │  │       Announcement              │ │
│  │                         │  │                                 │ │
│  │ [Tile Grid Layout]      │  │ [Tile Grid Layout]              │ │
│  │ ├─ Event 1              │  │ ├─ Notification 1               │ │
│  │ │  📅 Date/Time         │  │ │  🔔 Type icon                │ │
│  │ │  📍 Location          │  │ │  Time: "5m ago"              │ │
│  │ │  👥 3/5 Registered    │  │ │  Message preview             │ │
│  │ │  [Register] button    │  │ │  [Mark read] [Delete]        │ │
│  │ │                       │  │ │                              │ │
│  │ ├─ Event 2              │  │ ├─ Notification 2               │ │
│  │ │  ...                  │  │ │  ...                         │ │
│  │ └─ Event 3              │  │ └─ Notification 3               │ │
│  │                         │  │                                 │ │
│  │ Auto-refresh: Manual    │  │ Auto-refresh: 10 seconds        │ │
│  │ Pull-to-Refresh: ✅     │  │ Pull-to-Refresh: ✅             │ │
│  └─────────────────────────┘  └──────────────────────────────────┘ │
│                                                                      │
│  TEACHER DASHBOARDS:                                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ TeacherDashboard                                             │  │
│  │ ├── 📝 Create Test                                           │  │
│  │ ├── 📄 Upload Notes                                          │  │
│  │ ├── ❓ View Doubts                                           │  │
│  │ ├── 🌐 Community                                             │  │
│  │ ├── 📅 Event Management (NEW) ──┐                           │  │
│  │ └── 📢 Announcements (NEW) ──────┼── New Features            │  │
│  │                                  │                          │  │
│  │ TEACHER SCREENS (NEW):           │                          │  │
│  │ ┌───────────────────────────┐   │                          │  │
│  │ │ EventManagementScreen ◄──┘    │                          │  │
│  │ ├───────────────────────────┤   │                          │  │
│  │ │ [Create Event] button     │   │                          │  │
│  │ │                           │   │                          │  │
│  │ │ Form Modal:               │   │                          │  │
│  │ │ ├─ Title: ________        │   │                          │  │
│  │ │ ├─ Description: ____      │   │                          │  │
│  │ │ ├─ Location: ______       │   │                          │  │
│  │ │ ├─ Capacity: ____         │   │                          │  │
│  │ │ ├─ Date: [Pick Date] ◄───┼── DateTime Picker            │  │
│  │ │ └─ Time: [Pick Time]      │   │                          │  │
│  │ │                           │   │                          │  │
│  │ │ My Events [Tile Grid]:    │   │                          │  │
│  │ │ ├─ Event 1                │   │                          │  │
│  │ │ │  Status: Upcoming       │   │                          │  │
│  │ │ │  Registered: 5/20       │   │                          │  │
│  │ │ │  [Edit] [Delete]        │   │                          │  │
│  │ │ ├─ Event 2                │   │                          │  │
│  │ │ │  ...                    │   │                          │  │
│  │ │ └─ Event 3                │   │                          │  │
│  │ └───────────────────────────┘   │                          │  │
│  │                                  │                          │  │
│  │ ┌───────────────────────────┐   │                          │  │
│  │ │ AnnouncementsScreen ◄─────┘   │                          │  │
│  │ ├───────────────────────────┤   │                          │  │
│  │ │ [Post Announcement] button│   │                          │  │
│  │ │                           │   │                          │  │
│  │ │ Form Modal:               │   │                          │  │
│  │ │ ├─ Title: ________        │   │                          │  │
│  │ │ ├─ Message: ______        │   │                          │  │
│  │ │ ├─ Type: [📋 Notice]      │   │                          │  │
│  │ │ │        [📣 Announcement]│   │                          │  │
│  │ │ └─ [Submit]               │   │                          │  │
│  │ │                           │   │                          │  │
│  │ │ My Announcements:         │   │                          │  │
│  │ │ ├─ Announcement 1         │   │                          │  │
│  │ │ │  [📣] Title...          │   │                          │  │
│  │ │ │  Message preview...     │   │                          │  │
│  │ │ │  [Delete]               │   │                          │  │
│  │ │ ├─ Notice 1               │   │                          │  │
│  │ │ │  [📋] Title...          │   │                          │  │
│  │ │ │  ...                    │   │                          │  │
│  │ │ └─ Announcement 2         │   │                          │  │
│  │ └───────────────────────────┘   │                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ADMIN DASHBOARDS:                                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ AdminDashboard                                               │  │
│  │ ├── 👥 Approve Users                                         │  │
│  │ ├── 📚 Library Management                                    │  │
│  │ ├── 💰 Manage Fines                                          │  │
│  │ ├── 📅 Event Management (NEW)                                │  │
│  │ └── 📢 Announcements (NEW)                                   │  │
│  │                                                              │  │
│  │ (Same screens as Teacher)                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      APPLICATION SERVICES LAYER                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  eventService                    notificationService               │
│  ├─ getEvents()                 ├─ getNotifications()             │
│  ├─ getEvent(id)                ├─ getUnreadCount()               │
│  ├─ createEvent()               ├─ markAsRead()                   │
│  ├─ registerEvent()             ├─ markAllAsRead()                │
│  ├─ unregisterEvent()           ├─ createAnnouncement()           │
│  ├─ updateEvent()               └─ deleteNotification()           │
│  └─ deleteEvent()                                                  │
│                                                                      │
│  All services:                                                       │
│  • Return {data, error} format                                      │
│  • Handle API errors gracefully                                    │
│  • Include authentication tokens                                   │
│  • Use base API URL from config                                    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Express)                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  /api/events Endpoints (6):        /api/notifications (6):         │
│  ├─ GET /events                    ├─ GET /notifications           │
│  ├─ GET /events/:id                ├─ GET /count                   │
│  ├─ POST /events                   ├─ PUT /:id/read                │
│  ├─ POST /:id/register             ├─ PUT /mark-all-read           │
│  ├─ POST /:id/unregister           ├─ POST /announce               │
│  ├─ PUT /:id                       └─ DELETE /:id                  │
│  └─ DELETE /:id                                                     │
│                                                                      │
│  Authentication:                                                     │
│  • Auth middleware on all routes                                    │
│  • Extract userId from JWT token                                   │
│  • Validate permissions per action                                 │
│                                                                      │
│  Error Handling:                                                     │
│  • Standardized {data, error} response                              │
│  • Capacity validation                                              │
│  • User permission checks                                           │
│  • Database error handling                                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER (MongoDB)                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Collections:                                                        │
│                                                                      │
│  Events Collection:                Notifications Collection:        │
│  ┌──────────────────────────────┐  ┌──────────────────────────────┐ │
│  │ _id: ObjectId                │  │ _id: ObjectId                │ │
│  │ title: String                │  │ userId: ObjectId (ref User)  │ │
│  │ description: String          │  │ type: "alert|reminder|..."   │ │
│  │ eventDate: Date              │  │ title: String                │ │
│  │ location: String             │  │ message: String              │ │
│  │ capacity: Number             │  │ eventId: ObjectId (ref)      │ │
│  │ registeredStudents: [ObjId]  │  │ read: Boolean                │ │
│  │ createdBy: ObjectId (ref)    │  │ priority: "low|medium|high"  │ │
│  │ status: "upcoming|ongoing"   │  │ expiresAt: Date              │ │
│  │ thumbnail: String            │  │ createdAt: Date              │ │
│  │ createdAt: Date              │  │ updatedAt: Date              │ │
│  │ updatedAt: Date              │  │                              │ │
│  └──────────────────────────────┘  └──────────────────────────────┘ │
│                                                                      │
│  Relationships:                                                      │
│  • Event.createdBy ──┐                                              │
│  • Event.registeredStudents ──┐ → User collection                   │
│  • Notification.userId ──────┘                                      │
│  • Notification.eventId → Event collection                          │
│                                                                      │
│  Indexes:                                                            │
│  • Events: userId (for filtering), status, eventDate               │
│  • Notifications: userId, read, createdAt                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Flow 1: Student Registers for Event
```
EventsScreen (UI)
    ↓ [Tap Register Button]
eventService.registerEvent(eventId)
    ↓ [HTTP POST]
/api/events/:id/register (Backend)
    ↓ [Check Auth]
Find Event in DB
    ↓ [Check Capacity]
    ├─ If Full: Return error
    └─ If Available: Continue
Add User to registeredStudents
    ↓
Create Notification (backend auto-trigger)
    ↓
Return success response
    ↓
EventsScreen updates UI
    ├─ Show "Registered" badge
    ├─ Update capacity bar
    └─ Update button state
    ↓
NotificationBadge auto-refreshes
    ├─ Next refresh in 5s
    └─ Shows new unread count
```

### Flow 2: Teacher Posts Announcement
```
AnnouncementsScreen (UI)
    ↓ [Tap "Post Announcement"]
Show Form Modal
    ↓ [User fills form]
[Submit Button]
    ↓
notificationService.createAnnouncement(data)
    ↓ [HTTP POST]
/api/notifications/announce (Backend)
    ↓ [Check Auth]
Create Notification doc
    ├─ userId: current user
    ├─ type: "announcement"
    ├─ priority: "high"
    └─ Save to DB
    ↓
Return success
    ↓
AnnouncementsScreen
    ├─ Add to local state
    ├─ Show success alert
    └─ Refresh tile grid
    ↓
Auto-triggers for all students:
    ├─ NotificationBadge increments
    └─ NotificationsScreen shows new item
```

### Flow 3: Student Views Notifications
```
StudentDashboard (UI)
    ↓ [Tap Notification Badge]
navigation.navigate('NotificationsScreen')
    ↓
NotificationsScreen Mounts
    ├─ notificationService.getNotifications()
    │  ↓ [HTTP GET]
    │  /api/notifications (Backend)
    │  ↓ [Check Auth]
    │  Fetch user's notifications
    │  ↓
    │  Return {data: [...], error: null}
    │
    └─ Update state with notifications
    ↓
Render Tile Grid
    ├─ For each notification:
    │  ├─ Show type icon
    │  ├─ Show message
    │  ├─ Show time "5m ago"
    │  └─ Show read/delete buttons
    └─
Auto-refresh Interval (10s)
    ├─ Call getNotifications() again
    ├─ Update UI with new items
    └─ Continue polling...
    ↓
User Actions:
├─ [Tap Notification] → markAsRead()
├─ [Delete Button] → deleteNotification()
└─ [Mark All Read] → markAllAsRead()
```

---

## 🎨 UI Component Hierarchy

```
StudentDashboard
├── UserHeader (Enhanced)
│   ├── Title & Username
│   └── NotificationBadge ◄── NEW
│       ├── Bell Icon
│       ├── Red Badge
│       └── Unread Count
├── MenuContainer
│   ├── MenuItems (existing)
│   ├── MenuItemEvents (NEW) ◄── Navigates to EventsScreen
│   └── MenuItemNotifications (NEW) ◄── Navigates to NotificationsScreen
└── ScrollView (content)

EventsScreen (NEW)
├── Header (Filter Buttons)
│   ├─ All
│   ├─ Upcoming
│   ├─ Registered
│   └─ Past
├── FlatList (Grid)
│   └── EventTile x N
│       ├── Type Icon (📅)
│       ├── Title & Description
│       ├── Location
│       ├── Date/Time
│       ├── Capacity Bar
│       └── Register/Unregister Button
└── EmptyState (if no events)

NotificationsScreen (NEW)
├── Header
│   ├── Title
│   └── Mark All Read Button
├── Unread Count Display
├── FlatList (Grid)
│   └── NotificationTile x N
│       ├── Type Icon (🔔/📢/📋)
│       ├── Title
│       ├── Message
│       ├── Time (5m ago)
│       ├── Read Indicator
│       └── Delete Button
├── Pull-to-Refresh
└── EmptyState (if no notifications)

EventManagementScreen (NEW)
├── Header
├── Create Event Button
├── Form Modal
│   ├── Title Input
│   ├── Description Input
│   ├── Location Input
│   ├── Capacity Input
│   ├── DateTime Picker
│   │   ├── Date Picker
│   │   └── Time Picker
│   └── Submit Button
├── FlatList (Grid)
│   └── EventTile x N
│       ├── Title & Location
│       ├── Date Meta
│       ├── Status Badge
│       ├── Stats (Registered/Available)
│       └── Edit/Delete Buttons
└── EmptyState

AnnouncementsScreen (NEW)
├── Header
├── Post Announcement Button
├── Form Modal
│   ├── Title Input
│   ├── Message Input
│   ├── Type Selector
│   │   ├─ Notice (📋)
│   │   └─ Announcement (📣)
│   └── Submit Button
├── FlatList (Grid)
│   └── AnnouncementTile x N
│       ├── Type Icon
│       ├── Title
│       ├── Message
│       ├── Date
│       └── Delete Button
└── EmptyState
```

---

## 📊 State Management Flow

```
User Authentication
    ↓
UserContext (Global)
├── user: {id, name, role, ...}
├── setUser(newUser)
└── Used by: All screens

Component State (Local)
├── EventsScreen
│   ├── events: []
│   ├── filteredEvents: []
│   ├── loading: false
│   └── filter: "all"
│
├── NotificationsScreen
│   ├── notifications: []
│   ├── unreadCount: 0
│   └── loading: false
│
├── EventManagementScreen
│   ├── myEvents: []
│   ├── formVisible: false
│   ├── formData: {}
│   └── loading: false
│
└── AnnouncementsScreen
    ├── announcements: []
    ├── formVisible: false
    ├── formData: {}
    └── loading: false

Services (API Abstraction)
├── eventService
│   └── Methods return {data, error}
│
└── notificationService
    └── Methods return {data, error}

Effects (Side Effects)
├── OnMount:
│   ├── Load initial data
│   ├── Set up auto-refresh intervals
│   └── Set up event listeners
│
└── OnUnmount:
    ├── Clear intervals
    ├── Clean up listeners
    └── Cancel pending requests
```

---

## 🔐 Authentication & Authorization

```
All API Requests
    ↓
Include JWT Token in Header:
├── Authorization: "Bearer <token>"
└── Token obtained from UserContext
    ↓
Backend Auth Middleware
    ├── Extract token from header
    ├── Verify token signature
    ├── Extract userId from payload
    └── Attach userId to req.user
    ↓
Route Handler
├── Check userId exists
├── Verify permissions
│   ├─ Event creator can edit/delete
│   ├─ User can unregister own registration
│   └─ Teachers can create events/announcements
└── Process request
    ↓
Send Response
└── {data: {...}, error: null}
```

---

## 📈 Scaling Considerations

```
Current Architecture:
├── Single MongoDB collection for events
├── Single collection for notifications
├── No caching layer
└── Real-time auto-refresh polling

Scaling Options:
├── Add Redis cache layer
│   ├── Cache events list
│   ├── Cache notification counts
│   └── Reduce DB queries
│
├── Implement WebSocket for real-time
│   ├── Replace polling with push
│   ├── Reduce network traffic
│   └── Instant updates
│
├── Database optimization
│   ├── Add indexes
│   ├── Archive old notifications
│   └── Partition large collections
│
└── CDN for images
    ├── Store event thumbnails
    ├── Reduce server load
    └── Faster image delivery
```

---

**Architecture Version:** 1.0
**Last Updated:** 2024
**Status:** Complete & Production Ready
