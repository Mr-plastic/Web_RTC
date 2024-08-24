const socket = io()
const videogrid = document.getElementById('video-grid')
const callBtn = document.getElementById('call')
const myPeer = new Peer(undefined,{
    host: '/',
    port:'9000',
    proxied: true,
})
const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}
navigator.mediaDevices.getUserMedia({   
    video: true,
    audio: true
}).then(stream =>{
    addVideoStream(myVideo,stream)
    myPeer.on('call',call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
        call.on('error', err=> {
            console.log('Call failed',err);
        })
    })

    socket.on('user-connected', userId =>{
        console.log(userId)
        connectToNewUser(userId,stream)
    })
})

socket.on('user-disconnected', userId =>{
    if(peers[userId]) peers[userId].close()
})

myPeer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream){
    console.log("视频轨道数量:", stream.getVideoTracks().length);
    console.log("音频轨道数量:", stream.getAudioTracks().length);
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    // console.log("正在連接新用戶")
    call.on('stream', userVideoStream =>{
        console.log("正在連接新用戶")
        addVideoStream(video, userVideoStream)
    })
    call.on('close',() =>{
        video.remove()
    })
    peers[userId] = call
}

function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () =>{
        video.play()
    })
    videogrid.append(video)
}

// callBtn.addEventListener('click',);

