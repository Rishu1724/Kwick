# Sports Equipment Rental Platform

A comprehensive sports equipment rental platform built with the MERN stack, allowing users to rent sports equipment (badminton, cricket, tennis, football gear, etc.) with integrated payment processing, booking management, and real-time availability tracking.

## Features

### User Management & Authentication
- User registration with role selection (renter/owner/both)
- JWT-based authentication with refresh tokens
- Email verification and password reset
- User profiles with personal information, rental history, and payment methods
- Ratings and reviews system

### Equipment Management
- Create, read, update, delete equipment listings
- Equipment categories (badminton, cricket, tennis, football, gym, cycling, etc.)
- Sub-categories (rackets, bats, balls, protective gear, etc.)
- Multiple image upload (min 3, max 10 per listing)
- Equipment specifications (brand, model, size, condition, age, replacement value)
- Available quantity tracking
- Rental rates (hourly/daily/weekly/monthly)
- Security deposit amount
- Equipment status (available, rented, maintenance, retired)
- Inventory tracking
- Equipment maintenance logs
- QR code generation for each equipment

### Booking & Reservation System
- Real-time availability calendar
- Date and time range selection
- Instant booking or request-to-book options
- Booking confirmation system
- Booking modifications and cancellations
- Cancellation policies (flexible, moderate, strict)
- Automatic booking expiration
- Waitlist functionality
- Booking extensions
- Multi-item booking support

### Payment Integration
- Multiple payment gateways (Stripe, PayPal, Razorpay)
- Secure payment processing
- Security deposit handling
- Partial payments option
- Refund processing
- Payment hold and release system
- Automatic payment splitting (platform fee)
- Invoice generation
- Wallet system for quick payments
- Coupon and promo code support
- Dynamic pricing (peak hours, seasons)
- Late fee automatic calculation

### Delivery & Pickup System
- Delivery options (self-pickup, home delivery, store pickup points)
- Delivery scheduling
- Real-time delivery tracking
- Delivery partner integration
- Delivery fee calculation based on distance
- Return pickup scheduling
- Equipment condition verification (photos on pickup/return)
- Digital signature for handover

### Search & Discovery
- Advanced search with filters (equipment type, price range, location, availability dates, ratings, brand, condition)
- Map-based search
- Nearby equipment finder (GPS integration)
- Search history
- Autocomplete suggestions
- Featured equipment
- Trending rentals
- Seasonal recommendations

### Rating & Review System
- Rate equipment (1-5 stars)
- Rate owners/renters
- Written reviews with photos
- Review verification (only after rental completion)
- Response to reviews
- Review moderation
- Helpful review voting
- Review filtering and sorting

### Messaging & Communication
- Real-time chat between renters and owners
- Automated booking confirmations
- SMS notifications
- Email notifications (booking confirmations, payment receipts, reminders, review requests, promotional emails)
- Push notifications (mobile app)
- In-app notifications
- Video call integration for equipment inspection

### Insurance & Damage Protection
- Optional damage protection plans
- Insurance claim filing
- Damage assessment workflow
- Security deposit deduction process
- Dispute resolution system
- Photo documentation requirements

### Analytics & Reporting
- Revenue dashboard for equipment owners
- Booking statistics
- Popular equipment analysis
- Rental calendar view
- Customer insights
- Payout reports
- Tax reports
- User growth metrics
- Transaction reports
- Revenue analytics
- Popular categories
- Geographic data
- Peak usage times
- Financial reconciliation

### Admin Panel
- User management (approve, suspend, delete)
- Equipment listing moderation
- Category management
- Pricing and commission settings
- Featured listings management
- Review moderation
- Dispute resolution
- Payment management
- Report generation
- System settings
- Email template management
- Promotion/coupon management

## Technology Stack

### Frontend
- React.js with Hooks
- React Router v6
- Axios for HTTP requests
- Context API for state management
- CSS for styling
- TailwindCSS or Material-UI (optional)

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt.js for password hashing
- Nodemailer for emails
- Multer/Cloudinary for image uploads
- Stripe/PayPal/Razorpay SDK for payments
- Socket.io for real-time features

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user details
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/refresh-token` - Refresh token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-document` - Upload user document
- `GET /api/users/:id/reviews` - Get user reviews
- `GET /api/users/:id/listings` - Get user listings

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `GET /api/equipment/:id` - Get single equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment
- `GET /api/equipment/category/:category` - Get equipment by category
- `POST /api/equipment/:id/images` - Upload equipment images
- `GET /api/equipment/:id/availability` - Get equipment availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `POST /api/bookings/:id/cancel` - Cancel booking
- `POST /api/bookings/:id/extend` - Extend booking
- `GET /api/bookings/:id/invoice` - Get booking invoice

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/refund` - Process refund
- `GET /api/payments/history` - Get payment history
- `POST /api/payments/webhook` - Payment webhook
- `POST /api/payments/security-deposit` - Handle security deposit
- `GET /api/payments/:id` - Get payment by ID

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/equipment/:equipmentId` - Get equipment reviews
- `GET /api/reviews/user/:userId` - Get user reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Messages
- `POST /api/chats` - Send message
- `GET /api/chats/conversations` - Get conversations
- `GET /api/chats/:conversationId` - Get conversation messages
- `PUT /api/chats/:id/read` - Mark message as read

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Admin
- `GET /api/admin/users` - Get users (admin)
- `GET /api/admin/equipment` - Get equipment (admin)
- `GET /api/admin/bookings` - Get bookings (admin)
- `GET /api/admin/analytics` - Get analytics (admin)
- `PUT /api/admin/users/:id/status` - Update user status (admin)
- `GET /api/admin/reports` - Get reports (admin)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5002
MONGO_URI=mongodb://localhost:27017/kwick
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=your_email_from
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5002
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the frontend development server:
```bash
npm run dev
```

## Development Workflow

1. **Phase 1: Foundation** - Project setup, database design, authentication
2. **Phase 2: Core Features** - Equipment management, categories, search
3. **Phase 3: Booking System** - Availability calendar, booking creation
4. **Phase 4: Payment Integration** - Stripe/PayPal integration
5. **Phase 5: Communication** - Real-time messaging, notifications
6. **Phase 6: Reviews & Ratings** - Review system
7. **Phase 7: Admin Panel** - Admin dashboard
8. **Phase 8: Additional Features** - Delivery, insurance, loyalty programs
9. **Phase 9: Testing & Optimization** - Unit testing, performance
10. **Phase 10: Deployment** - Production setup

## Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- Protected API routes
- CORS configuration
- Environment variable configuration
- Data encryption (in transit and at rest)
- API rate limiting
- CSRF protection
- SQL injection prevention
- XSS protection
- Session management
- Audit logs
- Two-factor authentication

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.