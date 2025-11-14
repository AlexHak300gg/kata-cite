# ToDo App - Fullstack Application

A fullstack ToDo application built with Node.js/Express backend and React frontend with Redux state management.

## Features

- **Task Management**: Create, view, and manage tasks
- **Pagination**: Tasks are displayed 3 per page with navigation controls
- **Sorting**: Sort tasks by username, email, date, or completion status
- **Admin Panel**: Admin users can edit task text and mark tasks as complete
- **Authentication**: Secure admin login with JWT tokens
- **Responsive Design**: Clean, modern UI that works on all devices

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **TypeScript** support

### Frontend
- **React** with TypeScript
- **Redux Toolkit** for state management
- **Axios** for API calls
- **CSS3** for styling (no external CSS framework)

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
cd client && npm install
```

3. Start the development servers:
```bash
# From the root directory
npm run dev
```

This will start both the backend server (on port 5000) and the frontend development server (on port 3000) concurrently.

### Manual Setup

If you prefer to run the servers separately:

1. Start the backend server:
```bash
npm run server
```

2. In another terminal, start the frontend:
```bash
npm run client
```

## Usage

### For Regular Users
1. Open the application in your browser (http://localhost:3000)
2. View the list of existing tasks
3. Create new tasks using the form at the top
4. Navigate between pages using the pagination controls
5. Sort tasks by different criteria using the sort dropdowns

### For Admin Users
1. Click "Admin Login" in the header
2. Use the default credentials:
   - Username: `admin`
   - Password: `123`
3. Once logged in, you can:
   - Edit task text by clicking the "Edit" button
   - Mark tasks as complete/incomplete using the toggle button
   - View your admin status in the header

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username and password
- `GET /api/auth/me` - Get current user info (requires token)

### Tasks
- `GET /api/tasks` - Get paginated and sorted tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task (admin only)

### Query Parameters for Tasks
- `page` - Page number (default: 1)
- `sortBy` - Sort field: username, email, created_at, completed
- `sortOrder` - Sort order: ASC, DESC

## Database

The application uses SQLite for simplicity. The database file (`database.sqlite`) will be created automatically when the server starts. Two tables are created:

1. `tasks` - Stores task information
2. `users` - Stores user accounts (admin user is created automatically)

## Project Structure

```
todo-app/
├── server/
│   ├── database/
│   │   └── init.js          # Database initialization
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── tasks.js         # Task management routes
│   └── index.js             # Server entry point
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── store/           # Redux store and slices
│   │   ├── types/           # TypeScript type definitions
│   │   └── App.tsx          # Main App component
│   └── package.json
├── package.json             # Root package.json
└── .env                     # Environment variables
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
DB_PATH=./database.sqlite
```

### Frontend (client/.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Production Deployment

To build for production:

1. Build the React app:
```bash
cd client && npm run build
```

2. Start the production server:
```bash
npm start
```

The production server will serve the static React files from the `/client/build` directory.

## Development Notes

- The backend runs on port 5000
- The frontend development server runs on port 3000
- CORS is configured to allow requests from the frontend
- The proxy is configured in package.json for seamless development
- All state management is handled by Redux Toolkit
- The UI is built with vanilla CSS for maximum control and minimal dependencies

## Security Considerations

- Passwords are hashed using bcryptjs
- JWT tokens are used for authentication
- Admin actions are protected with middleware
- Input validation is implemented on both frontend and backend
- CORS is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.