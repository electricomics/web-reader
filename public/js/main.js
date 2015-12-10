/* global $ */

var sendMessage = function(type, obj) {
  var msg = {
    type: type
  };
  $.extend(msg, obj);
  window.parent.postMessage(JSON.stringify(msg), '*');
};

var receiveMessage = function(msg) {
  if (msg.type === 'error') {
    dialogError(msg.message);
  }
  if (msg.type === 'online') {
    $('#online').toggleClass('online', msg.status);
  }
};

var dialogError = function(msg) {
  var confirm = $('#dialog-error').dialog({
    resizable: false,
    modal: true,
    width: 550,
    buttons: {
      'Close': function() {
        $(this).dialog('close');
      }
    }
  });
  confirm.html('<p>' + msg + '</p>');
  confirm.dialog('open');
};

window.addEventListener('message', function(e) {
  if (e.origin !== 'file://') {
    return false;
  }
  var msg;
  try {
    msg = JSON.parse(e.data);
  }
  catch (err) {
    console.error(err);
    return false;
  }

  receiveMessage(msg);
});

sendMessage('online');