import { dispatch, state as getState } from '../store';
import sync from '../sync';

export default function(bookmark) {
  dispatch({
    type: 'CONNECTION_ADD',
    name: bookmark.name,
    bookmark_id: bookmark.id,
  });

  const state = getState();
  const connectionId = state.connections.length - 1;

  dispatch({
    type: 'VIEW_SET',
    view: 'connection',
  });

  dispatch({
    type: 'CONNECTION_SET',
    connection: connectionId,
  });

  sync.connect(bookmark).then((rsp) => {
    sync.listing('.').then((rsp) => {
      dispatch({
        type: 'CONNECTION_SET_LISTING',
        connection: connectionId,
        listing: rsp.listing,
      });
    });
  });
};
