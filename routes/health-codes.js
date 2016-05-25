var express = require('express');
var router = express.Router();
var healthCodes = require('../modules/api-facing/health-codes');

router.get('/name/:name', function(req, res) {
  healthCodes.getByName(req.params.name).then(function(codes) {
    res.json(codes.slice(0, 10));
  });
});

router.get('/address/:address', function(req, res) {
  healthCodes.getByAddress(req.params.address).then(function(codes) {
    res.json(codes.slice(0, 10));
  });
});

module.exports = router;
