import { Store, action } from 'flax';

export default class Connections extends Store {
  initialState = [];

  @action add(name, bookmarkId) {
    return [
      ...this.state,
      { name, bookmarkId },
    ];
  }

  @action remove(connectionIndex) {
    return this.state.filter((connection, index) => {
      return index !== connectionIndex;
    });
  }

  @action setListing(connectionIndex, listing) {
    return this.state.map((connection, index) => {
      return index === connectionIndex
        ? { ...connection, listing }
        : connection;
    });
  }
}
