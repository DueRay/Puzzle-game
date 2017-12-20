var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/puzzle-game');
var db = mongoose.connection;
var User = require('./database').User;
var Room = require('./database').Room;
var lodash = require('lodash');

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/dist'));

let initState = [
  {x: 0, y: 0, disabled: false},
  {x: -100, y: 0, disabled: false},
  {x: -200, y: 0, disabled: false},
  {x: -300, y: 0, disabled: false},
  {x: -400, y: 0, disabled: false},
  {x: -500, y: 0, disabled: false},

  {x: 0, y: -100, disabled: false},
  {x: -100, y: -100, disabled: false},
  {x: -200, y: -100, disabled: false},
  {x: -300, y: -100, disabled: false},
  {x: -400, y: -100, disabled: false},
  {x: -500, y: -100, disabled: false},

  {x: 0, y: -200, disabled: false},
  {x: -100, y: -200, disabled: false},
  {x: -200, y: -200, disabled: false},
  {x: -300, y: -200, disabled: false},
  {x: -400, y: -200, disabled: false},
  {x: -500, y: -200, disabled: false},

  {x: 0, y: -300, disabled: false},
  {x: -100, y: -300, disabled: false},
  {x: -200, y: -300, disabled: false},
  {x: -300, y: -300, disabled: false},
  {x: -400, y: -300, disabled: false},
  {x: -500, y: -300, disabled: false},
];

const shuffle = (arr) => {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('login', function (data) {
    User.findOne(data, function (err, user) {
      if (err) {
        return console.error(err);
      }
      if (user) {
        console.log(`login - ${user.name}`);
        socket.emit('login success', user);
      } else {
        socket.emit('login failed');
      }
    });
  });

  socket.on('register', function (data) {
    console.log(`register - ${data.name}`);
    User.findOne(data, function (err, user) {
      if (err) {
        return console.error(err);
      }
      if (user) {
        console.log('register failed, already exist');
        socket.emit('register failed', {name: 'Already exist'});
      } else {
        let newUser = new User(Object.assign({}, data, {friends: [], requested_friends: []}));
        newUser.save(function (err, createdUser) {
          if (err) {
            return console.error(err);
          }
          console.log('register success');
          socket.emit('register success', createdUser);
        });
      }
    });
  });

  socket.on('request friend', function (data) {
    User.findOne({name: data.query}, function (err, user) {
      if (err) {
        return console.error(err);
      }
      if (user && lodash.findIndex(user.requested_friends, {name: data.user.name})) {
        user.requested_friends.push({name: data.user.name});
        user.save();
      }
    });
  });

  socket.on('accept friend request', function (data) {
    User.findOne({name: data.user.name}, function (err, user) {
      if (err) {
        return console.error(err);
      }
      if (user) {
        User.findOne({name: data.query}, function (err, targetUser) {
          if (err) {
            return console.error(err);
          }
          if (targetUser) {
            targetUser.friends.push({name: user.name});
            targetUser.save(function (err, newTargetUser) {
              if (err) {
                return console.error(err);
              }
              if (newTargetUser) {
                user.friends.push({name: newTargetUser.name});
                user.requested_friends = user.requested_friends.filter(function (item) {
                  return item.name !== newTargetUser.name;
                });
                user.save(function (err, newUser) {
                  if (err) {
                    return console.error(err);
                  }
                  socket.emit('update user', newUser);
                });
              }
            });
          }
        });
      }
    });
  });

  socket.on('friends search', function (data) {
    User.findOne({name: data.user.name}, function (err, user) {
      if (err) {
        return console.error(err);
      }
      User.find({name: new RegExp(`.*${data.query}.*`)}, function (err, res) {
        if (err) {
          return console.error(err);
        }
        socket.emit('friends search result', res.filter(function (item) {
          return item.name !== data.user.name && lodash.findIndex(user.friends, {name: item.name}) === -1;
        }));
      })
    });
  });

  socket.on('get image config', function (data) {
    Room.findOne({name: data.query}, function(err, room) {
      if (err) {
        return console.error(err);
      }
      io.emit('image config', {name: room.name, pieces: room.pieces});
    });
  });

  socket.on('reset image config', function (data) {
    Room.findOne({name: data.query}, function(err, room) {
      if (err) {
        return console.error(err);
      }
      room.pieces = shuffle(initState);
      room.save(function(err, newRoom) {
        if (err) {
          return console.error(err);
        }
        io.emit('image config', {name: newRoom.name, pieces: newRoom.pieces});
      });
    });
  });

  socket.on('update image config', function (data) {
    Room.findOne({name: data.query}, function(err, room) {
      if (err) {
        return console.error(err);
      }
      room.pieces = room.pieces.map(function(item) {
        if (item.x === data.piece.x && item.y === data.piece.y) {
          return data.piece;
        }
        return item;
      });
      room.save(function(err, newRoom) {
        if (err) {
          return console.error(err);
        }
        io.emit('image config', {name: newRoom.name, pieces: newRoom.pieces});
      });
    });
  });

  ss(socket).on('create room', function (stream, data) {
    console.log(data.name);
    stream.pipe(fs.createWriteStream(`./images/${data.name}.${data.extension}`));
    let room = new Room({
      name: data.name,
      owner: {name: data.user.name},
      participants: [],
      ready: false,
      pieces: shuffle(initState)
    });
    room.save(function(err, room) {
      if (err) {
        return console.error(err);
      }
      if (room) {
        socket.emit('create room success', {name: data.name.replace(' ', '_')});
      }
    });
  });

  socket.on('get rooms', function(data) {
    Room.find({$or: [{owner: {name: data.user.name}}, {participants: {name: data.user.name}}]}, function(err, res) {
      if (err) {
        return console.error(err);
      }
      socket.emit('rooms list', res);
    });
  });

  socket.on('do i owner', function(data) {
    Room.findOne({name: data.query}, function(err, room) {
      if (err) {
        return console.error(err);
      }
      if (room.owner.name === data.user.name) {
        socket.emit('yes, you are owner');
      }
    });
  });

  socket.on('get participants', function(data) {
    Room.findOne({name: data.query}, function(err, room) {
      if (err) {
        return console.error(err);
      }
      socket.emit('participants list', room.participants);
    });
  });

  socket.on('add participant', function(data) {
    Room.findOne({name: data.query}, function(err, room) {
      if (err) {
        return console.error(err);
      }
      room.participants.push({name: data.name});
      room.save(function(err, newRoom) {
        if (err) {
          return console.error(err);
        }
        socket.emit('participants list', newRoom.participants);
      });
    });
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
