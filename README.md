# BRNNO API Backend

A modern Node.js Express API backend built with TypeScript for BRNNO Enterprises.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework
- **PostgreSQL**: Robust database support with pg driver
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Secure configuration management
- **Auto-reload**: Development server with hot reloading
- **Clean Architecture**: Organized directory structure

## 📁 Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
└── server.ts        # Main server entry point
```

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   PORT=3001
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=development
   JWT_SECRET=your_super_secret_and_long_random_string_here
   ```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

This starts the server with auto-reloading on port 3001 (or the port specified in your .env file).

### Production Build

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

- **GET** `/api/v1/health` - Returns API health status

### Root

- **GET** `/` - Welcome message and API information

### Authentication

- **POST** `/api/v1/users/register` - Register a new user
- **POST** `/api/v1/users/login` - Login user and get JWT token
- **GET** `/api/v1/users/profile` - Get user profile (protected route)
- **GET** `/api/v1/users/me` - Get current user's profile (protected route)

### Client Management

- **POST** `/api/v1/clients` - Create a new client (protected route)
- **GET** `/api/v1/clients` - Get all clients for user (protected route)
- **GET** `/api/v1/clients/:id` - Get a specific client (protected route)
- **PUT** `/api/v1/clients/:id` - Update a client (protected route)
- **DELETE** `/api/v1/clients/:id` - Delete a client (protected route)

### Service Management

- **POST** `/api/v1/services` - Create a new service (protected route)
- **GET** `/api/v1/services` - Get all services for user (protected route)
- **GET** `/api/v1/services/:id` - Get a specific service (protected route)
- **PUT** `/api/v1/services/:id` - Update a service (protected route)
- **DELETE** `/api/v1/services/:id` - Delete a service (protected route)

### Quote Management

- **POST** `/api/v1/quotes` - Create a new quote (protected route)
- **GET** `/api/v1/quotes` - Get all quotes for user (protected route)
- **GET** `/api/v1/quotes/:id` - Get a specific quote with items (protected route)

## 🔧 Available Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production server
- `npm test` - Run tests (to be implemented)

## 🛡️ Security

- Environment variables are used for sensitive configuration
- CORS is properly configured
- `.env` file is excluded from version control

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | Secret key for JWT signing | - |

## 🗄️ Database

This project is configured to work with PostgreSQL. Make sure to:

1. Install PostgreSQL on your system
2. Create a database for the project
3. Update the `DATABASE_URL` in your `.env` file
4. Run the database schema: `psql -d your_database -f database/schema.sql`

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper error handling
4. Test your changes thoroughly

## 📄 License

This project is licensed under the ISC License.
