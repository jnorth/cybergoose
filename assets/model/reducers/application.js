import Bookmarks from './bookmarks';
import Connections from './connections';

export default function reducer(state, action) {
  if (state === undefined) {
    state = {
      // The current view.
      // bookmarks, bookmarks-form, connection
      view: 'bookmarks',

      connection: null,

      bookmarks: Bookmarks(state, action),
      connections: Connections(state, action),
    };
  }

  switch (action.type) {
    case 'VIEW_SET':
      return { ...state, view: action.view };

    case 'CONNECTION_SET':
      return { ...state, connection: action.connection };

    case 'CONNECTION_ADD':
    case 'CONNECTION_REMOVE':
    case 'CONNECTION_SET_LISTING':
      return { ...state, connections: Connections(state.connections, action) };

    case 'BOOKMARK_ADD':
      return { ...state, bookmarks: Bookmarks(state.bookmarks, action) };

    default:
      return state;
  }
};
