import DOM from '../dom';
import BookmarkItem from './Item';

import connect from '../../model/actions/connect';

export default ({ bookmarks }) => {
  const { div } = DOM;
  const bookmarkItem = DOM.factory(BookmarkItem);

  return div({
    className: 'bookmarks-list',
    children: bookmarks.map((bookmark) => {
      return bookmarkItem({
        key: bookmark.id,
        bookmark,
        onClick: (event) => {
          connect(bookmark);
        },
      });
    }),
  });
}
