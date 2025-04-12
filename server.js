require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const qs = require('qs');

const app = express();

// Allow all origins for development
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('portfolio')); // Serve static files from portfolio directory

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Endpoint to handle message sending
app.post('/send-message', async (req, res) => {
    try {
        console.log('Received message request:', req.body);
        console.log('Message field type:', typeof req.body.message);
        console.log('Message field value:', req.body.message);
        
        const { name, email, message } = req.body;
        
        // Sanitize email for SMS
        const sanitizedEmail = email.replace('@', '(at)');

        if (!name) {
            console.error('Missing name field');
            return res.status(400).json({ error: 'Missing name field' });
        }
        
        if (!email) {
            console.error('Missing email field');
            return res.status(400).json({ error: 'Missing email field' });
        }
        
        if (!message) {
            console.error('Missing message field');
            return res.status(400).json({ error: 'Missing message field' });
        }
        
        // Format the message
        const smsMessage = `New message from website:
Name: ${name}
Email: ${sanitizedEmail}
Message: ${message}`;
        
        // Twilio API credentials
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        const toNumber = '+18768314473';

        console.log('Sending SMS with:');
        console.log(`From: ${fromNumber}`);
        console.log(`To: ${toNumber}`);
        console.log(`Account SID: ${accountSid.substring(0, 10)}...`);
        console.log(`Message: ${smsMessage}`);

        // Prepare the request data
        const data = qs.stringify({
            'To': toNumber,
            'From': fromNumber,
            'Body': smsMessage
        });

        // Make request to Twilio API
        const response = await axios({
            method: 'post',
            url: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: accountSid,
                password: authToken
            }
        });

        console.log('Twilio API Response:', response.status, response.statusText);
        console.log('Response data:', JSON.stringify(response.data));

        if (response.status === 201) {
            res.status(200).json({ message: 'Message sent successfully' });
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending message:');
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Status:', error.response.status);
            console.error('Headers:', JSON.stringify(error.response.headers));
            console.error('Data:', JSON.stringify(error.response.data));
            
            return res.status(500).json({ 
                error: 'Failed to send message via Twilio', 
                details: error.response.data 
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            return res.status(500).json({ error: 'No response from Twilio API' });
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the site`);
}); 