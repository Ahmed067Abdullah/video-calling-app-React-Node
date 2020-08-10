import React, { useState } from 'react';
import ReactModal from 'react-modal';
import modalStyles from '../../common/modalStyles';
import classes from './IncomingCallModal.module.css';

const IncomingCallModal = ({ caller, open, handleAccept, handleReject }) => {
  return (
    <ReactModal
      isOpen={open}
      style={modalStyles}
    >
      <div className={classes['content-container']}>
        <p className={classes.heading}>{caller} is calling you...</p>
        <div className={classes['btns-container']}>
          <button
            className={`${classes.button} ${classes.danger}`}
            onClick={handleReject}>
            Reject
          </button>
          <button
            className={`${classes.button} ${classes.success}`}
            onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </ReactModal >
  );
};

export default IncomingCallModal;