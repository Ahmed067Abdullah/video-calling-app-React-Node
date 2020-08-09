import React from 'react';
import classes from './Video.module.css';

const Video = ({ stream, userVideo, partnerVideo, callAccepted }) => {
  let mainVideo;
  let miniVideo;
  
  if (stream) {
    mainVideo = <video playsInline muted ref={userVideo} autoPlay />;
  }

  if (callAccepted) {
    mainVideo = <video playsInline ref={partnerVideo} autoPlay />;
    miniVideo = <video className={classes['mini-video']} playsInline muted ref={userVideo} autoPlay />;
  }

  return (
    <div className={classes['video-container']}>
      <div>
        {mainVideo}
        {miniVideo}
      </div>
    </div>
  );
};

export default Video;
