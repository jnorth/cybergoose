import React from 'react';
import DOM from '../dom';
import BookmarkHeader from './Header';
import BookmarkList from './List';
import BookmarkForm from './Form';

export default class BookmarkPage extends React.Component {
  render() {
    const { bookmarks, view } = this.props.state;

    const { section, div } = DOM;
    const bookmarkHeader = DOM.factory(BookmarkHeader);
    const bookmarkList = DOM.factory(BookmarkList);
    const bookmarkForm = DOM.factory(BookmarkForm);

    let content;

    if (view === 'bookmarks') {
      content = bookmarkList({
        bookmarks,
      });
    }

    if (view === 'bookmarks-form') {
      content = bookmarkForm();
    }

    return section({
      className: 'bookmarks',
      content: [
        // bookmarkHeader(),
        content,
      ],
    });
  }
}
