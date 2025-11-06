# How Academia - Learning Management System

A modern, full-stack Learning Management System (LMS) built with Next.js, TypeScript, ShadCN UI, and Tailwind CSS. The application supports three distinct user roles: Student, Instructor, and Institution Administrator.

## Features

### Authentication & User Roles
- Unified login page with role selection (Student, Instructor, Institution)
- Auto-account creation for new users
- Role-based layouts and navigation with collapsible sidebars

### Instructor Features
- **Dashboard**: View statistics (total students, active courses, average scores) and recent exam submissions
- **Courses**: Create and manage courses
- **Exams**: Create and manage exams for courses
- **Schedule**: Manage live coaching sessions
- **Profile**: View profile information and courses taught

### Student Features
- **Dashboard**: View enrolled courses and average scores
- **My Courses**: Browse and enroll in available courses
- **My Exams**: View and take exams, see results
- **My Schedule**: View scheduled sessions from instructors
- **Tutors**: Browse available instructors/tutors
- **Profile**: View profile and enrolled courses

### Institution Features
- **Dashboard**: View institution-wide statistics
- **Instructors**: Manage instructors associated with the institution
- **Students**: Manage students enrolled in the institution
- **Courses**: View all courses offered by instructors
- **Profile**: View institution profile information

### Shared Features
- **Live Sessions**: Browse and join live coaching sessions with real-time chat
- **Institutions List**: Browse all institutions on the platform

### AI Integration (Genkit)
- Generate exam questions
- Summarize student performance
- Provide personalized learning suggestions
- Analyze assessment effectiveness

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS (dark mode by default)
- **Fonts**: Inter (body), Space Grotesk (headlines)
- **Backend**: Mock data layer (ready for Supabase integration)
- **AI**: Genkit with Google AI provider

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd how-academia
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

For AI features (Genkit), you'll need to set up Google AI API keys. Create a `.env.local` file:

```env
GOOGLE_AI_API_KEY=your-api-key-here
```

Note: The application currently uses mock data for the prototype. A Supabase client setup file (`src/lib/supabase.ts`) is provided for future integration. To integrate with Supabase, you would need to:
- Set up a Supabase project
- Configure environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Replace mock data calls with Supabase client calls using the provided `supabase.ts` helpers

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Authentication page
│   ├── student/           # Student role pages
│   ├── instructor/        # Instructor role pages
│   ├── institution/       # Institution role pages
│   ├── live-sessions/     # Live sessions pages
│   └── institutions/      # Institutions list page
├── components/            # React components
│   └── ui/               # ShadCN UI components
├── lib/                  # Utilities and data layer
│   ├── mock-data.ts      # Mock database implementation
│   ├── supabase.ts       # Supabase client setup (for future integration)
│   └── utils.ts          # Utility functions
└── ai/                   # AI integration
    ├── config.ts         # Genkit configuration
    └── flows/            # AI flow functions
```

## Mock Data

The application uses a mock data layer (`src/lib/mock-data.ts`) that simulates a database. This includes:
- Users (students, instructors, institutions)
- Courses
- Exams and exam submissions
- Sessions
- Messages (for live chat)
- Institutions

Sample data is pre-populated for demonstration purposes.

## Default Test Accounts

The mock data includes sample accounts:
- Student: `student@example.com`
- Instructor: `instructor@example.com`
- Institution: `admin@techuniversity.com`

Password can be anything (not validated in mock mode).

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

## License

This project is a prototype for demonstration purposes.

