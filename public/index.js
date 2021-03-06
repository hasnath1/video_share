const socket = io("/");
const p = new Peer();
let myVideoStream;
let myId;
var videoGrid = document.getElementById("videoDiv");
var myvideo = document.createElement("video");
myvideo.muted = true;
const peerConnections = {};
navigator.mediaDevices
  .getUserMedia({
    // video: true,
    audio: true,
  })

  .then(stream => {
    myVideoStream = stream;
    addVideo(myvideo, stream);
    p.on("call", call => {
      call.answer(stream);
      const vid = document.createElement("video");

      call.on("stream", userStream => {
        addVideo(vid, userStream);
      });

      call.on("error", err => {
        alert(err);
      });

      call.on("close", () => {
        console.log(vid);
        vid.remove();
      });

      peerConnections[call.peer] = call;
    });
  })
  .catch(err => {
    alert(err.message);
  });

p.on("open", id => {
  myId = id;
  socket.emit("newUser", id, roomID);
});

p.on("error", err => {
  alert(err.type);
});

socket.on("userJoined", id => {
  console.log("new user joined");
  const call = p.call(id, myVideoStream);
  const vid = document.createElement("video");
  call.on("error", err => {
    alert(err);
  });
  call.on("stream", userStream => {
    addVideo(vid, userStream);
  });
  call.on("close", () => {
    vid.remove();
    console.log("user disconect");
  });
  peerConnections[id] = call;
});
socket.on("userDisconnect", id => {
  if (peerConnections[id]) {
    peerConnections[id].close();
  }
});
function addVideo(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
