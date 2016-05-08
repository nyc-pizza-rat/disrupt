$(document).ready(function() {
  var $chatInput = $('#btn-input');
  var $chatBtn =  $('#btn-chat');

  function getCodes() {
    $.get('/health-codes/address/383%20van%20brunt%20st').done(function(data) {
      data.forEach(function(codes) {
        $('body').append('<div>' + codes.dba + '</div>');
      });
    });
  }

  $chatBtn.click(getCodes);

  function getTrains() {

  }
});