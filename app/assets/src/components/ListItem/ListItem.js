import React from 'react';
import { dom, elif } from 'domb';
import classnames from 'classnames';

const div = dom(React, 'div');
const button = dom(React, 'button');

export default function ListItemView(props) {
  const item = props.item;
  const icon = elif(props.icon, div);
  const subtitle = elif(props.subtitle, div);
  const actions = elif(props.actions, div);
  const progress = elif(props.progress.length, div);

  return div({
    key: props.key,
    className: classnames('listitem', props.className),

    content: [

      icon({
        className: 'listitem-icon',
      }),

      div({
        className: 'listitem-details',
        content: [
          div({
            className: 'listitem-details-title',
            content: props.title,
          }),
          subtitle({
            className: 'listitem-details-subtitle',
            content: props.subtitle,
          }),
        ],
      }),

      actions({
        className: 'listitem-actions',
        content: props.actions.map(action => button({
          className: 'listitem-action',
          content: action.name,
          onClick: action.handler,
        })),
      }),

      progress({
        className: 'listitem-progress',
        content: props.progress.map((part, index) => div({
          className: 'listitem-progress-bar',
          style: {
            width: `${part.progress * 100 / props.progress.length}%`,
            left: `${index / props.progress.length * 100}%`,
          },
        })),
      }),

    ],
  });
}
