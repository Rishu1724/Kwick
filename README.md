# Sports Equipment Rental Platform

A comprehensive sports equipment rental platform built with the MERN stack (MongoDB, Express.js, React, Node.js), allowing users to rent sports equipment (badminton, cricket, tennis, football gear, etc.) with integrated payment processing, booking management, and real-time availability tracking.

## Project Status: ✅ COMPLETE

This project has been successfully transformed from a general classified ads marketplace to a specialized sports equipment rental platform with all core features and functionality as specified in the new requirements.

## Features

### User Management
- ✅ User registration with role selection (renter/owner/both)
- ✅ JWT-based authentication
- ✅ Profile management with document uploads
- ✅ Password reset functionality
- ✅ Role-based access control (renter, owner, admin)
- ✅ Rental history tracking
- ✅ Payment methods management
- ✅ Ratings and reviews system
- ✅ Loyalty points program

### Equipment Management
- ✅ Create, read, update, and delete equipment listings
- ✅ Image upload support (multiple images per listing)
- ✅ Category-based organization (sports equipment categories)
- ✅ Equipment search and filtering
- ✅ Featured equipment
- ✅ Equipment status management (available, rented, maintenance, retired)
- ✅ Equipment specifications (brand, model, size, condition, age)
- ✅ Rental rates (hourly, daily, weekly, monthly)
- ✅ Security deposits and late fees
- ✅ Quantity tracking
- ✅ Maintenance logs
- ✅ QR code generation for each equipment

### Rental Features
- ✅ Favorite equipment
- ✅ Contact equipment owners
- ✅ Price negotiation
- ✅ Equipment reviews and ratings
- ✅ Report inappropriate equipment
- ✅ Social sharing
- ✅ Location-based search
- ✅ Advanced search with multiple filters
- ✅ Real-time availability calendar
- ✅ Booking system with date/time selection
- ✅ Multiple rental periods (hourly, daily, weekly, monthly)
- ✅ Payment processing integration
- ✅ Security deposits handling
- ✅ Delivery/pickup scheduling
- ✅ Equipment condition verification

### Communication
- ✅ Real-time messaging between renters and owners
- ✅ Conversation management
- ✅ Message status tracking
- ✅ Automated booking notifications
- ✅ Payment confirmations
- ✅ Equipment return reminders
- ✅ Review requests

### Admin Panel
- ✅ Manage users, equipment, and categories
- ✅ Review reported equipment
- ✅ Featured equipment management
- ✅ Content moderation
- ✅ Booking management
- ✅ Payment management
- ✅ Rental analytics
- ✅ Insurance claims handling

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

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user details

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

#### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `GET /api/equipment/:id` - Get single equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/category/:category` - Get equipment by category
- `GET /api/equipment/:id/availability` - Get equipment availability

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/extend` - Extend booking

#### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Payment webhook
- `GET /api/payments/:id` - Get payment by ID

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

#### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites` - Get user favorites
- `DELETE /api/favorites/:equipmentId` - Remove from favorites

#### Chats
- `POST /api/chats` - Send message
- `GET /api/chats/conversations` - Get all conversations
- `GET /api/chats/:conversationId` - Get messages in a conversation
- `PUT /api/chats/:messageId/read` - Mark message as read

#### Reviews
- `POST /api/reviews` - Create a review
- `GET /api/reviews/equipment/:equipmentId` - Get reviews for equipment
- `GET /api/reviews/user/:userId` - Get reviews for a user
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

#### Reports
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

2. **Phase 2: Core Equipment Features**
   - Create Equipment model and category model
   - Build equipment CRUD API endpoints
   - Setup image upload
   - Create equipment listing page with filters
   - Build equipment detail page
   - Implement search functionality

3. **Phase 3: Booking System Development**
   - Build renter and owner dashboard layouts
   - Implement role-based routing
   - Create "Post Equipment" form for owners
   - Build "My Equipment" page for owners
   - Create favorites functionality for renters
   - Implement booking calendar system

4. **Phase 4: Payment & Additional Features**
   - Integrate payment gateways (Stripe, PayPal, Razorpay)
   - Implement security deposits handling
   - Add booking management features
   - Implement chat/messaging system
   - Add email notifications
   - Build analytics for equipment owners
   - Implement featured equipment
   - Add reviews and ratings
   - Testing and bug fixes

5. **Phase 5: Advanced Features & Deployment**
   - Implement delivery scheduling
   - Add insurance options
   - Implement loyalty programs
   - Mobile optimization
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
