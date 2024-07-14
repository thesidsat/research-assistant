const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/proxy', (req, res) => {
    const options = {
        url: 'https://research-assistant-ouwx.onrender.com/search',
        method: 'POST',
        json: true,
        body: req.body
    };

    request(options, (error, response, body) => {
        if (error) {
            return res.status(500).send(error);
        }
        console.log("API Response:", body); // Log the API response
        res.send(body);
    });
});

app.listen(3001, () => {
    console.log('Proxy server is running on port 3001');
});
