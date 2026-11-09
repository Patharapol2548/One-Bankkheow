const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors()); // Access-Control-Allow-Origin
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const userRoutes = require('./src/routes/userRoutes');

// Route
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/user', userRoutes);

// Error handling 404
app.use((req, res) => {
    res.status(404).send('Service not found');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
