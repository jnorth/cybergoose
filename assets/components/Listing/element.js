import React from 'react';
import { dom } from 'domb';

const div = dom(React, 'div');
const button = dom(React, 'button');
const section = dom(React, 'section');

const renderEmpty = () => {
  return 'Loading...';
}

const renderListing = (listing) => {
  return listing.map((resource) => {
    return div({
      key: resource.path,
      className: 'item ' + (resource.is_directory ? 'is-directory' : ''),
      content: [
        div(resource.name),
        div(resource.size),
        button('Download'),
      ],
    });
  });
}

export default ({ connection }) => {
  return section({
    className: 'listing',
    children: connection.listing
      ? renderListing(connection.listing)
      : renderEmpty(),
  });
}
