import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppIcon from '@folio/stripes-components/lib/AppIcon';
import { withRouter } from 'react-router-dom';
import css from './NavButton.css';

const propTypes = {
  href: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.element,
  ]),
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

const NavButton = withRouter(({ history, label, selected, onClick, href, icon }) => {
  /**
   * Root classes
   */
  const rootClasses = classNames(
    css.navButton,
    { [css.selected]: selected },
  );

  /**
   * Icon
   */
  const getIcon = () => (<span className={css.icon}>{icon || <AppIcon focusable={false} />}</span>);

  /**
   * On click
   */
  const clickEvent = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      history.push(href);
    }
  };

  return (
    <button className={rootClasses} onClick={clickEvent}>
      <span className={css.inner}>
        { getIcon() }
        { label && <span className={css.label}>{label}</span>}
      </span>
    </button>
  );
});

NavButton.propTypes = propTypes;

export default NavButton;
