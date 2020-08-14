import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import classes from './Video.module.css';

const Video = ({ stream, myVideo, partnerVideo, callAccepted, endCallHandler }) => {
  let partnerVideoJSX;
  let myVideoJSX;
  let myVideoClassname = '';
  let endCallBtn;

  if (callAccepted) {
    partnerVideoJSX = <video playsInline ref={partnerVideo} autoPlay />;
    myVideoClassname = classes['mini-video'];
    endCallBtn = <div className={classes['end-call-btn-container']} onClick={endCallHandler}>
      <div className={classes['end-call-btn']}>
        <FontAwesomeIcon icon={faPhone} />
      </div>
    </div>;
  }

  if (stream) {
    myVideoJSX = <video className={myVideoClassname} playsInline muted ref={myVideo} autoPlay />;
  }

  return (
    <div className={classes['video-container']}>
      <div>
        {myVideoJSX}
        {partnerVideoJSX}
        {endCallBtn}
      </div>
    </div>
  );
};

export default Video;
