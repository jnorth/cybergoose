import React from 'react';
import classnames from 'classnames';
import { dom } from 'domb';

const button = dom(React, 'button');

export default function render({ label, classes, active, handler }) {
  return button({
    content: label,
    className: classnames('tab', classes, {
      'is-active': active,
    }),

    // Only activate handler if the tab is not already active
    onClick: (event) => {
      if (!active) handler(event);
    },
  });
}
