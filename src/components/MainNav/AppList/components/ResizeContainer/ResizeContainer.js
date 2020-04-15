/**
 * AppList -> ResizeContainer
 */

import React, { useEffect, useState, useRef, createRef } from 'react';
import get from 'lodash/get';
import classnames from 'classnames';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import css from './ResizeContainer.css';

const ResizeContainer = ({ className, children, hideAllWidth, offset, items: allItems, selectedApp }) => {
  const wrapperRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [hiddenItems, setHiddenItems] = useState([]);
  const [cachedItemWidths, setCachedItemWidths] = useState({});

  // Assign a ref for each item on mount
  const [refs] = useState(() => allItems.reduce((acc, app) => {
    return Object.assign(acc, { [app.id]: createRef(null) });
  }, {}));

  // Cache menu item widths on mount since they won't change unless the MainNav is re-mounted
  // Remounting will happen when the locale is changed and the item widths will update accordingly
  useEffect(() => {
    setCachedItemWidths(Object.keys(refs).reduce((acc, id) => Object.assign(acc, { [id]: get(refs, `${id}.current.clientWidth`) }), {}));
  }, [refs]);

  useEffect(() => {
    // Determine hidden items on mount and resize
    const updateHiddenItems = debounce(() => {
      const shouldHideAll = window.innerWidth <= hideAllWidth;
      const wrapperEl = wrapperRef.current;

      if (wrapperEl) {
        const wrapperWidth = wrapperEl.clientWidth;

        const newHiddenItems =
        // Set all items as hidden
        shouldHideAll ? Object.keys(refs) :

        // Find items that should be hidden
          Object.keys(refs).reduce((acc, id) => {
            const itemWidth = cachedItemWidths[id];
            const shouldBeHidden = (itemWidth + acc.accWidth + offset) > wrapperWidth;
            const hidden = shouldBeHidden ? acc.hidden.concat(id) : acc.hidden;

            return {
              hidden,
              accWidth: acc.accWidth + itemWidth,
            };
          }, {
            hidden: [],
            accWidth: 0,
          }).hidden;

        if (!isEqual(newHiddenItems, hiddenItems)) {
          setHiddenItems(newHiddenItems);
        }

        // We are hiding the content until we are finished setting hidden items (if any)
        // Setting ready will make the contents visible for the user
        if (!ready) {
          setReady(true);
        }
      }
    }, 150);

    // Determine hidden items
    updateHiddenItems();

    // On resize
    window.addEventListener('resize', updateHiddenItems, true);

    // Clean up
    return () => {
      window.removeEventListener('resize', updateHiddenItems, true);
    };
  }, [cachedItemWidths, hideAllWidth, offset, ready, refs, selectedApp, hiddenItems]);

  return (
    <div
      ref={wrapperRef}
      className={classnames(css.resizeContainerWrapper, { [css.ready]: ready }, className)}
      data-test-resize-container
    >
      <div className={css.resizeContainerInner}>
        {children({
          hiddenItems,
          itemWidths: cachedItemWidths,
          ready,
          refs
        })}
      </div>
    </div>
  );
};

ResizeContainer.propTypes = {
  children: PropTypes.func,
  className: PropTypes.string,
  hideAllWidth: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.object),
  offset: PropTypes.number,
  selectedApp: PropTypes.object
};

ResizeContainer.defaultProps = {
  offset: 200,
};

export default ResizeContainer;
