# Campus Connect - React Native Mobile App

A comprehensive college management mobile application built with React Native and Supabase, connecting students, teachers, and administrators.

## Features

### Student Features
- 📝 Take mock tests created by teachers
- 📊 View test results and average scores
- ❓ Ask doubts to teachers
- 📚 Request books from library
- 📄 Access study notes uploaded by teachers

### Teacher Features
- 📝 Create and manage mock tests
- 📄 Upload study notes (PDF files)
- ❓ View and reply to student doubts

### Admin Features
- 👥 Approve/reject student and teacher registrations
- 📚 Manage library (add books, mark availability, handle requests)
- 💰 Manage fines for overdue books
- 🔐 Full system control

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account and project

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd mobile-app
   npm install
   npx expo install --fix  # Fixes version compatibility issues
   ```

2. **Create App Assets** (Required)
   - Create placeholder images in the `assets` folder:
     - `icon.png` (1024x1024px) - App icon
     - `splash.png` (1242x2436px) - Splash screen
     - `adaptive-icon.png` (1024x1024px) - Android adaptive icon
     - `favicon.png` (48x48px) - Web favicon
   
   **Quick Solution**: You can use any image editor to create simple colored squares, or use online tools like:
   - [Expo Asset Generator](https://docs.expo.dev/guides/app-icons/)
   - [AppIcon.co](https://www.appicon.co/)
   - Or create simple 1024x1024px colored images manually

3. **Configure Supabase**
   - Create a `.env` file in the `mobile-app` directory
   - Add your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - **Important**: The app will show an error screen if these are not set

4. **Set up Supabase Database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the schema from `../database-setup/schema.sql`
   - Run the additional schema from `database-extensions.sql` (in this folder)
   - Create a storage bucket named `notes` for file uploads

5. **Run the App**
   ```bash
   npm start
   ```
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone
   - **Note**: Make sure your Expo Go app matches the SDK version (SDK 49) or upgrade the project to SDK 54

## Project Structure

```
mobile-app/
├── config/
│   └── supabase.js          # Supabase client configuration
├── services/
│   ├── authService.js       # Authentication operations
│   ├── testService.js       # Test management
│   ├── libraryService.js    # Library operations
│   ├── doubtService.js      # Doubt management
│   ├── notesService.js      # Notes upload/download
│   └── adminService.js      # Admin operations
├── screens/
│   ├── auth/                # Login, Signup
│   ├── student/             # Student screens
│   ├── teacher/             # Teacher screens
│   └── admin/               # Admin screens
└── App.js                   # Main app with navigation
```

## Database Schema Notes

The app expects the following tables (from `database-setup/schema.sql`):
- `profiles` - User profiles with roles
- `tests` - Mock tests
- `test_results` - Student test results
- `library_requests` - Book requests
- `doubts` - Student doubts and teacher replies
- `events` - College events (optional)

**Additional tables (created by `database-extensions.sql`):**
- `notes` - For storing note metadata
- `books` - For library book inventory
- `fines` - For tracking fines

## Storage Setup

1. Create a storage bucket named `notes` in Supabase
2. Set bucket to public or configure proper RLS policies
3. This bucket will store uploaded PDF notes

## Authentication Flow

1. User signs up with email, password, and role (student/teacher)
2. Account is created but `is_approved` is `false`
3. Admin approves the account
4. User can then log in and access role-specific features

## Role-Based Access

- **Students**: Can take tests, view results, ask doubts, request books, view notes
- **Teachers**: Can create tests, upload notes, reply to doubts
- **Admins**: Can approve users, manage library, manage fines

## Troubleshooting

### Common Issues

1. **"Supabase URL not found" or "Supabase Not Configured"**
   - Make sure `.env` file exists with correct credentials
   - Restart Expo after creating `.env`
   - Check that environment variables start with `EXPO_PUBLIC_`

2. **"Unable to resolve asset" errors**
   - Create the required image files in the `assets` folder
   - See step 2 in Setup Instructions above
   - You can temporarily comment out icon/splash in `app.json` for testing

3. **"Project is incompatible with this version of Expo Go"**
   - Your Expo Go app is SDK 54, but project uses SDK 49
   - **Option 1**: Install Expo Go for SDK 49 (link provided in error)
   - **Option 2**: Upgrade project to SDK 54: `npx expo install expo@latest`

4. **"URL.protocol is not implemented" error**
   - This means Supabase credentials are missing or invalid
   - Check your `.env` file has correct values
   - Restart the Expo server after updating `.env`

5. **"Storage bucket not found"**
   - Create `notes` bucket in Supabase Storage
   - Set appropriate permissions

6. **"Table does not exist"**
   - Run the complete schema.sql in Supabase SQL Editor
   - Run database-extensions.sql as well
   - Check if all required tables are created

7. **"Permission denied"**
   - Check Row Level Security (RLS) policies in Supabase
   - Ensure user is approved (`is_approved = true`)

8. **Package version warnings**
   - Run `npx expo install --fix` to automatically fix version mismatches

## Development

- The app uses React Navigation for routing
- Supabase handles authentication and database operations
- File uploads use Expo Document Picker and File System

## License

This project is part of the Campus Connect college management system.

