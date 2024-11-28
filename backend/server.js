const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const bodyParser = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('./User');
const Community = require('./Community');
const Broadcast = require('./Broadcast');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/community', router);

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

// Middleware: Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token is required' });

  jwt.verify(token, 'wassup123', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user; // Attach user data to request
      next();
  });
};

// API Endpoints

// Admin Registration
app.post('/api/admin/register', async (req, res) => {
    const { fullName, email, phone } = req.body;
    const password = generatePassword();
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
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
  const { name, address, pickupDays, pickupStartTime, pickupEndTime, createdBy } = req.body;

  console.log('Received community registration data:', req.body);

  // Check for missing fields
  if (!name || !address || !pickupDays || !pickupStartTime || !pickupEndTime || !createdBy) {
    console.log('Validation failed: Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Verify that the `createdBy` admin exists
    const admin = await User.findById(createdBy);
    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({ message: 'Admin not found or invalid role' });
    }

    // Create the new community
    const newCommunity = new Community({
      name,
      address,
      days: pickupDays,
      startTime: pickupStartTime,
      endTime: pickupEndTime,
      createdBy,
    });

    const savedCommunity = await newCommunity.save();
    console.log('Community created and saved:', savedCommunity);
    res.status(201).json(savedCommunity); // Return the saved community
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ message: 'Error creating community' });
  }
});

// Route to get all communities with admin details
app.get('/api/communities', async (req, res) => {
  try {
    // Fetch all communities and populate the createdBy field with admin details
    const communities = await Community.find().populate('createdBy'); // Populate with the admin details

    // Send the populated communities as a JSON response
    res.status(200).json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ message: 'Error fetching communities' });
  }
});

// User Registration 
app.post('/api/user/register', async (req, res) => {
  const { fullName, email, phone, address, communityId } = req.body;

  // Check if all required fields are provided
  if (!fullName || !email || !phone || !address || !communityId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const password = generatePassword();  // Generate a password
  const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password

  try {
    // Create a new user document
    const newUser = new User({
      fullName,  // Using fullName directly
      email,
      phone,
      role: 'community-user',  // Default role for community users
      password: hashedPassword,
      address,
      community: communityId,  // Link to the specific community
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send the password to the user via email
    const mailOptions = {
      from: 'magdalene1113@gmail.com',
      to: email,
      subject: 'Your User Account Details',
      text: `Your user account has been created. Your password is: ${password}`,
    };

    // Send the email and respond back to the user
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(201).json(savedUser);  // Send the saved user back as a response
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});


// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'wassup123', // Replace with your secret key
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        communityId: user.communityId, // Include only if relevant
      },
    });    
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Broadcast Message Route
app.post('/api/broadcast', authenticateToken, async (req, res) => {
  const { message, notifType, sent_Time } = req.body;

  if (!message || !notifType || !sent_Time) {
      return res.status(400).json({ message: 'Message, notifType, and sent_Time are required' });
  }

  try {
      if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Only admins can broadcast messages' });
      }

      const newBroadcast = new Broadcast({
          message,
          notifType,
          sent_Time,
          adminId: req.user.userId,
      });

      const savedBroadcast = await newBroadcast.save();
      res.status(201).json({ message: 'Broadcast message sent successfully', data: savedBroadcast });
  } catch (error) {
      res.status(500).json({ message: 'Error broadcasting message' });
  }
});


// Endpoint to get community data by admin ID
app.get('/api/community/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const community = await Community.findOne({ createdBy: adminId }).exec();

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.status(200).json({ community });
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Start the Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});