import React from 'react';
import ReactModal from 'react-modal';
import modalStyles from '../../common/modalStyles';
import classes from './IncomingCallModal.module.css';

const IncomingCallModal = ({ caller, open, handleAccept, handleReject }) => {
  return (
    <ReactModal
      isOpen={Boolean(open)}
      style={modalStyles}
    >
      {open === 1
        ? <div className={classes['content-container']}>
          <p className={classes.heading}>Calling...</p>
        </div>
        : <div className={classes['content-container']}>
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
        </div>}
    </ReactModal >
  );
};

export default IncomingCallModal;