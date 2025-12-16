# StudyMax

Your Academic Productivity Partner - A modern web application to help students organize their classes, manage tasks, and store study materials.

## Features

- **User Authentication**: Secure sign up and login with email/password
- **Class Management**: Create and organize your classes with custom colors and schedules
- **Task Tracking**: Add assignments and tasks with deadlines and workload indicators
- **Document Storage**: Upload and manage study materials for each class
- **Calendar View**: Visualize your schedule and upcoming deadlines
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router DOM
- **Database & Auth**: Supabase
- **Storage**: Supabase Storage
- **Styling**: CSS3 with custom styles

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier available)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/StudyMax.git
cd StudyMax
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Set up the database schema
- Configure authentication
- Set up storage for documents

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to GitHub Pages

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

All tables are protected with Row Level Security (RLS) to ensure users can only access their own data.

## Security

- User authentication handled by Supabase Auth
- Row Level Security (RLS) policies protect all data
- File uploads restricted to authenticated users
- Environment variables for sensitive credentials

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel settings
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Create a new site from Git in Netlify
3. Add environment variables in Netlify settings
4. Deploy

Remember to update the Site URL in Supabase dashboard under Authentication > URL Configuration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup help
- Open an issue on GitHub
- Consult [Supabase Documentation](https://supabase.com/docs)

## Acknowledgments

- Built with React and Vite
- Powered by Supabase
- Icons and images from Unsplash

---

Made with ❤️ for students everywhere
