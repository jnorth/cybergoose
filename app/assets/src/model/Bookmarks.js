import sync from './sync';
import { Store, action } from 'flax';
import 'fetch';

export default class Application extends Store {
  initialState = [];

  @action add(bookmark) {
    if (this.getBookmarkById(bookmark.id)) {
      return this.state;
    }

    return [ ...this.state, bookmark ];
  }

  @action remove(id) {
    return this.state.filter((bookmark) => {
      return bookmark.id !== id;
    });
  }

  getBookmarkById(id) {
    return this.state.find((bookmark) => {
      return bookmark.id === id;
    });
  }

  create(bookmark) {
    sync.addBookmark(bookmark);
    this.fetch();
  }

  delete(id) {
    // Update local state
    const bookmark = this.getBookmarkById(id);
    this.remove(id);

    // Build query params
    const body = new FormData();
    body.append('id', id);

    // Update remote state
    sync.del('/bookmarks', body)
      .catch(error => this.add(bookmark));
  }

  fetch() {
    sync.bookmarks().then((bookmarks) => {
      bookmarks.forEach(bookmark => this.add(bookmark));
    });
  }
}
