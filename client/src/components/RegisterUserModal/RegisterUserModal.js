import React, { useState } from 'react';
import ReactModal from 'react-modal';
import modalStyles from '../../common/modalStyles';
import classes from './RegisterUserModal.module.css';

const RegisterUserModal = ({ open, handleClose }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    if (trimmedUsername) handleClose(username);
  };

  return (
    <ReactModal
      isOpen={open}
      style={modalStyles}
    >
      <div className={classes['content-container']}>
        <p className={classes.heading}>Enter your username:</p>
        <form onSubmit={handleSubmit}>
          <input autoFocus className={classes.input} value={username} onChange={e => setUsername(e.target.value)} />
          <button className={classes.button} type="submit">Done</button>
        </form>
      </div>
    </ReactModal >
  );
};

export default RegisterUserModal;