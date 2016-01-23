import React from 'react';
import DOM from '../dom';

import setView from '../../model/actions/setView';

export default class BookmarkHeader extends React.Component {
  render() {
    const { div } = DOM;

    return div({
      className: 'bookmark-header',
      content: [
        div({
          className: 'bookmark-header-title',
          content: 'Bookmarks',
        }),

        div({
          className: 'bookmark-header-add',
          content: '+',
          onClick: (event) => {
            setView('bookmarks-form');
          },
        }),
      ],
    });
  }
}
