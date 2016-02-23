import React from 'react';
import { dom } from 'domb';

const div = dom(React, 'div');

export default function EmptyListing() {
  return div({
    className: 'connection-empty',
    content: 'Loading...',
  });
}
