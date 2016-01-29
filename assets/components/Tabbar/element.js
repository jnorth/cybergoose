import React from 'react';
import { dom } from 'domb';
import Tab from './Tab';

const nav = dom(React, 'nav');
const tab = dom(React, Tab);

export default function render({ app }) {
  const connectionIndex = app.state.connection;

  return nav({
    className: 'tabbar',
    children: [

      // Bookmark tab
      tab({
        key: 'bookmarks',
        label: '+',
        classes: 'tab-bookmarks',
        active: app.state.view === 'bookmarks',
        handler: (event) => {
          app.setView('bookmarks');
        },
      }),

      // Connection tabs
      ...app.connections.state.map((connection, index) => tab({
        key: `${connection.bookmarkId}:${index}`,
        label: connection.name,
        active: app.state.view === 'connection' && connectionIndex === index,
        handler: (event) => {
          app.setView('connection');
          app.setConnection(index);
        },
      })),

    ],
  });
}
