import afetch from 'fetch';

import addBookmark from '../model/actions/addBookmark';

// Helpers

const parseJSON = (response) => {
  return response.json();
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
};

const handleError = (error) => {
  alert(error);
};

// Bookmarks

const fetchBookmarks = () => {
  fetch('/bookmarks')
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      for (let bookmark of data.bookmarks) {
        addBookmark(bookmark);
      }
    });
};

// Connections

const connect = (bookmark) => {
  const data = new FormData();
  data.append('bookmark_id', bookmark.id);

  return fetch('/connect', {
    method: 'post',
    body: data,
  })
  .catch(handleError)
  .then(checkStatus)
  .then(parseJSON);
};

const listing = (path) => {
  const data = new FormData();
  data.append('path', path);

  return fetch('/listing', {
    method: 'post',
    body: data,
  })
  .catch(handleError)
  .then(checkStatus)
  .then(parseJSON);
};

const download = (path) => {
  const data = new FormData();
  data.append('path', path);

  return fetch('/downloads', {
    method: 'post',
    body: data,
  })
  .catch(handleError)
  .then(checkStatus)
  .then(parseJSON);
};

export default {
  bookmarks: fetchBookmarks,
  connect,
  listing,
  download,
};
