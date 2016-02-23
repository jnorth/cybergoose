import React from 'react';
import ReactDOM from 'react-dom';

import Application from './model/Application';
import ApplicationView from './components/Application/element';

const app = new Application();

app.subscribe((event) => {
  console.log(event);

  ReactDOM.render(
    React.createElement(ApplicationView, { app }),
    document.querySelector('main')
  );
});

app.bookmarks.fetch();
app.queue.fetch();
