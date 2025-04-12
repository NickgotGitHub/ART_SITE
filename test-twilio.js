require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

async function testTwilioMessage() {
    try {
        console.log('Testing Twilio API...');
        
        // Twilio API credentials
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        const toNumber = '+18768314473';

        // Verify credentials
        console.log('Credentials Check:');
        console.log(`ACCOUNT_SID: ${accountSid ? 'Present' : 'Missing'}`);
        console.log(`AUTH_TOKEN: ${authToken ? 'Present' : 'Missing'}`);
        console.log(`PHONE_NUMBER: ${fromNumber ? 'Present' : 'Missing'}`);
        
        // Print values (partial for security)
        console.log(`ACCOUNT_SID starts with: ${accountSid.substring(0, 10)}...`);
        console.log(`AUTH_TOKEN starts with: ${authToken.substring(0, 4)}...`);
        console.log(`PHONE_NUMBER: ${fromNumber}`);
        console.log(`TO NUMBER: ${toNumber}`);

        const testMessage = 'This is a test message from the art site';

        // Prepare the request data
        const data = qs.stringify({
            'To': toNumber,
            'From': fromNumber,
            'Body': testMessage
        });

        console.log('Sending test message...');
        
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

        console.log('Success! Message sent with status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
    } catch (error) {
        console.error('Error in test:');
        if (error.response) {
            // The request was made and the server responded with an error status
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error:', error.message);
        }
    }
}

testTwilioMessage(); 