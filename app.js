const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;
let connectedUsers = [];

app.get('/', function(req, res){
res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  if (!connectedUsers.includes(socket.id)){
    connectedUsers.push(socket.id)
  }
  socket.emit('connectedUsers', connectedUsers)
  socket.on('disconnect', function(){
    console.log('user disconnected');
    console.log(socket.id);
    connectedUsers.filter(i => socket.id == i)
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
