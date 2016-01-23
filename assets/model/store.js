import { createStore } from 'redux';

import Application from './reducers/application';

export const store = createStore(Application);
export const dispatch = (...args) => {
  console.log('DISPATCH', ...args);
  store.dispatch(...args);
};
export const subscribe = store.subscribe;
export const state = store.getState;
