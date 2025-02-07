import express from 'express'
import http from 'http'
import createGame from './game.js'
import { Server } from 'socket.io'
import { randomInt } from 'crypto'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Permitir conexões do cliente
        methods: ["GET", "POST"] // Métodos permitidos
    }
});

app.use(express.static('public'))

const game = createGame()
game.removeAllSubscribe()
game.start(2000)

 
io.on('connection', (socket) => {
    console.log(socket.id)
    game.addPlayer({playerId: socket.id, playerX: Math.round(Math.random() * 9), playerY: Math.round(Math.random() * 9)})
    game.subscribe((command) => {
        console.log(`estou a funcao de obberver vou envar para o tudos os user ${socket.id} que esta :`)
        console.dir(command)
        socket.emit(command.type, command)
        console.log(`subscribe ${command.type} player: ${command.player}`)
    })

    socket.emit('setup', game.state)

    socket.on('move', (command) => {
        console.log(`get a move from : ${command.id}`)
        command.playerId = socket.id
        game.movePlayer(command)
    })

    socket.on('disconnect', () => {
        game.removePlayer({ playerId: socket.id })
        console.log(`> Player disconnected: ${socket.id}`)
    })
})



server.listen(3000, () => {
    console.log(`> server listening on port: 3000`)
})