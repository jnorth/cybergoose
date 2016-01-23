import { dispatch } from '../store';

export default function(bookmark) {
  dispatch({
    type: 'BOOKMARK_ADD',
    bookmark,
  });
};
