const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('./User');
const Community = require('./Community');

const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// MongoDB Connection
mongoose.connect('mongodb+srv://zerowasteone:wassup123@zerowasteone.grsjq.mongodb.net/', {
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'magdalene1113@gmail.com', 
    pass: 'rgka qmxw shqi pitu',
  },
});

// Helper Function: Generate Random Password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// API Endpoints

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
    const { fullName, email, phone } = req.body;
    const password = generatePassword();
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Log the hashed password after it's initialized
    console.log(hashedPassword);
  
    try {
      const newAdmin = new User({
        fullName,
        email,
        phone,
        role: 'admin',
        password: hashedPassword,
      });
  
      const savedAdmin = await newAdmin.save();
  
      // Send password via email
      const mailOptions = {
        from: 'magdalene1113@gmail.com',
        to: email,
        subject: 'Your Admin Account Details',
        text: `Your admin account has been created. Your password is: ${password}`,
      };
  
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Error sending email' });
        }
        res.status(201).json(savedAdmin);
      });
    } catch (error) {
      console.error('Error during admin registration:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed', error: error.errors });
      }
      res.status(500).json({ message: 'Error registering admin' });
    }
});    

// Community Registration
app.post('/api/community/register', async (req, res) => {
    const { name, address, pickupDays, pickupStartTime, pickupEndTime, adminId } = req.body;
  
    try {
      const newCommunity = new Community({
        name,
        address,
        days: pickupDays,
        startTime: pickupStartTime,
        endTime: pickupEndTime,
        createdBy: adminId,
      });
  
      const savedCommunity = await newCommunity.save();
      res.status(201).json(savedCommunity);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating community' });
    }
});
  

// User Registration
app.post('/api/user/register', async (req, res) => {
  const { fullName, email, phone, address, communityId } = req.body;
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({
      name: fullName,
      email,
      phone,
      role: 'community-user',
      password: hashedPassword,
      community: communityId,
    });

    const savedUser = await newUser.save();

    // Send password via email
    const mailOptions = {
      from: 'magdalene1113@gmail.com',
      to: email,
      subject: 'Your User Account Details',
      text: `Your user account has been created. Your password is: ${password}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(201).json(savedUser);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});