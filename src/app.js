import express from 'express';

import handlebars from 'express-handlebars';

import __dirname from './utils.js';

import viewsRouter from './routes/views.router.js';

import { Server } from 'socket.io';

const app = express();

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const io = new Server(server);

app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine','handlebars');

app.use('/', viewsRouter);

const log = [];

io.on('connection', socket => {
    console.log(`Connection established with socket ${socket.id}`);

    socket.broadcast.emit('ingreso');

    socket.on('message', data => {
        log.push(data);
        io.emit('log', log);
    });
});