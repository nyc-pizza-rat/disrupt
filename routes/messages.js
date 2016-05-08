const express = require('express');
const router = express.Router();
const responses = require('../more_modules/responses');

router.post('/', function(req, res) {
  console.log(req.body);
  responses.handle(req.body.message, function(response) {
    res.json({response: response});
  });
});

module.exports = router;
