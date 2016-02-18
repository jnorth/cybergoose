import 'fetch';

// Helpers

const parseJSON = (response) => {
  return response.json();
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

const handleError = (error) => {
  alert(error);
};

const get = (url, body) => {
  return fetch(url, { method:'get', body })
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON);
};

const post = (url, body) => {
  return fetch(url, { method:'post', body })
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON);
};

const del = (url, body) => {
  return fetch(url, { method:'delete', body })
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON);
};

// Bookmarks

const fetchBookmarks = () => {
  return fetch('/bookmarks')
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => data.bookmarks);
};

const addBookmark = (body) => {
  return fetch('/bookmarks', { method:'post', body })
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON);
};

// Connections

const connect = (bookmark) => {
  const body = new FormData();
  body.append('bookmark_id', bookmark.id);

  return fetch('/connect', { method:'post', body })
    .catch(handleError)
    .then(checkStatus)
    .then(parseJSON);
};

const download = (path) => {
  const body = new FormData();
  body.append('path', path);

  return fetch('/downloads', {
    method: 'post',
    body,
  })
  .catch(handleError)
  .then(checkStatus)
  .then(parseJSON);
};

export default {
  get, post, del,
  bookmarks: fetchBookmarks,
  addBookmark,
  connect,
  download,
};
