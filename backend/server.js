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
const Issue = require('./Issue');
const Pickup = require('./Pickup');
 
const app = express();
 
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/community', router);
app.use('/api/issues', router);
 
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
 
// Fetch all communities with minimal details for dropdown
app.get('/api/communities', async (req, res) => {
  try {
    // Fetch only the fields needed for the frontend
    const communities = await Community.find({}, '_id name address'); // Fetch _id, name, and address
    res.status(200).json(communities); // Send the populated communities as a JSON response
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
    // Validate the community ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Invalid community ID' });
    }
 
    // Create a new user document
    const newUser = new User({
      fullName,
      email,
      phone,
      role: 'community-user',
      password: hashedPassword,
      address,
      communityId: communityId,
 
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
 
/// Broadcast Message Route
app.post('/api/broadcast', async (req, res) => {
  const { userId, message, notifType, sent_Time, communityId } = req.body; // Get communityId from body
 
  // Check if all required fields are provided
  if (!userId || !communityId || !message || !notifType || !sent_Time) {
    return res.status(400).json({ message: 'UserId, communityId, message, notifType, and sent_Time are required' });
  }
 
  try {
    // Validate the userId (ensure it's an admin)
    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can broadcast messages' });
    }
 
    // Validate the communityId (check if the community exists)
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(400).json({ message: 'Invalid communityId' });
    }
 
    // Create and save the broadcast message
    const newBroadcast = new Broadcast({
      message,
      notifType,
      sent_Time,
      userId, // Associate with admin's ID
      communityId, // Add communityId to the broadcast
    });
 
    const savedBroadcast = await newBroadcast.save();
    res.status(201).json({ message: 'Broadcast message sent successfully', data: savedBroadcast });
  } catch (error) {
    console.error('Error broadcasting message:', error);
    res.status(500).json({ message: 'Error broadcasting message' });
  }
});

app.get('/api/community/by-admin/:adminId', async (req, res) => {
  const { adminId } = req.params;

  // Validate adminId format
  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid adminId format' });
  }

  try {
    // Find the community created by the admin
    const community = await Community.findOne({ createdBy: adminId }).select('_id').exec();

    if (community) {
      return res.status(200).json({ communityId: community._id });
    } else {
      return res.status(404).json({ message: 'Community not found for this admin.' });
    }
  } catch (error) {
    console.error('Error fetching communityId:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/community/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by userId and ensure they are an admin
    const user = await User.findById(userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can fetch community data.' });
    }

    // Fetch community associated with this admin
    const community = await Community.findOne({ createdBy: userId }).exec();

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Include the admin's name and email
    const adminData = {
      fullName: user.fullName,
      email: user.email,
    };

    res.status(200).json({ community });
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
 
// POST endpoint to report a new issue
app.post('/api/issues', async (req, res) => {
  const { type, location, description, comments, userId } = req.body;
 
  // Ensure userId and required fields are provided
  if (!userId || !type || !location || !description) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
 
  try {
    const newIssue = new Issue({
      type,
      location,
      description,
      comments,
      userId,  // Make sure userId is included in the saved issue
      reportedAt: new Date()
    });
 
    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);  // Send back the saved issue
  } catch (error) {
    console.error('Error saving issue:', error);
    res.status(500).json({ message: 'Error saving issue', error: error.message });
  }
});

// GET /api/issues endpoint to fetch issues reported by the logged-in user
app.get('/api/issues', async (req, res) => {
  try {
    const userId = req.query.userId; // Retrieve userId from query parameters

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch issues reported by the logged-in user
    const issues = await Issue.find({ userId: userId });

    if (!issues) {
      return res.status(404).json({ message: 'No issues found for this user' });
    }

    res.status(200).json(issues); // Return issues as JSON response
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/issues', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const issues = await Issue.find({ userId });
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.patch('/api/issues/:issueId', async (req, res) => {
  const { issueId } = req.params;
  const { status, userId } = req.body;

  if (!status || !userId) {
    return res.status(400).json({ message: 'Status and user ID are required' });
  }

  try {
    const issue = await Issue.findOneAndUpdate(
      { _id: issueId, userId },
      { status },
      { new: true }
    );

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found or unauthorized' });
    }

    res.status(200).json({ message: 'Issue status updated', issue });
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 
app.get('/api/issues/issue-types', async (req, res) => {
  try {
    const { startDate, endDate, userId, userRole } = req.query;

    // Validate required fields
    if (!startDate || !endDate || !userRole) {
      return res.status(400).json({ message: 'Invalid query parameters' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Build query object
    let query = { reportedAt: { $gte: start, $lte: end } };

    if (userRole !== 'admin') {
      if (!userId || userId === 'null') {
        return res.status(400).json({ message: 'User ID is required for non-admin users' });
      }

      // Ensure userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid User ID' });
      }

      query.userId = new mongoose.Types.ObjectId(userId);
    }

    // Fetch issues from database
    const issues = await Issue.find(query);

    if (!issues.length) {
      return res.status(404).json({ message: 'No issues found for the given date range' });
    }

    const issueCounts = issues.reduce((counts, issue) => {
      counts[issue.type] = (counts[issue.type] || 0) + 1;
      return counts;
    }, {});

    res.json({ issueCounts, message: 'Issue counts retrieved successfully' });
  } catch (error) {
    console.error('Error retrieving issue types:', error);
    res.status(500).json({ message: 'Error retrieving issue types', error });
  }
});

app.get('/api/pickups/statistics', async (req, res) => {
  try {
    const { startDate, endDate, userId, userRole } = req.query;

    // Convert the provided start and end dates to Date objects and log them
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('Start Date:', start);
    console.log('End Date:', end);

    // Build the query to retrieve the pickups within the date range
    let query = {
      pickupDate: { $gte: start, $lte: end }
    };

    // If the user is not an admin, filter by userId
    if (userRole !== 'admin') {
      query.userId = userId;
    }

    // Retrieve all pickups matching the query
    const pickups = await Pickup.find(query);

    // Log the retrieved pickups for debugging
    console.log('Retrieved Pickups:', pickups);

    // Initialize pickup statistics counters
    const pickupStats = {
      recyclable: 0,
      hazardous: 0,
      household: 0
    };

    // Iterate over the pickups and count based on pickupType and pickupStatus
    pickups.forEach(pickup => {
      console.log('Processing Pickup:', pickup); // Log each pickup being processed

      if (pickup.pickupType === 'Recyclable Waste') {
        pickupStats.recyclable += 1;
      } else if (pickup.pickupType === 'Hazardous Waste') {
        pickupStats.hazardous += 1;
      } else if (pickup.pickupType === 'Household Waste') {
        pickupStats.household += 1;
      }
    });

    // Log the statistics before sending the response
    console.log('Pickup Stats:', pickupStats);

    // Send the response with the statistics
    res.json({
      pickupStats,
      message: 'Pickup statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching pickup statistics:', error);
    res.status(500).json({ message: 'Error fetching pickup statistics', error });
  }
});

app.get('/api/pickups/recycling-rates', async (req, res) => {
  try {
    const { startDate, endDate, userId, userRole } = req.query;

    // Convert the provided start and end dates to Date objects and log them
    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log('Start Date:', start);
    console.log('End Date:', end);

    // Build the query to retrieve pickups within the date range
    let query = {
      pickupDate: { $gte: start, $lte: end }
    };

    // If the user is not an admin, filter by userId
    if (userRole !== 'admin') {
      query.userId = userId;
    }

    // Retrieve all pickups matching the query
    const pickups = await Pickup.find(query);

    // Log the retrieved pickups for debugging
    console.log('Retrieved Pickups:', pickups);

    // Initialize counters for each pickup type
    const pickupCounts = {
      recyclable: 0,
      hazardous: 0,
      household: 0,
    };

    // Count the pickups by type
    pickups.forEach(pickup => {
      console.log('Processing Pickup:', pickup); // Log each pickup being processed

      if (pickup.pickupType === 'Recyclable Waste') {
        pickupCounts.recyclable += 1;
      } else if (pickup.pickupType === 'Hazardous Waste') {
        pickupCounts.hazardous += 1;
      } else if (pickup.pickupType === 'Household Waste') {
        pickupCounts.household += 1;
      }
    });

    // Calculate the total number of pickups
    const totalPickups = pickups.length;

    // Log the counts and total pickups for debugging
    console.log('Pickup Counts:', pickupCounts);
    console.log('Total Pickups:', totalPickups);

    // Calculate the recycling rates
    const recyclingRates = {
      recyclable: totalPickups > 0 ? (pickupCounts.recyclable / totalPickups) * 100 : 0,
      hazardous: totalPickups > 0 ? (pickupCounts.hazardous / totalPickups) * 100 : 0,
      household: totalPickups > 0 ? (pickupCounts.household / totalPickups) * 100 : 0
    };

    // Log the recycling rates before sending the response
    console.log('Recycling Rates:', recyclingRates);

    // Send the response with the recycling rates
    res.json({
      recyclingRates,
      message: 'Recycling rates calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating recycling rates:', error);
    res.status(500).json({ message: 'Error calculating recycling rates', error });
  }
});

// Get community details
app.get('/api/community', async (req, res) => {
  try {
    // Retrieve communityId either from request headers (for admin) or from user data
    const userId = req.headers['user-id']; // Get userId from the request headers (could be part of a session/token)
    const communityId = req.headers['community-id'];

    console.log('Received communityId from headers:', communityId);

    // If no communityId provided, fetch it based on userId (for users)
    if (!communityId && userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found:', user);
      const communityIdFromUser = user.communityId;  // Assume user has a communityId field
      if (!mongoose.Types.ObjectId.isValid(communityIdFromUser)) {
        return res.status(400).json({ message: 'Invalid community ID format from user data' });
      }
      const community = await Community.findById(communityIdFromUser);
      if (!community) {
        return res.status(404).json({ message: 'Community not found for this user' });
      }
      return res.status(200).json(community);  // Return community details for user
    }

    // Validate if the provided communityId is valid for admin
    if (!mongoose.Types.ObjectId.isValid(communityId)) {
      return res.status(400).json({ message: 'Invalid community ID format' });
    }

    // For admin, fetch the community directly by communityId
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found for admin' });
    }

    console.log('Community details retrieved:', community);
    return res.status(200).json(community);  // Return community details for admin
  } catch (error) {
    console.error('Error in /api/community:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

//Save pickup
app.post('/api/pickup', async (req, res) => {
  const { userId, communityId, pickupType, pickupDate, pickupTime } = req.body;
  try {
    const newPickup = new Pickup({
      userId,
      communityId,
      pickupType,
      pickupDate,
      pickupTime,
      pickupStatus: 'NEW',
      createdBy: userId  // Admin ID
    });
    const savedPickup = await newPickup.save();
    res.status(201).json(savedPickup);
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling pickup', error: error.message });
  }
});

app.get('/api/pickups/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Fetch pickup history for the given userId
    const pickups = await Pickup.find({ userId })
      .select('pickupDate pickupType') // Only select the necessary fields
      .exec();

    if (pickups.length === 0) {
      return res.status(404).json({ message: 'No pickup history found for this user' });
    }

    const pickupHistory = pickups.map(pickup => ({
      date: pickup.pickupDate,
      type: pickup.pickupType
    }));

    res.status(200).json(pickupHistory);
  } catch (error) {
    console.error('Error fetching pickup history:', error);
    res.status(500).json({ message: 'Error retrieving pickup history', error: error.message });
  }
});

// 1. Fetch Notifications for a Community
app.get('/api/notifications/:communityId', async (req, res) => {
  const { communityId } = req.params;

  try {
    const notifications = await Broadcast.find({ communityId }) // Ensure this is a valid ObjectId
      .sort({ sent_Date: -1, sent_Time: -1 }) // Sort by date and time, newest first
      .lean();

    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
});

// 2. Mark a Notification as Read
app.patch('/api/notifications/:message', async (req, res) => {
  const { message } = req.params;

  try {
    const notification = await Broadcast.findOneAndUpdate(
      { message },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ message: 'Notification marked as read.', notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ message: 'Failed to update notification.' });
  }
});

// 3. Delete a Notification
app.delete('/api/notifications/:message', async (req, res) => {
  const { message } = req.params;

  try {
    const result = await Broadcast.findOneAndDelete({ message });

    if (!result) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ message: 'Notification deleted successfully.' });
  } catch (err) {
    console.error('Error deleting notification:', err);
    res.status(500).json({ message: 'Failed to delete notification.' });
  }
});

app.get('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('communityId', 'name').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      communityName: user.communityId?.name || 'No community assigned'
    });
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

app.get('/api/pickups/stats', async (req, res) => {
  const { userId, communityId } = req.query;

  console.log('Received userId:', userId);
  console.log('Received communityId:', communityId);
  console.log('Is userId valid?', mongoose.Types.ObjectId.isValid(userId));
  console.log('Is communityId valid?', mongoose.Types.ObjectId.isValid(communityId));

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(communityId)) {
    return res.status(400).json({ message: 'Invalid userId or communityId format' });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(communityId)) {
    return res.status(400).json({ message: 'Invalid userId or communityId format' });
  }

  try {
    // Count all pickups for the community
    const totalPickups = await Pickup.countDocuments({ communityId });

    // Count successful pickups for the community
    const successfulPickups = await Pickup.countDocuments({
      communityId,
      pickupStatus: 'COMPLETED'
    });

    // Find the next scheduled pickup
    const nextPickup = await Pickup.findOne({
      communityId,
      pickupStatus: 'NEW'
    })
      .sort({ pickupDate: 1, pickupTime: 1 })
      .lean();

    // Fetch the recent pickups for the user
    const recentPickups = await Pickup.find({ userId })
      .sort({ pickupDate: -1 })
      .limit(5)
      .lean();

    res.json({
      totalPickups,
      successfulPickups,
      nextPickup: nextPickup
        ? {
            pickupDate: nextPickup.pickupDate,
            pickupTime: nextPickup.pickupTime
          }
        : null,
      recentPickups: recentPickups.map((pickup) => ({
        date: pickup.pickupDate,
        status: pickup.pickupStatus
      }))
    });
  } catch (err) {
    console.error('Error fetching pickup stats:', err);
    res.status(500).json({ message: 'Failed to fetch pickup stats' });
  }
});


module.exports = router;
 
// Start the Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});