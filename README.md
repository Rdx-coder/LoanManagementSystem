# Loan Origination & Approval System

A full-stack loan management system built with Node.js, Express, MongoDB, and React that enables customers to apply for loans and enables loan officers to review, approve, or reject applications with automatic eligibility scoring.

## Features

### Customer Features
- User registration and JWT authentication
- Apply for various types of loans (Personal, Home, Education, Business, Vehicle)
- Real-time loan status tracking
- Automatic eligibility scoring based on credit score and income
- EMI calculator for loan planning
- Dashboard with comprehensive loan statistics

### Loan Officer Features
- Review pending loan applications
- Approve or reject loans with review notes
- Dashboard with performance statistics
- Filter loans by status
- Track approval rates and review history

### System Features
- Automatic eligibility scoring using MongoDB aggregation
- Role-based access control (RBAC) with JWT
- Secure password hashing with bcrypt
- RESTful API architecture
- Responsive React UI with real-time updates

## Technologies

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Frontend**: React 18, Vite, React Router, Axios, Context API
- **Database**: MongoDB
- **Authentication**: JWT tokens with role-based middleware

## Quick Start

### Prerequisites
- Node.js v16+
- MongoDB v5+

### Installation

1. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed  # Seed test data
npm run dev
```

2. **Frontend Setup**
```bash
cd ../frontend
npm install
npm run dev
```

3. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Test Credentials

- **Customer**: ravi@example.com / password123
- **Officer**: suresh.officer@example.com / password123

## Project Structure

```
Loan_Origination_System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── context/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## Loan Evaluation Algorithm

The system automatically evaluates loans using:
- Eligibility Score = (0.6 × creditScoreNorm) + (0.4 × incomeNorm)
- Score ≥ 0.50 → APPROVED
- Score < 0.50 → REJECTED

## API Endpoints

### Auth
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user profile

### Loans
- POST `/loans/apply` - Apply for loan
- GET `/loans/my-loans` - Get customer loans
- GET `/loans/:id/status` - Get loan status
- GET `/loans/:id` - Get loan details

### Officer
- GET `/officer/loans/pending` - Get pending loans
- GET `/officer/loans` - Get all loans
- POST `/officer/loans/:id/review` - Review loan
- GET `/officer/stats` - Get officer stats
- GET `/officer/my-reviews` - Get officer reviews

## Documentation

- See SETUP_GUIDE.md for detailed setup instructions
- See README.md for comprehensive API documentation
- See PROJECT_SUMMARY.txt for project overview

## License

MIT
