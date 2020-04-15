const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('/', function(req, res) {
    res.render('lobby', { gtag: process.env.GTAG });
});

app.get('/game/:gameId', function(req, res) {
    res.render('index', { gtag: process.env.GTAG });
});

io.on('connection', function(socket){
    socket.on('played', function(game) {
        const gameId = Object.keys(socket.rooms).find(room => room != socket.id);
        if (gameId) {
            socket.broadcast.to(gameId).emit('game', game);
        }
    });

    socket.on('sendGame', function(socketId, game) {
        socket.to(socketId).emit('game', game);
    });

    socket.on('join', function(gameId) {
        socket.join(gameId, () => {
            const players = Object.keys(io.sockets.adapter.rooms[gameId].sockets);

            if (players.length > 1) {
                const anotherPlayer = players.find(player => player != socket.id);
                // there are others in the room; request the game from one
                // include the socket's id so we know where to send the game to
                socket.to(anotherPlayer).emit('getGame', socket.id);
            }
        });
    });
});

const port = process.env.PORT || 9090;
http.listen(port, function() {
    console.log(`listening on *:${port}`);
});