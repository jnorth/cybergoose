import { Store, action, child } from 'flax';
import Bookmarks from './Bookmarks';
import Connections from './Connections';
import sync from './sync';

export default class Application extends Store {
  initialState = {
    // The current view
    // bookmarks, bookmarks-form, connection
    view: 'bookmarks',

    // The current connection index
    connection: null,
  };

  @child(new Bookmarks()) bookmarks;
  @child(new Connections()) connections;

  @action setView(view) {
    return { ...this.state, view };
  }

  @action setConnection(connection) {
    return { ...this.state, connection };
  }

  getActiveConnection() {
    return this.connections.getConnectionByIndex(this.state.connection);
  }

  connect(bookmark) {
    // Add new connection
    this.connections.add(bookmark.name, bookmark.id, bookmark.path);
    const connectionId = this.connections.state.length - 1;

    // Switch to new connection
    this.setView('connection');
    this.setConnection(connectionId);

    // Sync
    sync.connect(bookmark).then((response) => {
      this.connections.fetchListing(connectionId, bookmark.path);
    });
  }

  disconnect() {
    this.setView('bookmarks');
    this.connections.remove(this.state.connection);
  }
}
