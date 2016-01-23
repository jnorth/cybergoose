import React from 'react';
import classnames from 'classnames';
import DOM from '../dom';

export default class ToolbarButton extends React.Component {
  render() {
    const { label, active, handler } = this.props;
    const { button } = DOM;

    return button({
      onClick: handler,
      children: label,
      className: classnames('toolbar-button', {
        active: active,
      }),
    });
  }
}
