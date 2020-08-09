import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import classes from './Users.module.css';

const Users = ({ users, myId, callUser }) => {

  const usersToShow = Object.keys(users).filter(id => id !== myId);
  return (
    <div className={classes['users-container']}>
      <p className={classes['sub-heading']}>Online users</p>
      <div className={classes['users-list']}>
        {usersToShow.length
          ?usersToShow.map(key => {
          return (
            <div onClick={() => callUser(key)}>
              <span className={classes["user-name"]}>{users[key].name}</span>
              <div className={classes["call-icon"]}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
            </div>
          );
        })
        : <p className={classes['empty-state-text']}>No online users found</p>}
      </div>
    </div>
  );
};

export default Users;
