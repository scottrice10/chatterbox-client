// Backbone
var Message = Backbone.Model.extend({
  defaults : {username: ""},
  url: 'https://api.parse.com/1/classes/chatterbox',
});


var MessageView = Backbone.View.extend({
  template: _.template('<div class="chat" data-id="<%- objectId %>"> \
                       <div class="user"><%- username %></div> \
                       <div class="text"><%- text %></div> \
                       </div>'),
 render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sync', this.render, this);
    this.messagesOnScreen = {};
  },
  render: function() {
    this.collection.forEach(this.renderMessage, this);
  },
  renderMessage: function(message) {
    if (!this.messagesOnScreen[message.get("objectId")]){
      var messageView = new MessageView({model: message});
      this.$el.prepend(messageView.render());
      this.messagesOnScreen[message.get("objectId")] = true;
    }
  }
});

// var MessagesView = Backbone.View.extend({

//   initialize: function(){
//     this.collection.on('sync', this.render, this);
//     this.onscreenMessages = {};
//   },

//   render: function(){
//     this.collection.forEach(this.renderMessage, this);
//   },

//   renderMessage: function(message){
//     if( !this.onscreenMessages[message.get('objectId')] ){
//       var messageView = new MessageView({model: message});
//       this.$el.prepend(messageView.render());
//       this.onscreenMessages[message.get('objectId')] = true;
//     }
//   }

// });


var Messages = Backbone.Collection.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  parse: function(response, options){
    var results = [];
    for( var i = response.results.length-1; i >= 0; i-- ){
      results.push(response.results[i]);
    }
    return results;
  },
  model: Message,
  getMessages : function(){
    return this.fetch({data: {order: "-createdAt"}});
  },

});

var FormView = Backbone.View.extend({

  initialize: function(){
    this.collection.on('sync', this.stopSpinner, this);
  },

  events: {
    'submit #send': 'handleSubmit'
  },

  handleSubmit: function(e){
    e.preventDefault();

    this.startSpinner();

    var $text = this.$('#message');
    this.collection.create({
      username: window.location.search.substr(10),
      text: $text.val()
    });
    $text.val('');
  },

  startSpinner: function(){
    this.$('.spinner img').show();
    this.$('form input[type=submit]').attr('disabled', "true");
  },

  stopSpinner: function(){
    this.$('.spinner img').fadeOut('fast');
    this.$('form input[type=submit]').attr('disabled', null);
  }

});




// // jQuery
// //
// //
// var message = {
//   'username': 'shawndrost',
//   'text': 'trololo',
//   'roomname': '4chan'
// };

// var app = {rooms:{}, data: [], roomFilters: {}, allRooms: {}, currentRooms: {}};

// app.server = 'https://api.parse.com/1/classes/chatterbox';

// app.doCheckboxes = function(i, key){
//   key = key || i;
//   console.log(key)
//   if(app.allRooms[i]){
//     $('#' + i).prop( "checked", true );
//   } else {
//     $('#' + i).prop( "checked", false );
//   }
//   ($('#' + i).prop( "checked")) ? (app.roomFilters[key] = true) : (delete app.roomFilters[key]);
// };

// app.fetch = function(){
//   var that = this;
//   $.ajax({
//     // always use this url
//     url: app.server,
//     type: 'GET',
//     contentType: 'application/json',
//     success: function (data) {
//       that.data = data.results;
//       $('.messages').html('');
//       app.currentRooms = {};
//       data = data.results.filter(function(message, index, array) {
//         var room = _.escape(message.roomname);
//         app.currentRooms[room] = false;
//         if (Object.keys(app.roomFilters).length && !(message.roomname in app.roomFilters)) {
//           return false;
//         }
//         else {
//           $('.messages').append("<li>"
//             + "<span>Created at: " + _.escape(message.createdAt) + "</span></br>"
//             + "<span>Update at: " + _.escape(message.updatedAt) + "</span></br>"
//             + "<span>Function: " + _.escape(message.fn) + "</span></br>"
//             + "<span>Message: " + _.escape(message.text) + "</span></br>"
//             + "<span>Username: " + _.escape(message.username) + "</span></br>"
//             + "<span>Roomname: "  + _.escape(message.roomname)   + "</span></br>"
//             + "</br></br>"
//             + "</li>");
//           that.rooms[message.roomname] = true;
//         }
//         if(index === array.length - 1 && Object.keys(app.allRooms).length !== Object.keys(app.currentRooms).length) {
//           var temp = {};
//           for (var i in app.currentRooms) {
//             temp[i] = app.allRooms[i] || false;;
//           }
//           app.allRooms = temp;
//           delete temp;
//         }
//       });

//       $('#roomSelect').html('');
//       for (var i in app.allRooms) {
//         $('#roomSelect').append("<input type='checkbox' id='" + i + "'>" + i + "</br>")
//         .on('click', function(event){
//           var key = _.escape(event.target.id);
//           app.allRooms[key] = !app.allRooms[key];
//           app.doCheckboxes(i, key);
//           app.fetch();
//         });

//         //app.doCheckboxes(i);
//       }
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message', "get");
//     }
//   });
// };


// app.send = function(message){
//   $.ajax({
//     // always use this url
//     url: app.server,
//     type: 'POST',
//     data: JSON.stringify(message),
//     contentType: 'application/json',
//     success: function (data) {
//       console.log('chatterbox: Message sent');
//     },
//     error: function (data) {
//       // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//       console.error('chatterbox: Failed to send message', "post");
//     }
//   });
// };

// app.init = function(message){
//   this.fetch();
// };

// app.addRoom = function(room){
//   $('#roomSelect').append("<span>Room: " + _.escape(room) + "</span>")
// };

// app.addMessage = function(message){
//   this.send(message);
//   $('#chats').append("<li>"
//       + "<span>Created at: " + _.escape(message.createdAt) + "</span></br>"
//       + "<span>Update at: " + _.escape(message.updatedAt) + "</span></br>"
//       + "<span>Function: " + _.escape(message.fn) + "</span></br>"
//       + "<span>Message: " + _.escape(message.text) + "</span></br>"
//       + "<span>Username: " + _.escape(message.username) + "</span></br>"
//       + "<span>Roomname: " + _.escape(message.roomname) + "</span></br>"
//       + "</br></br>"
//       + "</li>");

// };

// app.clearMessages = function(message){
//   $('#chats').html('');
// };

// app.init();

// setInterval(function(){
//   app.fetch();
// },15000);
