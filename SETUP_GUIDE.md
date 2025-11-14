# Setup Guide for Loan Origination System

## Step 1: Extract ZIP File

Extract the Loan_Origination_System.zip file. You should see:
```
Loan_Origination_System/
├── backend/
├── frontend/
├── README.md
├── SETUP_GUIDE.md
└── PROJECT_SUMMARY.txt
```

## Step 2: Backend Setup

```bash
cd backend
npm install
```

Create .env file:
```bash
cp .env.example .env
```

Edit .env with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/loan_management
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
```

## Step 3: Setup MongoDB

```bash
# Local MongoDB
sudo systemctl start mongod

# Or Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Step 4: Seed Database

```bash
cd backend
npm run seed
```

## Step 5: Start Backend

```bash
npm run dev
```

Server runs on: http://localhost:5000

## Step 6: Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## Step 7: Login

Use test credentials:
- Customer: ravi@example.com / password123
- Officer: suresh.officer@example.com / password123

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env

### Port Already in Use
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9  # Mac/Linux
```

### CORS Error
- Verify CORS_ORIGIN in backend .env matches frontend URL

## Support

For issues, refer to README.md and PROJECT_SUMMARY.txt
