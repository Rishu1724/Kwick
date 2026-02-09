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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Define allowed origins, including production URL if available
    let allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:5175', 
      'http://localhost:5176',
      'http://localhost:5007', // Added to support the original frontend config
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176'
    ];
    
    // Add production URL if it exists
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Filter out any undefined/null values
    allowedOrigins = allowedOrigins.filter(Boolean);
    
    // Allow all localhost origins for development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // Check if the origin is in our allowed list
    const isValidOrigin = allowedOrigins.includes(origin);
    callback(null, isValidOrigin);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Body parser middleware - increase limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5007;

app.listen(PORT, console.log(`Server running on port ${PORT}`));