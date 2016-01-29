import React from 'react';
import { dom } from 'domb';
import BookmarkItem from './Item';

const div = dom(React, 'div');
const button = dom(React, 'button');

export default function AddButton() {
  return div({
    className: 'bookmark-add',
    content: button('Add Bookmark'),
  });
};
