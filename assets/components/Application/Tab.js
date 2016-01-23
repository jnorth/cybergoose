import classnames from 'classnames';

import DOM from '../dom';

export default function render(props) {
  const { label, active, handler, classes } = props;

  const { button } = DOM;

  return button({
    content: label,
    className: classnames('tab', classes, {
      'is-active': active,
    }),

    // Only activate handler if the tab is not already active
    onClick: (event) => {
      if (!active) handler(event);
    },
  });
}
