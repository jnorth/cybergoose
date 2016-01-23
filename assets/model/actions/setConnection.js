import { dispatch } from '../store';

export default function(connectionIndex) {
  dispatch({
    type: 'CONNECTION_SET',
    connection: connectionIndex,
  });
};
