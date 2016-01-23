export default function reducer(state, action) {
  if (state === undefined) {
    state = [];
  }

  switch (action.type) {
    case 'BOOKMARK_ADD':
      return [...state, action.bookmark];

    default:
      return state;
  }
};
