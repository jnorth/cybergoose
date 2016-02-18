import React from 'react';
import { dom, elif } from 'domb';
import Toolbar from './Toolbar';
import Listing from './Listing';
import Empty from './EmptyListing';

const section = dom(React, 'section');
const toolbar = dom(React, Toolbar);
const listing = dom(React, Listing);

export default function Connection({ app }) {
  const connection = app.getActiveConnection();
  const empty = elif(!connection.listing, dom(React, Empty));
  const listing = elif(connection.listing, dom(React, Listing));

  return section({
    className: 'connection',
    content: [
      toolbar({
        path: connection.path,
        closeAction: event => app.disconnect(),
        pathUpAction: event => app.connections.pathUp(app.state.connection),
      }),
      empty(),
      listing({
        onDirectory: path => app.connections.fetchListing(app.state.connection, path),
        listing: connection.listing,
      }),
    ],
  });
}
