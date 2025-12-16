# StudyMax

**Members**: Boris Lukyanovich, Ahmed Abdelsalam, Dennes Lopez, Leroy Engmann

## Overview

StudyMax is a web application designed for students to manage the workload of all their classes. Built with the purpose of improving productivity through the ability to create custom timetables, organize & prioritize tasks, and ensure you never miss a deadline.

## Core Features

### Classes
- Create modules that hold all related tasks and materials for each class
- Set class schedules, descriptions, and custom colors to visually organize tasks
- Upload and manage files to keep course materials organized and accessible

### Tasks
- Create tasks with class associations, descriptions, deadlines, and workload indicators
- Automatic priority calculation based on deadline and workload
- Visual task management displayed on the calendar dashboard

### Calendar Dashboard
- View all your tasks in an intuitive calendar interface
- See at a glance the work due each week, including class information and workload
- Color-coded tasks for easy identification by class

### Additional Features
- **User Authentication**: Secure signup and login with Supabase
- **Document Storage**: Cloud-based file storage for class materials and task attachments
- **Multi-file Support**: Attach multiple files to tasks and classes
- **Responsive Design**: Seamless experience on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19, Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: CSS3

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier available)


## Project Structure

```
StudyMax/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Welcome.jsx  # Landing page
│   │   ├── Login.jsx    # Login modal
│   │   ├── Signup.jsx   # Signup modal
│   │   ├── Dashboard.jsx # Main dashboard
│   │   ├── ClassList.jsx # Class management
│   │   ├── TaskList.jsx  # Task management
│   │   └── ...
│   ├── config/          # Configuration files
│   │   └── supabaseClient.js
│   ├── context/         # React context
│   │   └── AuthContext.jsx
│   ├── functions/       # Database functions
│   │   └── supabaseDb.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── styles.css       # Global styles
├── .env.example         # Environment variables template
├── supabase-schema.sql  # Database schema
├── SUPABASE_SETUP.md   # Supabase setup guide
└── README.md           # This file
```

## Database Schema

The application uses three main tables:

1. **classes** - Stores class information (course title, description, schedule, color)
2. **tasks** - Stores assignments and tasks (title, description, deadline, completion status)
3. **documents** - Stores document metadata (title, type, file path, and URL)

