import React from 'react';
import { dom } from 'domb';

const div = dom(React, 'div');

export default ({ bookmark, onClick }) => {
  const host = bookmark.port === 22
    ? bookmark.host
    : `${bookmark.host}:${bookmark.port}`;

  return div({
    className: 'bookmark',
    onClick,
    content: [
      div({
        className: 'bookmark-name',
        children: bookmark.name,
      }),

      div({
        className: 'bookmark-host',
        children: host,
      }),
    ],
  });
}
