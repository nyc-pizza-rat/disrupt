const healthCodes = require('../api_modules/health-codes');
const mtaStatus = require('../api_modules/mta_status');

const commands = {
  eat: function(name) {
    return healthCodes.getByName(name); // returns promise
  }
}

function splitCommands(message) {
  var commandRE = /^\/(\w+)\s([\w\.\s]+)/;
  return commandRE.exec(message).slice(1);
}

function restaurantCheck(healthCode) {
  if (healthCode.grade.toUpperCase() !== 'A') {
    return 'Don\'t even think of going to that place';
  } else {
    return 'meh... i guess it\'s ok';
  }
}

function handle(message, cb) {
  var parsedMessage = splitCommands(message);
  if (typeof commands[parsedMessage[1]] === 'function') {
    commands[parsedMessage[1]](parsedMessage[2]).then(function(healthCodes) {
      console.log(healthCodes[0]);
      cb(restaurantCheck(healthCodes[0]));
    });
  } else {
    // send error 'fuck you' message
  }
}

// /eat 383 dumb st
