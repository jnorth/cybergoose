import React from 'react';
import { dom, elif } from 'domb';

import Tabbar from '../Tabbar/element';
import BookmarkList from '../Bookmark/List';
import BookmarkForm from '../Bookmark/Form';
import Connection from '../Connection/Connection';
import Queue from '../Queue/Queue';

export default ({ app }) => {
  // State
  const { view } = app.state;
  const bookmarks = app.bookmarks;

  // Elements
  const div = dom(React, 'div');
  const tabbar = dom(React, Tabbar);
  const bookmarkList = elif(view === 'bookmarks', dom(React, BookmarkList));
  const bookmarkForm = elif(view === 'bookmarks-form', dom(React, BookmarkForm));
  const connectionView = elif(view === 'connection', dom(React, Connection));
  const queueView = elif(view === 'queue', dom(React, Queue));

  return div({
    className: `view-${view}`,
    content: [
      tabbar({ app }),
      bookmarkList({ app }),
      bookmarkForm({ app }),
      connectionView({ app }),
      queueView({ queue:app.queue }),
    ],
  });
}
