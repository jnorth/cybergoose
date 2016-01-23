import React from 'react';
import DOM from '../dom';

import sync from '../../model/sync';
import { dispatch } from '../../model/store';

const renderEmpty = () => {
  return 'Loading...';
}

const renderListing = (listing) => {
  const { div, button } = DOM;

  return listing.map((resource) => {
    return div({
      key: resource.path,
      className: 'item ' + (resource.is_directory ? 'is-directory' : ''),
      content: [
        div({
          content: resource.name,
        }),

        div({
          content: resource.size,
        }),

        button({
          content: 'Download',
          onClick: (event) => {
            event.stopPropagation();
            sync.download(resource.path).then((rsp) => {
              console.log(rsp);
            });
          },
        }),
      ],
      onClick: (event) => {
        // sync.listing(resource.path).then((rsp) => {
        //   dispatch({
        //     type: 'CONNECTION_SET_LISTING',
        //     listing: rsp.listing,
        //   });
        // });
      },
    });
  });
}

export default ({ connection }) => {
  const { section } = DOM;

  return section({
    className: 'listing',
    children: connection.listing
      ? renderListing(connection.listing)
      : renderEmpty(),
  });
}
