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
  const peerRef = useRef();

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
      console.log('incoming call');
      setCaller(data.from);
      setCallerSignal(data.signal);
      setShowIncomingCallModal(true);
    })
  }, []);

  const callUserHandler = id => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    // When peer is live (step 1)
    peer.on("signal", data => {
      console.log('1');
      socket.current.emit("initiate-call", { userToCall: id, signalData: data, from: { name, id: myId } })
    })

    // When start recieving stream from the partner (step 3)
    peer.on("stream", stream => {
      console.log('2');
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    // When partner accepts the call (step 2)
    socket.current.on("call-accepted", signal => {
      console.log('3');
      setCallAccepted(true);
      peer.signal(signal);
      peerRef.current = peer;
    })

    peer.on('close', () => {
      setCallAccepted(false);
      peerRef.current = null;
    })
  }

  const acceptCallHandler = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    // Notify partner that stream is accepted (Step 2)
    peer.on("signal", data => {
      console.log('accept-call1')
      socket.current.emit("accept-call", { signal: data, to: caller.id })
    })

    // Accept stream from the partner (Step 1)
    peer.on("stream", stream => {
      console.log('accept-call2')
      partnerVideo.current.srcObject = stream;
      peerRef.current = peer;
    });

    peer.on('close', () => {
      setCallAccepted(false);
      peerRef.current = null;
    })

    peer.signal(callerSignal);
  }

  const endCallHandler = () => {
    peerRef.current.destroy();
  };

  return (
    <div className={classes['container']}>
      <p className={classes['main-heading']}>Welcome to your video calling station</p>
      <div className={classes['content']}>
        <Users
          myId={myId}
          users={users}
          callUserHandler={callUserHandler} />
        <Video
          myVideo={myVideo}
          stream={stream}
          partnerVideo={partnerVideo}
          callAccepted={callAccepted}
          endCallHandler={endCallHandler} />
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
            acceptCallHandler();
          }}
          handleReject={() => setShowIncomingCallModal(false)}
        />
        : null}
    </div>
  );
}

export default App;
