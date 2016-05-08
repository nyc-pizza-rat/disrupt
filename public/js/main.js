$(document).ready(function() {
  var $chatInput = $('#btn-input');
  var $chatBtn =  $('#btn-chat');
  var $chatBox = $('.chat');

  var sourceRat = $('#template-chat-rat').html();
  var templateRat = Handlebars.compile(sourceRat);
  var sourceUser = $('#template-chat-user').html();
  var templateUser = Handlebars.compile(sourceUser);

  function handleSubmit() {
    var message = $chatInput.val();
    $chatInput.val('');
    postMessage(message);
    $chatBox.append(templateUser({message: message}));
  }

  function postMessage(message) {
    $.post('/messages', {message: message}).done(function(data) {
      console.log(data);
      $chatBox.append(templateRat(data));
    });
  }

  $chatBtn.click(handleSubmit);

  $chatInput.keypress(function(e){
    if(e.keyCode === 13){
      handleSubmit();
    }
  });
});