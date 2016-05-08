const healthCodes = require('../api_modules/health-codes');
const mtaStatus = require('../api_modules/mta_status');

const commands = {
  eat: function(name) {
    return healthCodes.getByName(name); // returns promise
  },
  train: function() {
    return mtaStatus.getAllTrains(); 
  }
};

function splitCommands(message) {
  var commandRE = /^\/(\w+)\s([\w\.\s]+)/;
  return commandRE.exec(message).slice(1);
}

function restaurantCheck(healthCode) {
  console.log(healthCode);
  if (healthCode.grade.toUpperCase() !== 'A') {
    return 'Don\'t even think of going to that place';
  } else {
    return 'meh... i guess it\'s ok';
  }
}

function getTrainLine(line) {

}

function trainCheck(lineStatus) {
  if(lineStatus !== 'GOOD SERVICE') {
    return 'Ha! Good luck with that!';
  } else {
    return 'Ehh.. You might be OK.';
  }
}

function listTrains() {
  return `One of us isn't doing this right and I'm assuming it's you. Please choose from the list of available trains: ${mtaStatus.getTrainString().split('').join(', ')}`
}

function handle(message, cb) {
  var command = splitCommands(message)[0];
  var secondParam = splitCommands(message)[1];
  console.log(typeof commands[command] === 'function');
  if (typeof commands[command] === 'function') {
    switch(command){
      case 'eat':
        console.log('eat');
        commands[command](secondParam).then(function(healthCodes) {
          var codesWithGrades = healthCodes.filter(function(healthCode) {
            return healthCode.hasOwnProperty('grade');
          });
          cb(restaurantCheck(codesWithGrades[0]));
        });
        break;
      case 'train':
        console.log('got train');
        commands[command]().then(function(trains) {
          var trainLine = trains.filter(function(train) {
            if(train.name[0].indexOf(secondParam.toUpperCase()) > -1) {
              return true;
            } else {
              return false;
            }
          });
          console.log(trainLine);
          if(trainLine.length < 1){
            cb(listTrains());
          } else {
            cb(trainCheck(trainLine[0].status));
          }
        });
        break;
    }
  } else {
    // send error 'fuck you' message
  }
}

// /eat 383 dumb st
module.exports = {
  handle: handle
};
