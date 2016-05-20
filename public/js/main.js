$(document).ready(function() {
  var $chatInput = $('#btn-input');
  var $chatBtn =  $('#btn-chat');
  var $chatBox = $('.chat');

  var sourceRat = $('#template-chat-rat').html();
  var templateRat = Handlebars.compile(sourceRat);
  var sourceUser = $('#template-chat-user').html();
  var templateUser = Handlebars.compile(sourceUser);
  var $chatWindow = $('.chat-window');
  var messageCounter = 0;


  function addMessageToHistory(message) {
    var messageHistory = JSON.parse(localStorage.getItem('messageHistory'));
    if (Object.prototype.toString.call(messageHistory) !== '[object Array]') {
      messageHistory = [];
    }
    messageHistory.unshift(message);
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
  }

  function relativeEntry(increment) {
    var allHistory = JSON.parse(localStorage.getItem('messageHistory'));
    var selectedHistory = allHistory[messageCounter];
    messageCounter += increment;
    return selectedHistory;
  }

  function setInputValue(text) {
    $chatInput.val(text);
  }

  function handleSubmit() {
    var message = $chatInput.val();
    $chatInput.val('');
    postMessage(message);
    addMessageToHistory(message);
    $chatBox.append(templateUser({message: message}));
    $chatWindow.scrollTop(999999);
  }

  function postMessage(message) {
    $.post('/messages', {message: message}).done(function(data) {
      console.log(data);
      $chatBox.append(templateRat(data));
      $chatWindow.scrollTop(999999);
    });
  }

  $chatBtn.click(handleSubmit);

  $chatInput.keypress(function(e) {
    if(e.keyCode === 13) {
      handleSubmit();
    }
  });
  $chatInput.keydown(function(e) {
    if(e.keyCode === 38) {
      setInputValue(relativeEntry(1));
    }
    else if(e.keyCode === 40) {
      setInputValue(relativeEntry(-1));
    }
  });


});