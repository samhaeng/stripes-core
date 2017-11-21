import React from 'react';
import PropTypes from 'prop-types';
import NavButton from '../NavButton';
import css from './NotificationMenu.css';

const NotificationsButton = (props) => {
  const { notificationCount, ...inputProps } = props;
  let notificationsBadge;
  if (notificationCount && notificationCount > 0) {
    notificationsBadge = <span className={css.notificationsBadgeWrapper}><span className={css.notificationsBadge}>{notificationCount > 9 ? '9+' : notificationCount}</span></span>;
  }
  return (
    <NavButton {...inputProps}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false">
        <path fill="#999" d="M11.8 23.3c-1.8 0-3.3-1.1-3.7-2.7 -3.2-0.3-6.6-1.1-6.6-3 0-0.9 0.8-2.2 2.3-2.9C3.9 9.8 6 5.7 9.1 4V3.5c0-1.6 1.3-2.9 2.9-2.9s2.9 1.3 2.9 2.9v0.6c3.1 1.7 5.2 5.8 5.3 10.6 1.4 0.7 2.3 2.1 2.3 2.9 0 2-3.7 2.8-7.1 3.1C15 22.2 13.5 23.3 11.8 23.3zM10 19.9c0 0.8 0.8 1.4 1.8 1.4 1 0 1.7-0.6 1.8-1.4 0 0 0 0 0-0.1 0-0.3 0.1-0.5 0.2-0.7 0.2-0.2 0.4-0.3 0.7-0.3 3.6-0.2 5.5-0.9 6-1.2 -0.2-0.3-0.7-1-1.5-1.2 -0.5-0.1-0.8-0.6-0.7-1.1 0 0 0 0 0 0 0-4.5-2-8.5-4.7-9.6 -0.4-0.2-0.6-0.5-0.6-0.9v-1.2c0-0.5-0.4-0.9-0.9-0.9s-0.9 0.4-0.9 0.9V4.7c0 0.4-0.2 0.8-0.6 0.9C7.7 6.7 5.8 10.7 5.7 15.2c0.1 0.5-0.2 0.9-0.7 1.1 -0.8 0.2-1.3 0.8-1.5 1.2 0.5 0.3 2.2 1 5.5 1.2 0.5 0 0.9 0.5 0.9 1C10 19.8 10 19.8 10 19.9z" />
      </svg>{notificationsBadge}
    </NavButton>
  );
};

NotificationsButton.propTypes = {
  notificationCount: PropTypes.number,
};

export default NotificationsButton;
