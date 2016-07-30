import { Store, action, child } from 'flax';
import Bookmarks from './Bookmarks';
import Connections from './Connections';
import Queue from './Queue';
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
  @child(new Queue()) queue;

  constructor() {
    super();

    // Update transfer queue when the Queue view is selected
    this.subscribe(event => {
      if (event.store === this && event.action.type === 'setView') {
        this.queue.poll(event.action.payload[0] === 'queue');
      }
    });
  }

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

  enqueueTransfer(connection, path) {
    const body = new FormData();
    body.append('bookmark_id', connection.bookmarkId);
    body.append('path', path);

    sync.post('/downloads', body)
      .then(response => this.queue.fetch());
  }

  cancelTransfer(transfer) {
    const body = new FormData();
    body.append('transfer_id', transfer.id);

    sync.del('/downloads', body)
      .then(response => this.queue.fetch());
  }

  retryTransfer(transfer) {
    const body = new FormData();
    body.append('transfer_id', transfer.id);

    sync.post('/downloads/retry', body)
      .then(response => this.queue.fetch());
  }
}
