const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Middleware
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware'); // Update path accordingly
const adminMiddleware = require('./middleware/adminMiddleware'); // Update path accordingly

// Use middleware
app.use('/api', authMiddleware); // Apply authMiddleware globally

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve images directly from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Additional middleware for handling file uploads
app.use('/api/users/uploadProfileImage', upload.single('profileImage'), (req, res) => {
  try {
    // File path of the uploaded image
    const profileImagePath = req.file.path;

    // Return the image path in the response
    res.json({ profileImage: profileImagePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Routes
app.use('/api', productRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
// Apply adminMiddleware after authMiddleware
app.use('/api', adminMiddleware);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
