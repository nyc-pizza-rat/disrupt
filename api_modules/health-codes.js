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

function parseAddress(address) {
  var re = /^(\d+)\s*([\w\.\s]+)/;
  var result = re.exec(address);
  return {
    building: result[1],
    '$where': 'UPPER(street) like \'%'
              + result[2].replace(/\./g, '').toUpperCase()
              + '%\''
  };
}

function getCodes(query) {
  var _query = {
    '$order': 'inspection_date desc'
  };
  Object.keys(query).forEach(function(key) {
    _query[key] = query[key];
  });
  var url = endpoint(_query);
  console.log(url);
  var promise = new Promise(function(resolve, reject) {
    http.get(url, function(response) {
      var completeResponse = '';
      response.on('data', function(chunk) {
        completeResponse += chunk;
      });
      response.on('end', function() {
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

function getByName(name) {
  return getCodes({
    '$where': 'UPPER(dba) like \'%' + name.toUpperCase(name) + '%\''
  });
}

function getByAddress(address) {
  return getCodes(parseAddress(address));
}

module.exports = {
  getByName: getByName,
  getByAddress: getByAddress
};
