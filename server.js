const express = require('express')
const path = require('path');
const { Socket } = require('socket.io')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid') /*從uuid模組中提取出v4方法到 uuidV4*/



// app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.post("/createroom", (req, res) => {
    const newRoomId = uuidV4()
    res.json({ redirectUrl: `/room/${newRoomId}` })
    console.log(req.body)
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

server.listen(3000, '0.0.0.0')