var express = require('express');
var trains = require('../modules/api-facing/mta_status')
var router = express.Router();

router.get('/',function(req, res) {
  trains.getAllTrains().then(function(status) {
    tStatus = status.map(function(train) {
      return {name: train.name, status: train.status};
    })
    res.json(tStatus);
  });
});

router.get('/:id', function(req, res) {
  trains.getAllTrains().then(function(status) {
    if(req.params.id === 'all') {
      var allTrains = status.map(function(train) {
        return train.name;
      });

      // this is to keep the SIR as a single line
      var sir = allTrains.pop();
      allTrains = allTrains.join('').split('');
      allTrains.push(sir[0]);

      res.json({status: allTrains});
    } else if(trains.getTrainString().indexOf(req.params.id) > -1){

      var trainLine = status.filter(function(train) {
        if(train.name[0].indexOf(req.params.id) > -1) {
          return true;
        } else {
          return false;
        }
      });

      res.json({status: trainLine[0].status[0]});
    } else {
      res.json({status: 'error: no such train exists'});
    }
  });
});

module.exports = router;
