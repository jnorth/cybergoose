import React from 'react';
import ReactDOM from 'react-dom';

import sync from './model/sync';
import { state, subscribe } from './model/store';

import ApplicationView from './components/Application/element';

// Track state history
subscribe(() => {
  console.log('STATE:', state());
});

// Initial Sync
sync.bookmarks();

// Render
subscribe(() => {
  ReactDOM.render(
    React.createElement(ApplicationView, { state:state() }),
    document.querySelector('main')
  );
});
