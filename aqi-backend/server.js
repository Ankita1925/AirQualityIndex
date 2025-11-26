// server.js
const express = require('express');
const cors = require('cors'); // Required for frontend communication
require('dotenv').config(); // Load environment variables
const { getAqiByCity } = require('./apiServices');

const app = express();
const PORT = 3001; // Backend port

app.use(cors());
app.use(express.json());

// 1. RESTful API Endpoint
app.get('/api/v1/aqi/:city', async (req, res) => {
    const cityName = req.params.city;

    if (!cityName) {
        return res.status(400).json({ error: 'City name is required.' });
    }

    try {
        const result = await getAqiByCity(cityName);
        
        // Handle city not found case
        if (result.error) {
             // Handle typical scenarios/edge cases
            return res.status(404).json({ message: result.error });
        }

        // Success: show info about the city [cite: 4]
        res.json(result); 

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Web service API running on http://localhost:${PORT}`);
    // The service should run locally
});