# How Academia - Learning Management System

A modern, full-stack Learning Management System (LMS) built with Next.js, TypeScript, and Tailwind CSS. The application supports three distinct user roles: Student, Instructor, and Institution Administrator.

## Features

### Authentication
- Unified login page with role selection (Student, Instructor, Institution)
- Automatic account creation if user doesn't exist
- Role-based access control

### Student Features
- Dashboard with enrolled courses and average scores
- Browse and enroll in courses
- Take exams and view results
- View scheduled sessions
- Browse available tutors
- Profile management

### Instructor Features
- Dashboard with statistics (students, courses, average scores)
- Create and manage courses
- Create and manage exams
- Schedule live coaching sessions
- Profile management
- AI-Powered Analysis (placeholder)

### Institution Features
- Dashboard with institution-wide statistics
- Manage instructors (add, view)
- Manage students (add, view)
- View all courses offered by instructors

### Shared Features
- Live Sessions with real-time chat
- Browse institutions list
- Dark mode UI by default

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS (Dark mode)
- **Fonts**: Inter (body), Space Grotesk (headings)
- **Data Store**: TypeScript-based in-memory store (no external database required)
- **Authentication**: TypeScript-based auth store with localStorage persistence

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd How-main
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── login/             # Login page
│   ├── student/           # Student role pages
│   ├── instructor/        # Instructor role pages
│   ├── institution/       # Institution role pages
│   ├── live-sessions/     # Live sessions pages
│   └── institutions/      # Institutions list page
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   ├── instructor/       # Instructor-specific components
│   └── institution/      # Institution-specific components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities and services
│   ├── store/           # Data store and auth store
│   └── firebase/        # Data hooks (Firebase-compatible API)
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## Data Store

The application uses a TypeScript-based in-memory data store that provides:
- Collection management (courses, exams, users, etc.)
- Query constraints (where, equals, etc.)
- Real-time subscriptions (simulated with polling)
- Non-blocking write operations
- localStorage persistence for authentication

## Authentication

Authentication is handled by a TypeScript-based auth store that:
- Stores users in memory
- Persists auth state in localStorage
- Supports email/password authentication
- Auto-creates accounts on login if they don't exist
- Syncs with data store automatically

## Usage

### Login

1. Navigate to `/login`
2. Enter your email and password
3. Select your role (Student, Instructor, or Institution)
4. Click "Sign In / Sign Up"

### Creating Data

- **Instructors** can create courses and exams from their respective pages
- **Institutions** can add instructors and students from the management pages
- All data is stored in memory and will reset on page refresh (in a production app, this would be persisted to a database)

## Development

### Adding New Features

1. Create new pages in `src/app/`
2. Add new components in `src/components/`
3. Define types in `src/types/index.ts`
4. Use data hooks from `src/lib/firebase/hooks.ts`

### Data Store API

```typescript
import { dataStore } from "@/lib/store/dataStore";

// Add document
await dataStore.addDocument("courses", { title: "New Course" });

// Get collection
const courses = await dataStore.getCollection("courses");

// Get collection with constraints
const myCourses = await dataStore.getCollection("courses", [
  { field: "instructorId", operator: "==", value: userId }
]);

// Update document
await dataStore.updateDocument("courses", courseId, { title: "Updated Title" });

// Delete document
await dataStore.deleteDocument("courses", courseId);
```

## Building for Production

```bash
npm run build
npm start
```

## License

This project is private and proprietary.

