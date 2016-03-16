import React from 'react';
import { dom } from 'domb';
import classnames from 'classnames';

const div = dom(React, 'div');

const basename = (str) => {
  return str.substr(str.lastIndexOf('/') + 1);
};

export default function Queue({ queue }) {
  return div({
    className: 'queue',
    children: [

      ...queue.state.map(item => div({
        key: `queue-${item.id}`,
        className: classnames('queue-item', {
          'is-complete': item.completed,
          'is-fail': item.failed,
        }),
        content: [

          div({
            className: 'queue-item-label',
            content: basename(item.path) + ' ' + item.rate + '/s',
          }),

          div({
            className: 'queue-item-progress',
            style: { width: `${item.progress * 100}%` },
          }),

        ],
      })),

    ],
  });
}
