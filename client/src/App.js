import React, { useEffect, useState, useRef } from 'react';
import classes from './App.module.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import Users from './components/Users/Users';
import Video from './components/Video/Video';
import RegisterUserModal from './components/RegisterUserModal/RegisterUserModal';
import CallingModal from './components/CallingModal/CallingModal';

function App() {
  const [name, setName] = useState("");
  const [showRegModal, setShowRegModal] = useState(true);
  const [showCallingModal, setShowCallingModal] = useState(0);
  const [myId, setMyId] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [inCallWith, setInCallWith] = useState("");
  const [callingTo, setCallingTo] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const myVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const peerRef = useRef();

  useEffect(() => {
    socket.current = io.connect();
    // const naam = Math.random().toString();
    // socket.current.emit("user-registered", naam);
    // setName(naam);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setStream(stream);
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      });

    socket.current.on("your-id", id => {
      setMyId(id);
    });

    socket.current.on("all-users", users => {
      setUsers(users);
    });

    // Step # 2: When peer recieves a call 
    socket.current.on("incoming-call", data => {
      setCaller(data.from);
      setCallerSignal(data.signal);
      setShowCallingModal(2);
    });

    socket.current.on('call-rejected', () => {
      setShowCallingModal(0);
    });

    socket.current.on('call-canceled', () => {
      setShowCallingModal(0);
    });

    socket.current.on('call-disconnected', endCall);
  }, []);

  const endCall = () => {
    setCallAccepted(false);
    setInCallWith(null);
    socket.current.off("call-accepted");
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    peerRef.current = null;
  }

  const callUserHandler = id => {
    if (inCallWith) {
      return;
    }
    setCallingTo(id);
    setShowCallingModal(1);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peerRef.current = peer;

    // Step # 1: When your peer is live and ready to start call
    peer.on("signal", data => {
      socket.current.emit("initiate-call", { userToCall: id, signalData: data, from: { name, id: myId } })
    });

    // Step # 6: Finally initaiter gets access to stream of partner
    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    // Step # 5: When initiater recieves ack that call is accepted
    socket.current.on("call-accepted", signal => {
      setCallAccepted(true);
      setShowCallingModal(0);
      peer.signal(signal);
      setInCallWith(id);
    });

    peer.on('close', endCall);

    peer.on("error", e => {
      console.log(e);
      endCall();
    });
  };

  const acceptCallHandler = () => {
    if (inCallWith) {
      socket.current.emit("disconnect-call", { inCallWith })
    }

    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peerRef.current = peer;

    // Step # 4:  Notify partner that stream is accepted
    peer.on("signal", data => {
      if (data.type === "answer") {
        socket.current.emit("accept-call", { signal: data, to: caller.id });
        setInCallWith(caller.id);
      }
    });

    // Step # 3: Access partners's stream
    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.on('close', endCall);

    peer.on("error", e => {
      console.log(e);
      endCall();
    });

    peer.signal(callerSignal);
  };

  return (
    <div className={classes['container']}>
      <p className={classes['main-heading']}>Welcome to your video calling station</p>
      <div className={classes['content']}>
        <Users
          myId={myId}
          users={users}
          userBusy={inCallWith}
          callUserHandler={callUserHandler} />
        <Video
          myVideo={myVideo}
          stream={stream}
          partnerVideo={partnerVideo}
          callAccepted={callAccepted}
          endCallHandler={endCall} />
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

      {showCallingModal
        ? <CallingModal
          open={showCallingModal}
          caller={caller.name}
          handleAccept={() => {
            setShowCallingModal(0);
            acceptCallHandler();
          }}
          handleReject={() => {
            setShowCallingModal(0);
            socket.current.emit("reject-call", { caller });
          }}
          handleCancel={() => {
            setShowCallingModal(0);
            peerRef.current.destroy();
            socket.current.emit('cancel-call', { callingTo })
          }}
        />
        : null}
    </div>
  );
}

export default App;
