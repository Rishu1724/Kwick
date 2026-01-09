# Running the OLX Clone Application

This document provides instructions on how to run the OLX Clone application locally.

## Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd olx
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Database Setup

### Option 1: Local MongoDB Installation (Recommended for Development)

1. Install MongoDB Community Edition:
   - **macOS (Homebrew)**:
     ```bash
     brew tap mongodb/brew
     arch -arm64 brew install mongodb-community@6.0
     ```

   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

   - **Linux**: Follow the [official installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. Start MongoDB service:
   - **macOS**:
     ```bash
     arch -arm64 brew services start mongodb-community@6.0
     ```

   - **Windows**: MongoDB service typically starts automatically

   - **Linux**:
     ```bash
     sudo systemctl start mongod
     ```

### Option 2: MongoDB Atlas (Cloud Database)

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster and database user
3. Update the `.env` file in the backend directory with your connection string:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/olx?retryWrites=true&w=majority
   ```

## Environment Configuration

### Backend Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
NODE_ENV=development
PORT=5002
MONGO_URI=mongodb://localhost:27017/olx
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=your_email_from_address
```

### Frontend Environment Variables
The frontend is configured to connect to the backend at `http://localhost:5002` by default. This is configured in `frontend/src/services/api.js`.

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

This will start the backend server on port 5002 with auto-reload capabilities using nodemon.

### 2. Start the Frontend Development Server
In a new terminal window:
```bash
cd frontend
npm run dev
```

This will start the frontend development server, typically on port 5174 (or the next available port if 5173 is in use).

## Accessing the Application

Once both servers are running:

1. Open your browser and navigate to: `http://localhost:5174`
2. The application should load and be fully functional

## Default User Roles

The application supports different user roles:
- **Buyer**: Can browse products, favorite items, and contact sellers
- **Seller**: Can post products, manage ads, and communicate with buyers
- **Both**: Has both buyer and seller capabilities
- **Admin**: Can manage users, products, categories, and reported content

## API Documentation

The backend API is available at `http://localhost:5002/api/`. You can explore the available endpoints in the routes files located in `backend/routes/`.

## Development Workflow

### Backend Development
- The backend uses nodemon for auto-reloading when files change
- Controllers are located in `backend/controllers/`
- Models are located in `backend/models/`
- Routes are located in `backend/routes/`

### Frontend Development
- The frontend uses Vite for fast development and hot module replacement
- Components are located in `frontend/src/components/`
- Pages are located in `frontend/src/pages/`
- Context providers are in `frontend/src/context/`

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - If port 5002 is in use, change the PORT variable in `.env`
   - If port 5174 is in use, Vite will automatically use the next available port

2. **MongoDB Connection Errors**
   - Ensure MongoDB is running: `brew services list | grep mongodb`
   - Check MongoDB logs: `tail -f /usr/local/var/log/mongodb/mongo.log`
   - Verify connection string in `.env` file

3. **Dependency Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

4. **CORS Errors**
   - The backend is configured to allow CORS from the frontend origin
   - Check `backend/server.js` for CORS configuration

### Useful Commands

- **Check MongoDB status**: `brew services list | grep mongodb`
- **Start MongoDB**: `brew services start mongodb-community@6.0`
- **Stop MongoDB**: `brew services stop mongodb-community@6.0`
- **Restart backend**: `cd backend && npm run dev`
- **Restart frontend**: `cd frontend && npm run dev`

## Production Deployment

For production deployment, you would typically:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Set `NODE_ENV=production` in the backend `.env` file

3. Use a process manager like PM2 to run the backend:
   ```bash
   cd backend
   npm install -g pm2
   pm2 start server.js --name "olx-backend"
   ```

4. Serve the frontend build files through a web server like Nginx

5. Configure environment variables for production

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)