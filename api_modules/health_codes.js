// search by: name, address

const http = require('http');
const url = require('url');
const querystring = require('querystring');

function endpoint(query) {
  return {
    hostname: 'data.cityofnewyork.us',
    protocol: 'http:',
    path: '/resource/9w7m-hzhe.json?' + querystring.stringify(query)
  };
}

function getByName(name) {
  var url = endpoint({
      dba: name
  });
  console.log(url);
  var promise = new Promise(function(resolve, reject) {
    http.get(url, function(res) {
      var completeResponse = '';
      res.on('data', function(chunk) {
        completeResponse += chunk;
      });
      res.on('end', function() {
        try {
          if (typeof resolve === 'function') {
            resolve(JSON.parse(completeResponse));
          }
        } catch(e) {
          if (typeof reject === 'function') {
            reject(e);
          }
        }
      });
    });
  });
  return promise;
}

// healthCodes.getByName('Wendy\'s', res => {/* do stuff */})
// healthCodes.getByAddress({bldgNum: 383, street: 'Van Brunt St'});

module.exports = {
  getByName: getByName
};
