// YOUR CODE HERE:
//

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

var app = {rooms:{}};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.fetch = function(){
  var that = this;
  $.ajax({
    // always use this url
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      $('.messages').html('');
      for(var i=0;i<data.results.length;i++){
        var message = data.results[i];
        // message.fn = '<img src="asdf" onerror="console.log(3)">';
        $('.messages').append("<li>"
          + "<span>Created at: " + _.escape(message.createdAt) + "</span></br>"
          + "<span>Update at: " + _.escape(message.updatedAt) + "</span></br>"
          + "<span>Function: " + _.escape(message.fn) + "</span></br>"
          + "<span>Message: " + _.escape(message.text) + "</span></br>"
          + "<span>Username: " + _.escape(message.username) + "</span></br>"
          + "<span>Roomname: " + _.escape(message.roomname) + "</span></br>"
          + "</br></br>"
          + "</li>");
        that.rooms[message.roomname] = true;
      }

      $('#roomSelect').html('');
      for (var i in that.rooms) {
        $('#roomSelect').append("<span>Room: " + _.escape(i) + "</span></br>")
      }
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', "get");
    }
  });
};


app.send = function(message){
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', "post");
    }
  });
};

app.init = function(message){
  this.fetch();
};

app.addRoom = function(room){
  $('#roomSelect').append("<span>Room: " + _.escape(room) + "</span>")
};

app.addMessage = function(message){
  this.send(message);
  $('#chats').append("<li>"
          + "<span>Created at: " + _.escape(message.createdAt) + "</span></br>"
          + "<span>Update at: " + _.escape(message.updatedAt) + "</span></br>"
          + "<span>Function: " + _.escape(message.fn) + "</span></br>"
          + "<span>Message: " + _.escape(message.text) + "</span></br>"
          + "<span>Username: " + _.escape(message.username) + "</span></br>"
          + "<span>Roomname: " + _.escape(message.roomname) + "</span></br>"
          + "</br></br>"
          + "</li>");

};

app.clearMessages = function(message){
  $('#chats').html('');
};

app.init();

setInterval(function(){
  app.fetch();
},2000);
