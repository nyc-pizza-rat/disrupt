const healthCodes = require('../api_modules/health-codes');
const mtaStatus = require('../api_modules/mta_status');

const commands = {
  eat: function(name) {
    return healthCodes.getByName(name); // returns promise
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

function handle(message, cb) {
  var command = splitCommands(message)[0];
  var restaurantName = splitCommands(message)[1];
  console.log(typeof commands[command] === 'function');
  if (typeof commands[command] === 'function') {
    commands[command](restaurantName).then(function(healthCodes) {
      var codesWithGrades = healthCodes.filter(function(healthCode) {
        return healthCode.hasOwnProperty('grade');
      });
      cb(restaurantCheck(codesWithGrades[0]));
    });
  }
  else {
    // send error 'fuck you' message
  }
}

// /eat 383 dumb st
module.exports = {
  handle: handle
};
