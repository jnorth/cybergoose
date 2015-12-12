import React from 'react';

export default class Toolbar extends React.Component {
  onClick(event) {
    this.props.app.dispatch({
      type: 'TOOLBAR_SELECT',
      toolbar: event.target.innerHTML,
    })

    console.log(event, this.props);
  }

  render() {
    return React.createElement('nav', {className:'toolbar'}, [
      React.createElement('button', {
        key:'queue',
        onClick: this.onClick.bind(this),
        style: {
          background: this.props.model.toolbar === 'Queue' ? 'red' : 'initial'
        }
      }, 'Queue'),

      React.createElement('button', {
        key:'files',
        onClick: this.onClick.bind(this),
        style: {
          background: this.props.model.toolbar === 'Files' ? 'red' : 'initial'
        }
      }, 'Files'),
    ]);
  }
}
