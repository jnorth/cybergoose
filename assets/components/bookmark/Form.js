import React from 'react';
import DOM from '../dom';

import setView from '../../model/actions/setView';

class Label extends React.Component {
  render() {
    const { title, children } = this.props;
    const { div, input, button, label } = DOM;

    return label({
      className: 'form-field',
      content: [
        div({
          className: 'form-field-title',
          content: title,
        }),

        children,
      ],
    });
  }
}

export default class BookmarkForm extends React.Component {
  onSave(event) {
    event.preventDefault();

    const data = new FormData(event.target);

    fetch('/bookmarks', {
      method: 'post',
      body: data,
    });
  }

  onCancel(event) {
    event.preventDefault();

    setView('bookmarks');
  }

  render() {
    const { div, form, input, button } = DOM;
    const formField = DOM.factory(Label);

    return form({
      className: 'bookmarks-form',
      onSubmit: this.onSave.bind(this),
      content: [
        input({
          className: 'bookmarks-form-name',
          name: 'name',
          placeholder: 'Name',
        }),

        formField({
          className: 'bookmarks-form-host',
          title: 'Host',
          content: [
            input({
              name: 'host',
              placeholder: 'sftp.example.com',
            }),
          ],
        }),

        formField({
          className: 'bookmarks-form-port',
          title: 'Port',
          content: [
            input({
              name: 'port',
              type: 'number',
              placeholder: '22',
            }),
          ],
        }),

        formField({
          className: 'bookmarks-form-username',
          title: 'Username',
          content: [
            input({
              name: 'username',
              placeholder: '',
            }),
          ],
        }),

        formField({
          className: 'bookmarks-form-password',
          title: 'Password',
          content: [
            input({
              name: 'password',
              type: 'password',
            }),
          ],
        }),

        formField({
          className: 'bookmarks-form-path',
          title: 'Path',
          content: [
            input({
              name: 'path',
              placeholder: '~',
            }),
          ],
        }),

        button({
          content: 'Save',
        }),

        button({
          content: 'Cancel',
          onClick: this.onCancel.bind(this),
        }),
      ],
    });
  }
}
