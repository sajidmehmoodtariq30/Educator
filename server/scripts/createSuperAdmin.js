import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from '../models/UserModel.js';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        // Check if superadmin already exists
        const existingSuperAdmin = await User.findOne({ role: 'admin' });
        if (existingSuperAdmin) {
            console.log('Super admin already exists:');
            console.log('Email:', existingSuperAdmin.email);
            console.log('Username:', existingSuperAdmin.username);
            process.exit(0);
        }

        // Create superadmin
        const superAdminData = {
            fullName: 'Super Administrator',
            username: 'superadmin',
            email: 'admin@educator.com',
            password: 'admin123456', // You can change this
            role: 'admin',
            accountStatus: 'active',
            phone: '+1234567890',
            address: 'Admin Office',
            institutionName: 'Educator Platform',
            maxStudentsAllowed: 999999, // Unlimited
            subscriptionEndDate: new Date('2099-12-31'), // Far future date
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const superAdmin = await User.create(superAdminData);
        
        console.log('Super Admin created successfully!');
        console.log('=================================');
        console.log('Email:', superAdmin.email);
        console.log('Username:', superAdmin.username);
        console.log('Password: admin123456');
        console.log('Role:', superAdmin.role);
        console.log('=================================');
        console.log('Please change the password after first login!');

    } catch (error) {
        console.error('Error creating super admin:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createSuperAdmin();
