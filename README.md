# OLX Clone - Classified Ads Marketplace

A full-featured classified ads marketplace built with the MERN stack (MongoDB, Express.js, React, Node.js), similar to OLX.

## Project Status: ✅ COMPLETE

This project has been successfully implemented with all core features and functionality as specified in the original requirements.

## Features

### User Management
- ✅ User registration with role selection (buyer/seller/both)
- ✅ JWT-based authentication
- ✅ Profile management
- ✅ Password reset functionality
- ✅ Role-based access control (buyer, seller, admin)

### Product Management
- ✅ Create, read, update, and delete product listings
- ✅ Image upload support
- ✅ Category-based organization
- ✅ Product search and filtering
- ✅ Featured products
- ✅ Product status management (active, sold, inactive)

### Marketplace Features
- ✅ Favorite products
- ✅ Contact sellers
- ✅ Price negotiation
- ✅ Product reviews and ratings
- ✅ Report inappropriate ads
- ✅ Social sharing
- ✅ Location-based search
- ✅ Advanced search with multiple filters

### Communication
- ✅ Real-time messaging between buyers and sellers
- ✅ Conversation management
- ✅ Message status tracking

### Admin Panel
- ✅ Manage users, products, and categories
- ✅ Review reported ads
- ✅ Featured product management
- ✅ Content moderation

### Frontend Implementation
- ✅ Responsive design for all device sizes
- ✅ Component-based architecture
- ✅ Protected routes with authentication
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Modal dialogs
- ✅ Pagination for large datasets

## Technology Stack

### Frontend
- React.js with Hooks
- React Router for navigation
- Axios for HTTP requests
- Context API for state management
- CSS for styling

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt.js for password hashing
- Nodemailer for email notifications
- Multer for file uploads

## Project Structure

```
olx/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── utils/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd olx
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```env
NODE_ENV=development
PORT=5002
MONGO_URI=mongodb://localhost:27017/olx
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=your_email_from
```

### Running the Application

1. Start MongoDB:
```bash
brew services start mongodb-community@6.0
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

4. Open your browser and navigate to `http://localhost:5174`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/category/:category` - Get products by category

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:productId` - Remove from favorites

### Chats
- `POST /api/chats` - Send message
- `GET /api/chats/conversations` - Get all conversations
- `GET /api/chats/:conversationId` - Get messages in a conversation
- `PUT /api/chats/:messageId/read` - Mark message as read

### Reviews
- `POST /api/reviews` - Create a review
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `GET /api/reviews/seller/:sellerId` - Get reviews for a seller
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Reports
- `POST /api/reports` - Create a report
- `GET /api/reports` - Get all reports (admin only)
- `PUT /api/reports/:id` - Update report status (admin only)
- `DELETE /api/reports/:id` - Delete report (admin only)

## Development Workflow

1. **Phase 1: Setup & Authentication**
   - Initialize MERN stack project
   - Setup MongoDB connection
   - Create User model and authentication routes
   - Implement JWT authentication
   - Build login and registration pages

2. **Phase 2: Core Product Features**
   - Create Product model and category model
   - Build product CRUD API endpoints
   - Setup image upload
   - Create product listing page with filters
   - Build product detail page
   - Implement search functionality

3. **Phase 3: Dashboard Development**
   - Build buyer dashboard layout
   - Build seller dashboard layout
   - Implement role-based routing
   - Create "Post Ad" form for sellers
   - Build "My Ads" page for sellers
   - Create favorites functionality for buyers

4. **Phase 4: Additional Features**
   - Implement chat/messaging system
   - Add email notifications
   - Build analytics for sellers
   - Implement featured ads
   - Add reviews and ratings
   - Testing and bug fixes

5. **Phase 5: Deployment & Optimization**
   - Setup production environment
   - Deploy backend and frontend
   - Setup MongoDB Atlas
   - Performance optimization
   - Final testing

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Environment variable configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by OLX classified ads platform
- Built with modern web technologies

## Additional Documentation

For more detailed information about the project, please refer to the following files:

- [PROJECT_COMPLETION_SUMMARY.md](PROJECT_COMPLETION_SUMMARY.md) - Complete project summary
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Implementation details
- [RUNNING_THE_APPLICATION.md](RUNNING_THE_APPLICATION.md) - Detailed running instructions# Kwick
