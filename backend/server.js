const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');

// Load env vars
dotenv.config();

// Import Cloudinary after environment variables are loaded
const { cloudinary } = require('./config/cloudinary');

// Connect to database
connectDB();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'], // Allow multiple Vite ports
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser middleware - increase limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.listen(PORT, console.log(`Server running on port ${PORT}`));