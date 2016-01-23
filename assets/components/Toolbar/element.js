import React from 'react';

import DOM from '../dom';
import ToolbarButton from '../ToolbarButton/element';

export default class Toolbar extends React.Component {
  onClick(event) {
    this.props.model.dispatch({
      type: 'TOOLBAR_SELECT',
      toolbar: event.target.innerHTML,
    });
  }

  render() {
    const { toolbar, connections } = this.props.state;

    const { nav } = DOM;
    const toolbarButton = DOM.factory(ToolbarButton);

    return nav({
      className: 'toolbar',
      children: [
        toolbarButton({
          key: 'bookmarks',
          label: '+',
          active: toolbar === 'bookmarks',
          handler: this.onClick.bind(this),
        }),

        connections.map((connection) => {
          return toolbarButton({
            key: connection.id,
            label: connection.name,
            active: toolbar === connection.id,
            handler: this.onClick.bind(this),
          });
        }),

        toolbarButton({
          key: 'queue',
          label: 'Queue',
          active: toolbar === 'queue',
          handler: this.onClick.bind(this),
        }),
      ],
    });
  }
}
