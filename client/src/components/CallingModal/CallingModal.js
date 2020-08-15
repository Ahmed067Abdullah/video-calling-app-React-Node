import React from 'react';
import ReactModal from 'react-modal';
import modalStyles from '../../common/modalStyles';
import classes from './CallingModal.module.css';

const CallingModal = ({ caller, open, handleAccept, handleReject, handleCancel }) => {
  return (
    <ReactModal
      isOpen={Boolean(open)}
      ariaHideApp={false}
      style={modalStyles}
    >
      {open === 1
        ? <div className={classes['content-container']}>
          <p className={classes.heading}>Calling...</p>
          <div className={classes['btns-container']}>
            <button
              className={`${classes.button} ${classes.danger}`}
              onClick={handleCancel}>
              Cancel
              </button>
          </div>
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

export default CallingModal;