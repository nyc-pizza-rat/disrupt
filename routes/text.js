const express = require('express');
const router = express.Router();
const responses = require('../more_modules/responses');
const twilio = require('twilio');

// Load configuration information from system environment variables.
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;

// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
// Receive message

router.get('/', function(req, res) {
   var twiml = new twilio.TwimlResponse();
   res.writeHead(200, {'Content-Type': 'text/xml'});
   res.end(twiml.toString());
});
// Send message
router.post('/', function(req, res) {
   var twiml = new twilio.TwimlResponse();
   responses.getResponse(req.body.Body, function(response) {
     twiml.message(response);
     res.writeHead(200, {'Content-Type': 'text/xml'});
     res.end(twiml.toString());
   });
});

module.exports = router;