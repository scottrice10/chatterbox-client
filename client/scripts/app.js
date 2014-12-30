// YOUR CODE HERE:
//

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan'
};

var app = {rooms:{}, data: [], roomFilters: [], allRooms: {}, currentRooms: {}};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.fetch = function(){
  var that = this;
  $.ajax({
    // always use this url
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      that.data = data.results;
      $('.messages').html('');
      app.currentRooms = {};
      data = data.results.filter(function(message, index, array) {
        var room = _.escape(message.roomname);
        app.currentRooms[room] = false;
        if (app.roomFilters.length && app.roomFilters.indexOf(message.roomname) === -1) {
          return false;
        }
        else {
          $('.messages').append("<li>"
            + "<span>Created at: " + _.escape(message.createdAt) + "</span></br>"
            + "<span>Update at: " + _.escape(message.updatedAt) + "</span></br>"
            + "<span>Function: " + _.escape(message.fn) + "</span></br>"
            + "<span>Message: " + _.escape(message.text) + "</span></br>"
            + "<span>Username: " + _.escape(message.username) + "</span></br>"
            + "<span>Roomname: "  + _.escape(message.roomname)   + "</span></br>"
            + "</br></br>"
            + "</li>");
          that.rooms[message.roomname] = true;
        }
        if(index === array.length - 1 && Object.keys(app.allRooms).length !== Object.keys(app.currentRooms).length) {
          var temp = {};
          for (var i in app.currentRooms) {
            temp[i] = app.allRooms[i] || false;;
          }
          app.allRooms = temp;
          delete temp;
        }
      });

      $('#roomSelect').html('');
      for (var i in app.allRooms) {
        $('#roomSelect').append("<input type='checkbox' id='" + i + "'>" + i + "</br>")
        .bind('click', function(event){
          var key = _.escape(event.target.id);
          console.log(key, event);
          app.allRooms[key] = !app.allRooms[key];
          app.roomFilters.push(key);
          app.fetch();
        });
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
},15000);
