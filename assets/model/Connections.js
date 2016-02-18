import { Store, action } from 'flax';
import sync from './sync';

export default class Connections extends Store {
  initialState = [];

  @action add(name, bookmarkId, initialPath) {
    return [
      ...this.state,
      { name, bookmarkId, path:initialPath },
    ];
  }

  @action remove(connectionIndex) {
    return this.state.filter((connection, index) => {
      return index !== connectionIndex;
    });
  }

  @action setListing(connectionIndex, listing, path) {
    return this.state.map((connection, index) => {
      return index === connectionIndex
        ? { ...connection, listing, path }
        : connection;
    });
  }

  getConnectionByIndex(index) {
    return this.state[index];
  }

  fetchListing(connectionIndex, path) {
    const body = new FormData();
    body.append('path', path);

    sync.post('/listing', body)
      .then((response) => {
        this.setListing(connectionIndex, response.listing, path);
      });
  }

  pathUp(connectionIndex) {
    const connection = this.state[connectionIndex];
    if (!connection) return;

    const lastIndex = connection.path.lastIndexOf('/');
    if (lastIndex === -1) return;

    const path = connection.path.substring(0, lastIndex);
    this.fetchListing(connectionIndex, path);
  }
}
