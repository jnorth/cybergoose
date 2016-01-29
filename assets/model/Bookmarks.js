import sync from './sync';
import { Store, action } from 'flax';

export default class Application extends Store {
  initialState = [];

  @action add(bookmark) {
    return [ ...this.state, bookmark ];
  }

  fetch() {
    sync.bookmarks().then((bookmarks) => {
      bookmarks.forEach(bookmark => this.add(bookmark));
    });
  }
}
