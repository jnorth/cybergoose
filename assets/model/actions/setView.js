import { dispatch } from '../store';

export default function(view) {
  dispatch({
    type: 'VIEW_SET',
    view,
  });
};
