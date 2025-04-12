require('dotenv').config();

console.log('Environment variables check:');
console.log('TWILIO_ACCOUNT_SID exists:', !!process.env.TWILIO_ACCOUNT_SID);
console.log('TWILIO_AUTH_TOKEN exists:', !!process.env.TWILIO_AUTH_TOKEN);
console.log('TWILIO_PHONE_NUMBER exists:', !!process.env.TWILIO_PHONE_NUMBER);
console.log('TO_PHONE_NUMBER exists:', !!process.env.TO_PHONE_NUMBER); 