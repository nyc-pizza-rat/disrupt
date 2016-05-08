var parseString = require('xml2js').parseString
var http = require('http')

function readTrainStatus() {
  var status = '';
  var promise = new Promise( function(res, rej) {
    http.get('http://web.mta.info/status/serviceStatus.txt', function(response) {
      var completeResponse = '';
      response.on('data', function(chunk) {
        completeResponse += chunk;
      });
      response.on('end',function() {
        parseString(completeResponse, function(err, result) {
          if(err) {
            rej('error: ', err);
          }
          status = result.service.subway[0].line;
          res(status);
        })
    	})   
    })
  })
  return promise;
}

module.exports = {
	getAllTrains: readTrainStatus,
  getTrainString: function() {
    return '1234567ACEBDFMGJZLNQRS';
  }
};