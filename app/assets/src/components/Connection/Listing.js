import React from 'react';
import { dom } from 'domb';

const div = dom(React, 'div');
const button = dom(React, 'button');

export default ({ listing, onDirectory, onDownload }) => {
  return div({
    className: 'connection-listing',
    children: [
      ...listing.map((resource) => {
        return div({
          key: resource.path,
          className: 'listing-item ' + (resource.is_directory ? 'is-directory' : ''),
          content: [

            div({
              className: 'listing-item-label',
              onClick: event => {
                if (resource.is_directory) onDirectory(resource.path);
              },
              content: [
                div({
                  className: 'listing-item-name',
                  content: resource.name,
                }),
                div({
                  className: 'listing-item-size',
                  content: resource.size,
                }),
              ],
            }),

            div({
              className: 'listing-item-actions',
              content: [
                button({
                  content: 'Download',
                  onClick: event => onDownload(resource.path),
                }),
              ],
            }),

          ],
        });
      })
    ],
  });
}
