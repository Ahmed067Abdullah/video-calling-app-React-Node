import React, { useEffect, useRef } from 'react';
import io from "socket.io-client";
import classes from './App.module.css';
import Users from './components/Users/Users';

const ENDPOINT = 'http://localhost:5000';

function App() {
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect(ENDPOINT);
  }, []);

  return (
    <div className={classes['container']}>
      <p className={classes['main-heading']}>Welcome to your video calling station</p>
      <div className={classes['content']}>
        <Users users={users} myId={myId} callUser={callPeer} />
        <div className={classes['video-container']}>
          {'videos'}
        </div>
      </div>
    </div>
  );
}

export default App;
