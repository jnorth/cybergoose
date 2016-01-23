import DOM from '../dom';

export default (props) => {
  const { bookmark, onClick } = props;

  const { div } = DOM;

  const host = bookmark.port === 22
    ? bookmark.host
    : `${bookmark.host}:${bookmark.port}`;

  return div({
    className: 'bookmark',
    onClick,
    content: [
      div({
        className: 'bookmark-name',
        children: bookmark.name,
      }),

      div({
        className: 'bookmark-host',
        children: host,
      }),
    ],
  });
}
