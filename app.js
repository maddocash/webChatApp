const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;
let connectedUsers = [];

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.broadcast.emit('justConnected', socket.id);
  if (!connectedUsers.includes(socket.id)){
    connectedUsers.push(socket.id)
  }
  io.emit('connectedUsers', connectedUsers)
  socket.on('disconnect', function(){
    console.log('user disconnected');
    connectedUsers = connectedUsers.filter(i => socket.id !== i)
    socket.emit('connectedUsers', connectedUsers)
  });
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat message', msg);
  });
  socket.on('whoIsTyping', function(name){
    socket.broadcast.emit('whoIsTyping', name);
  });
});


http.listen(PORT, function(){
  console.log(`I'm listening on ${PORT}`);
})
