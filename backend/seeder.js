import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config({ path: './backend/.env' });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminUser = {
            name: 'Admin',
            email: 'admin@onlydiamonds.in',
            password: 'vicky@onlydiamonds$',
            role: 'admin'
        };

        const userExists = await User.findOne({ email: adminUser.email });

        if (userExists) {
            // Update password if user exists to ensure it matches
            userExists.password = adminUser.password;
            userExists.role = 'admin'; // Ensure role is admin
            await userExists.save();
            console.log('Admin user updated');
        } else {
            // Create new admin user
            await User.create(adminUser);
            console.log('Admin user created');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedAdmin();
