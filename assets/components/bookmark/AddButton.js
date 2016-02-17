import React from 'react';
import { dom } from 'domb';
import BookmarkItem from './Item';

const div = dom(React, 'div');
const button = dom(React, 'button');

export default function AddButton({ action }) {
  return div({
    className: 'bookmark-add',
    content: button({
      content: 'Add Bookmark',
      onClick: action,
    }),
  });
};
