import DOM from '../dom';
import Tabbar from './Tabbar';
import BookmarkList from '../bookmark/List';
import Listing from '../Listing/element';

const activeConnection = (state) => {
  if (state.view !== 'connection') {
    return;
  }

  return state.connections[state.connection];
};

export default ({ state }) => {
  const { view, bookmarks, connection, connections } = state;

  const { div } = DOM;
  const tabbar = DOM.factory(Tabbar);
  const bookmarkList = DOM.factory(BookmarkList, view === 'bookmarks');
  const connectionView = DOM.factory(Listing, view === 'connection');

  return div({
    content: [
      tabbar({ view, connection, connections }),
      bookmarkList({ bookmarks }),
      connectionView({ connection: activeConnection(state) }),
    ],
  });
}
