const healthCodes = require('../api_modules/health-codes');
const mtaStatus = require('../api_modules/mta_status');
const responseText = require('./responseText');
const weatherStatus = require('weather-js');

function getRandom(responses) {
  if (Object.prototype.toString.call(responses) !== '[object Array]') {
    throw new TypeError('response text is not an array');
  }
  return responses[Math.floor(Math.random() * responses.length)];
}

function eat(name, cb) {
  console.log('eat');
  healthCodes.getByName(name).then(function(healthCodes) {
    var codesWithGrades = healthCodes.filter(function(healthCode) {
      return healthCode.hasOwnProperty('grade');
    });
    cb(restaurantCheck(codesWithGrades[0]));
  });
}

function train(line, cb) {
  mtaStatus.getAllTrains().then(function(trains) {
    var trainLine = trains.filter(function(train) {
      if(train.name[0].indexOf(line.toUpperCase()) > -1) {
        return true;
      } else {
        return false;
      }
    });
    if(trainLine.length < 1){
      cb(listTrains());
    } else {
      cb(trainCheck(trainLine[0].status[0]));
    }
  });
}

function getTrainString(trainStatus) {
  console.log(trainStatus);
}

function weather(location, cb) {
  var weatherQuery = {
    search: location,
    degreeType: 'F'
  };
  weatherStatus.find(weatherQuery, function(err, res) {
    if(err) {
      console.log('error: ',err);
      cb(weatherResponse('error'));
    } else {
      cb(weatherResponse(res));
    }
  });
}

const commands = {
  eat: eat,
  train: train,
  weather: weather
};

function splitCommands(message) {
  var commandRE = /^\/(\w+)\s([\w\.\s]+)/;
  return commandRE.test(message) ? commandRE.exec(message).slice(1) : [];
}

function restaurantCheck(healthCode) {
  console.log(healthCode);
  if (healthCode.grade.toUpperCase() !== 'A') {
    return getRandom(responseText.healthCodes.negative);
  } else {
    return getRandom(responseText.healthCodes.positive);
  }
}

function trainCheck(lineStatus) {
  if(lineStatus !== 'GOOD SERVICE') {
    return getRandom(responseText.trains.negative) + ' Maybe you should just walk instead - go ahead and ask me what the weather is like with "/weather [location]"';
  } else {
    return getRandom(responseText.trains.positive);
  }
}

function listTrains() {
  return `One of us isn't doing this right and I'm assuming it's you. Please choose from the list of available trains: ${mtaStatus.getTrainString().split('').join(', ')}`;
}

function weatherResponse(response) {
  if(response === 'error') {
    return 'I\'m sorry, but I don\'t recognize that location. Please enter a valid city, or zip code';
  } else {
    console.log(response[0].current);
    return `It's currently ${response[0].current.skytext.toLowerCase()} in ${response[0].location.name} with a temperature of ${response[0].current.temperature}°F and feels like ${response[0].current.feelslike}°F`;
  }
}

function getResponse(message, cb) {
  var command = splitCommands(message)[0];
  var secondParam = splitCommands(message)[1];
  if (typeof commands[command] === 'function' && secondParam) {
    commands[command](secondParam, cb);
  } else {
    cb('Broken');
  }
}

// /eat 383 dumb st
module.exports = {
  getResponse: getResponse
};
