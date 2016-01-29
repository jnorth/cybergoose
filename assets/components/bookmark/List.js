import React from 'react';
import { dom } from 'domb';
import BookmarkItem from './Item';
import AddButton from './AddButton';

const div = dom(React, 'div');
const bookmarkItem = dom(React, BookmarkItem);
const addButton = dom(React, AddButton);

export default ({ app }) => {
  return div({
    className: 'bookmarks-list',
    children: [

      // Bookmarks
      ...app.bookmarks.state.map((bookmark) => {
        return bookmarkItem({
          key: bookmark.id,
          bookmark,
          onClick: (event) => {
            app.connect(bookmark);
          },
        });
      }),

      // Add bookmark button
      addButton({
        key: 'bookmark-add',
      }),

    ],
  });
}
