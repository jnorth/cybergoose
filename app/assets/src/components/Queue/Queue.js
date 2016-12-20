import React from 'react';
import { dom, elif } from 'domb';
import classnames from 'classnames';
import filesize from 'filesize';

import ListItemView from '../ListItem/ListItem';

const div = dom(React, 'div');
const listItem = dom(React, ListItemView);

function basename(str) {
  return str.substr(str.lastIndexOf('/') + 1);
}

function queueItemStatus(item) {
  if (item.failed) return 'Failed';
  if (item.canceled) return 'Canceled';
  if (item.completed) return 'Completed';
  if (queueItemIsActive(item)) return 'Downloading';
  return 'Queued';
}

function queueItemProgress(item, prop) {
  return item.progress.reduce((total, part) => {
    return part.size == part.transferred
      ? total
      : total + part[prop];
  }, 0);
}

function queueItemProgressSize(item, prop) {
  return filesize(queueItemProgress(item, prop));
}

function queueItemProgressPercentage(item) {
  const transferred = queueItemProgress(item, 'transferred');
  const size = queueItemProgress(item, 'size');
  return ((transferred / size) * 100).toFixed(2);
}

function queueItemIsActive(item) {
  const transferred = queueItemProgress(item, 'transferred');
  return transferred > 0 && (!item.failed && !item.canceled && !item.completed);
}

function queueItemActions(app, item) {
  const actions = [];

  if (!item.failed && !item.canceled && !item.completed) {
    actions.push({
      name: 'Cancel',
      handler: event => app.cancelTransfer(item),
    });
  }

  if (item.failed || item.canceled) {
    actions.push({
      name: 'Retry',
      handler: event => app.retryTransfer(item),
    });
  }

  return actions;
}

function queueItemSubtitle(item) {
  const isActive = queueItemIsActive(item);
  const percentage = queueItemProgressPercentage(item);

  return [
    // Status
    div({
      className: 'queue-item-status',
      content: queueItemStatus(item),
    }),

    // Percent
    elif(percentage > 0 && percentage != 100, div)({
      className: 'queue-item-percent',
      content: `${percentage}%`,
    }),

    // Transferred - active download
    elif(isActive && !item.completed, div)({
      className: 'queue-item-filesize',
      content: `${queueItemProgressSize(item, 'transferred')} of ${queueItemProgressSize(item, 'size')}`,
    }),

    // Transferred - completed
    elif(item.transferred && !isActive && item.completed && !item.canceled && !item.failed, div)({
      className: 'queue-item-filesize',
      content: queueItemProgressSize(item, 'size'),
    }),

    // Transferred - other
    elif(item.transferred && !isActive && (item.canceled || item.failed), div)({
      className: 'queue-item-filesize',
      content: queueItemProgressSize(item, 'transferred'),
    }),

    // Rate
    elif(isActive, div)({
      className: 'queue-item-rate',
      content: `${queueItemProgressSize(item, 'rate')}/s`,
    }),
  ];
}

export default function Queue({ app }) {
  const { queue } = app;

  return div({
    className: 'queue',
    children: queue.state.map(item => listItem({
      key: `queue-${item.id}`,
      title: basename(item.path),
      actions: queueItemActions(app, item),
      subtitle: queueItemSubtitle(item),
      progress: (queueItemIsActive(item) ? item.progress : []),
      className: classnames('queue-item', {
        'failed': item.failed,
        'canceled': item.canceled,
        'completed': item.completed,
        'active': queueItemIsActive(item),
      }),
    })),
  });
}
