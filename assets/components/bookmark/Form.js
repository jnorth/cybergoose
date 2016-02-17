import React from 'react';
import { dom } from 'domb';

const { div, form, label, input, button } = dom(React, 'div', 'form', 'label', 'input', 'button');

function field({ title, name, placeholder, type }) {
  return label({
    className: `form-field bookmark-form-field-${name}`,
    content: [
      div({
        className: 'form-field-title',
        content: title,
      }),

      input({ placeholder, name, type }),
    ],
  });
}

export default function BookmarkForm({ app }) {
  return form({
    className: 'bookmark-form',

    onSubmit: (event) => {
      event.preventDefault();
      const form = event.target;
      const data = new FormData(form);
      app.bookmarks.create(data);
      app.setView('bookmarks');
    },

    content: [

      field({
        title: 'Bookmark Name',
        name: 'name',
      }),

      field({
        title: 'Host',
        name: 'host',
        placeholder: 'example.com',
      }),

      field({
        title: 'Port',
        name: 'port',
        type: 'number',
        placeholder: '22',
      }),

      field({
        title: 'Username',
        name: 'username',
      }),

      field({
        title: 'Password',
        name: 'password',
        type: 'password',
      }),

      field({
        title: 'Path',
        name: 'path',
        placeholder: '~',
      }),

      button({
        content: 'Add',
      }),
    ],
  });
}
