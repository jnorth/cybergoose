import React from 'react';
import { dom, elif } from 'domb';

import Tabbar from '../Tabbar/element';
import BookmarkList from '../Bookmark/List';
import BookmarkForm from '../Bookmark/Form';
import Listing from '../Listing/element';

const activeConnection = (app) => {
  if (app.state.view !== 'connection') {
    return;
  }

  return app.connections.state[app.state.connection];
};

export default ({ app }) => {
  // State
  const { view } = app.state;
  const bookmarks = app.bookmarks;
  const connection = activeConnection(app);

  // Elements
  const div = dom(React, 'div');
  const tabbar = dom(React, Tabbar);
  const bookmarkList = elif(view === 'bookmarks', dom(React, BookmarkList));
  const bookmarkForm = elif(view === 'bookmarks-form', dom(React, BookmarkForm));
  const connectionView = elif(view === 'connection', dom(React, Listing));

  return div({
    className: `view-${view}`,
    content: [
      tabbar({ app }),
      bookmarkList({ app }),
      bookmarkForm({ app }),
      connectionView({ connection }),
    ],
  });
}
