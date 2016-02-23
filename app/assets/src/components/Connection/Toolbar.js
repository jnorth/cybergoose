import React from 'react';
import { dom } from 'domb';

const div = dom(React, 'div');
const button = dom(React, 'button');

function toolbarItem({ name, action }) {
  return button({
    className: 'listing-toolbar-item',
    onClick: action,
    content: name,
  })
}

export default function Toolbar({ path, closeAction, pathUpAction }) {
  return div({
    className: 'listing-toolbar',
    content: [

      div({
        className: 'listing-toolbar-pathbar',
        content: [
          button({
            className: 'listing-toolbar-path-up',
            content: 'Up',
            onClick: pathUpAction,
          }),

          div({
            className: 'listing-toolbar-path',
            content: path
          }),
        ],
      }),

      div({
        className: 'listing-toolbar-actions',
        content: [
          toolbarItem({
            name: 'Close',
            action: closeAction,
          }),
        ],
      }),

    ],
  })
}
