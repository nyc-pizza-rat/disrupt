const express = require('express');
const weather = require('weather-js');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('Specify a resource');
});

router.get('/location/:id', function(req, res) {
	var weatherQuery = {
		search: req.params.id,
		degreeType: 'F'
	};
	weather.find(weatherQuery, function(err, response) {
		if(err) {
			console.log('error: ',err);
		}
		console.log(response);
		var weatherStr = `It's currently ${response[1].current.skytext.toLowerCase()} in ${response[0].location.name} with a temperature of ${response[1].current.temperature}°F and feels like ${response[1].current.feelslike}°F`
		res.json({response: weatherStr});
	});
})

module.exports = router;
