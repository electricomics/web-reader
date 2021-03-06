/* global $, reader */

var $document = $(document);
var $body = $('body');
var $comicIframe = $('#comic-iframe');

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

var openComic = function(url) {
  $comicIframe.attr('src', url);
  $body.addClass('show-comic');
};

var closeComic = function() {
  $body.removeClass('show-comic');
  $comicIframe.attr('src', '');
};

$document.on('click', '.js-open-comic', function() {
  var url = $(this).data('url');
  openComic(url);
});

// open link to external resource in the external browser
var extLink1 = new RegExp(/^(f|ht)tps?:\/\//i);
var extLink2 = new RegExp('^(f|ht)tps?:\/\/' + location.host, 'i');
$document.on('click', 'a', function(e) {
  var $this = $(this);
  var href = $this.attr('href');
  // if it starts with ftp/http/https
  if (extLink1.test(href)) {
    // if it's different than our host
    if (!extLink2.test(href)) {
      e.preventDefault();
      sendMessage('open-link', { url: href });
      return false;
    }
  }
});

window.addEventListener('message', function(e) {
  var msg;
  // from the backend
  if (e.origin === 'file://') {
    try {
      msg = JSON.parse(e.data);
    }
    catch (err) {
      console.error(err);
      return false;
    }

    receiveMessage(msg);
  }
  // from the comics
  else if (e.origin === window.location.origin) {
    try {
      msg = JSON.parse(e.data);
    }
    catch (err) {
      console.error(err);
      return false;
    }
    if (msg.type === 'close-comic') {
      closeComic();
    }
  }
  // don't accept from anywhere else
  else {
    return false;
  }
});


sendMessage('online');