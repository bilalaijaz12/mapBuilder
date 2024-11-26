require('dotenv').config();
const express = require('express');
const cors = require('cors');
const parcelRoutes = require('./routes/parcel.routes');
const zoningRoutes = require('./routes/zoning.routes');
const structuresRoutes = require('./routes/structures.routes');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/parcels', parcelRoutes);
app.use('/api/zoning', zoningRoutes);
app.use('/api/structures', structuresRoutes);

// Basic error handler
// Basic error handler
app.use((err, req, res, next) => {
    console.error('Error details:', err);  // Log full error
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: err.message,  // Always show error message for debugging
      details: err.response?.data  // Show Lightbox API error details if any
    });
  });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});