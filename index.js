const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(function(req, res, next) {
    if(process.env.NODE_ENV == 'production' && req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.get('Host')}${req.url}`);
    }
    next();
});

app.get('/', function(req, res) {
    res.render('lobby', { gtag: process.env.GTAG });
});

app.get('/game/:gameId', function(req, res) {
    res.render('index', { gtag: process.env.GTAG });
});

io.on('connection', function(socket) {
    function getGameId() {
        return Object.keys(socket.rooms).find(room => room != socket.id);
    }

    socket.on('sendGameChanges', function(updates, fullGameUpdate) {
        const gameId = getGameId();
        if (gameId) {
            socket.nsp.to(gameId).emit('updateGame', updates, fullGameUpdate);
        }
    });

    socket.on('sendUpdatedPlayer', function(playerId, updates) {
        const gameId = getGameId();
        if (gameId) {
            socket.nsp.to(gameId).emit('updatePlayer', playerId, updates);
        }
    });

    socket.on('sendGame', function(socketId, game) {
        socket.to(socketId).emit('updateGame', game);
    });

    socket.on('join', function(gameId) {
        socket.join(gameId, () => {
            socket._gameId = gameId;
            const players = Object.keys(io.sockets.adapter.rooms[gameId].sockets);

            if (players.length > 1) {
                const anotherPlayer = players.find(player => player != socket.id);
                // there are others in the room; request the game from one
                // include the socket's id so we know where to send the game to
                socket.to(anotherPlayer).emit('requestGame', socket.id);
            }
        });
    });

    socket.on('disconnect', function() {
        socket.to(socket._gameId).emit('left', socket.id);
    });
});

const port = process.env.PORT || 9090;
http.listen(port, function() {
    console.log(`listening on *:${port}`);
});