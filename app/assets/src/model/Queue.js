import sync from './sync';
import { Store, action } from 'flax';
import 'fetch';

export default class Queue extends Store {
  initialState = [];

  @action updateAll(items) {
    return items;
  }

  @action remove(id) {
    return this.state.filter((item) => {
      return item.id !== id;
    });
  }

  getById(id) {
    return this.state.find((item) => {
      return item.id === id;
    });
  }

  fetch() {
    return sync.get('/downloads').then((response) => {
      this.updateAll(response.queue);
    });
  }

  poll(start) {
    this.updatingQueue = false;

    if (start) {
      this.timer = setInterval(this.updateQueue.bind(this), 1000);
    } else {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  updateQueue() {
    if (this.updatingQueue) return;
    this.updatingQueue = true;

    this.fetch().then(() => {
      this.updatingQueue = false;
    });
  }
}
