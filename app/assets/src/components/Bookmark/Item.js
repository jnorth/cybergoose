import React from 'react';
import { dom } from 'domb';

const { div, button } = dom(React, 'div', 'button');

export default ({ bookmark, onActivate, onDelete }) => {
  const host = bookmark.port === 22
    ? bookmark.host
    : `${bookmark.host}:${bookmark.port}`;

  return div({
    className: 'bookmark',
    onClick: onActivate,
    content: [
      div({
        className: 'bookmark-name',
        children: bookmark.name,
      }),

      div({
        className: 'bookmark-host',
        children: host,
      }),

      button({
        className: 'bookmark-remove',
        content: '\u2715',
        onClick: onDelete,
      }),
    ],
  });
}
