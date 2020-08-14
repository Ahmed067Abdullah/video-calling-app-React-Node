import React, { useEffect, useState, useRef } from 'react';
import classes from './App.module.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import Users from './components/Users/Users';
import Video from './components/Video/Video';
import RegisterUserModal from './components/RegisterUserModal/RegisterUserModal';
import IncomingCallModal from './components/IncomingCallModal/IncomingCallModal';

const ENDPOINT = 'http://localhost:5000';

function App() {
  const [name, setName] = useState("");
  const [showRegModal, setShowRegModal] = useState(true);
  const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const myVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect(ENDPOINT);
    // const naam = Math.random().toString();
    // socket.current.emit("user-registered", naam);
    // setName(naam);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    })

    socket.current.on("your-id", id => {
      setMyId(id);
    })
    socket.current.on("all-users", users => {
      setUsers(users);
    })

    socket.current.on("incoming-call", data => {
      setCaller(data.from);
      setCallerSignal(data.signal);
      setShowIncomingCallModal(true);
    })
  }, []);

  const callPeer = id => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("initiate-call", { userToCall: id, signalData: data, from: { name, id: myId } })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("call-accepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  const acceptCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("accept-call", { signal: data, to: caller.id })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });
    peer.signal(callerSignal);
  }

  return (
    <div className={classes['container']}>
      <p className={classes['main-heading']}>Welcome to your video calling station</p>
      <div className={classes['content']}>
        <Users
          myId={myId}
          users={users}
          callUser={callPeer} />
        <Video
          myVideo={myVideo}
          stream={stream}
          partnerVideo={partnerVideo}
          callAccepted={callAccepted} />
      </div>

      {showRegModal
        ? <RegisterUserModal
          open={showRegModal}
          handleClose={name => {
            socket.current.emit("user-registered", name)
            setName(name);
            setShowRegModal(false);
          }}
        />
        : null}

      {showIncomingCallModal
        ? <IncomingCallModal
          open={showIncomingCallModal}
          caller={caller.name}
          handleAccept={name => {
            setShowIncomingCallModal(false);
            acceptCall();
          }}
          handleReject={() => setShowIncomingCallModal(false)}
        />
        : null}
    </div>
  );
}

export default App;
