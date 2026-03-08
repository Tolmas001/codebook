const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codebook');
        console.log('Connected to MongoDB');

        // Check if admin exists
        const adminExists = await Admin.findOne({ username: 'admin' });

        if (adminExists) {
            console.log('Admin already exists!');
            process.exit();
        }

        // Create admin
        const admin = await Admin.create({
            username: 'admin',
            password: 'admin123',
            name: 'Administrator',
            role: 'superadmin'
        });

        console.log('Admin created successfully!');
        console.log('Username: admin');
        console.log('Password: admin123');

        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
