const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post('https://research-assistant-ouwx.onrender.com/search', req.body);
        console.log("API Response:", response.data); // Log the API response
        res.send(response.data);
    } catch (error) {
        console.error("API Error:", error); // Log the error
        res.status(500).send(error.message);
    }
});

app.listen(3001, () => {
    console.log('Proxy server is running on port 3001');
});
