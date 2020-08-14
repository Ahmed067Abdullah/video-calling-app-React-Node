import React from 'react';
import classes from './Video.module.css';

const Video = ({ stream, myVideo, partnerVideo, callAccepted }) => {
  let partnerVideoJSX;
  let myVideoJSX;
  let myVideoClassname = '';

  if (callAccepted) {
    partnerVideoJSX = <video playsInline ref={partnerVideo} autoPlay />;
    myVideoClassname = classes['mini-video'];
  }

  if (stream) {
    myVideoJSX = <video className={myVideoClassname} playsInline muted ref={myVideo} autoPlay />;
  }

  return (
    <div className={classes['video-container']}>
      <div>
        {myVideoJSX}
        {partnerVideoJSX}
      </div>
    </div>
  );
};

export default Video;
