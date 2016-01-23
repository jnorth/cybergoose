export default (state, action) => {
  if (state === undefined) {
    state = [];
  }

  switch (action.type) {
    case 'CONNECTION_ADD':
      return [ ...state, {
        name: action.name,
        bookmark_id: action.bookmark_id,
      }];

    case 'CONNECTION_REMOVE':
      return state.filter((connection, index) => {
        return index !== action.index;
      });

    case 'CONNECTION_SET_LISTING':
      return state.map((connection, index) => {
        return index === action.connection
          ? { ...connection, listing: action.listing }
          : connection;
      });

    default:
      return state;
  }
}
