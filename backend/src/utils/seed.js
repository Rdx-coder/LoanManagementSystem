const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Customer = require('../models/Customer');
const LoanOfficer = require('../models/LoanOfficer');
const LoanApplication = require('../models/LoanApplication');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    await User.deleteMany({});
    await Customer.deleteMany({});
    await LoanOfficer.deleteMany({});
    await LoanApplication.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const passwordHash = await bcrypt.hash('password123', 10);

    const customers = [
      {
        name: 'Ravi Kumar',
        email: 'ravi@example.com',
        income: 500000,
        creditScore: 750
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        income: 800000,
        creditScore: 720
      },
      {
        name: 'Amit Patel',
        email: 'amit@example.com',
        income: 300000,
        creditScore: 650
      }
    ];

    for (const customerData of customers) {
      const user = new User({
        name: customerData.name,
        email: customerData.email,
        passwordHash,
        role: 'CUSTOMER'
      });
      await user.save();

      const customer = new Customer({
        userId: user._id,
        income: customerData.income,
        creditScore: customerData.creditScore
      });
      await customer.save();

      console.log(`✅ Created customer: ${user.email}`);
    }

    const officers = [
      {
        name: 'Suresh Reddy',
        email: 'suresh.officer@example.com',
        branch: 'Mumbai Branch'
      },
      {
        name: 'Meena Singh',
        email: 'meena.officer@example.com',
        branch: 'Delhi Branch'
      }
    ];

    for (const officerData of officers) {
      const user = new User({
        name: officerData.name,
        email: officerData.email,
        passwordHash,
        role: 'OFFICER'
      });
      await user.save();

      const officer = new LoanOfficer({
        userId: user._id,
        branch: officerData.branch
      });
      await officer.save();

      console.log(`✅ Created officer: ${user.email}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Customer: ravi@example.com / password123');
    console.log('   Officer:  suresh.officer@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();