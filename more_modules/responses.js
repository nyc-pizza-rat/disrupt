const healthCodes = require('../api_modules/health-codes');
const mtaStatus = require('../api_modules/mta_status');
const responseText = require('./responseText');

function getRandom(reponses) {
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
      cb(trainCheck(trainLine[0].status));
    }
  });
}

const commands = {
  eat: eat,
  train: train
};

function splitCommands(message) {
  var commandRE = /^\/(\w+)\s([\w\.\s]+)/;
  return commandRE.test(message) ? commandRE.exec(message).slice(1) : [];
}

function restaurantCheck(healthCode) {
  console.log(healthCode);
  if (healthCode.grade.toUpperCase() !== 'A') {
    return getRandom(responseText.healthCodes.positive);
  } else {
    return getRandom(responseText.healthCodes.negative);
  }
}

function trainCheck(lineStatus) {
  if(lineStatus !== 'GOOD SERVICE') {
    return getRandom(responseText.trains.positive);
  } else {
    return getRandom(responseText.trains.negative);
  }
}

function listTrains() {
  return `One of us isn't doing this right and I'm assuming it's you. Please choose from the list of available trains: ${mtaStatus.getTrainString().split('').join(', ')}`
}

function getResponse(message, cb) {
  var command = splitCommands(message)[0];
  var secondParam = splitCommands(message)[1];
  console.log(typeof commands[command] === 'function');
  if (typeof commands[command] === 'function' && secondParam) {
    console.log('command "is" a function');
    commands[command](secondParam, cb);
  } else {
    console.log('broken af');
    cb('');
  }
}

// /eat 383 dumb st
module.exports = {
  getResponse: getResponse
};
