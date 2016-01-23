import DOM from '../dom';
import Tab from './Tab';

import setView from '../../model/actions/setView';
import setConnection from '../../model/actions/setConnection';

export default function render({ view, connection, connections }) {
  const connectionIndex = connection;

  const { nav } = DOM;
  const tab = DOM.factory(Tab);

  return nav({
    className: 'tabbar',
    children: [
      tab({
        key: 'bookmarks',
        label: '+',
        classes: 'tab-bookmarks',
        active: view === 'bookmarks',
        handler: (event) => {
          setView('bookmarks');
        },
      }),

      ...connections.map((connection, index) => tab({
        key: `${connection.bookmark_id}:${index}`,
        label: connection.name,
        active: view === 'connection' && connectionIndex === index,
        handler: (event) => {
          setView('connection');
          setConnection(index);
        },
      })),
    ],
  });
}
