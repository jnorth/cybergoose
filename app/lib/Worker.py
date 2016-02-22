from __future__ import division

import os
import time
import uuid
import threading
from Client import Client

class Worker(threading.Thread):
  def __init__(self, queue):
    threading.Thread.__init__(self, name="TransferWorker")

    self.id = uuid.uuid4()
    self.queue = queue
    self.current_transfer = None

    self.sleep_period = 1.0
    self.stop_event = threading.Event()

  def get_current_transfer(self):
    return self.current_transfer

  def run(self):
    print "starting worker {0}".format(self.id)

    while not self.stop_event.isSet():
      transfer = self.queue.next()

      if transfer:
        self.queue.activate(transfer)
        self.process(transfer)

      self.stop_event.wait(self.sleep_period)

  def stop(self, timeout=None):
    print "stopping worker {0}".format(self.id)
    self.stop_event.set()
    threading.Thread.join(self, timeout)

  def process(self, transfer):
    print "transfering", transfer
    self.current_transfer = transfer

    remote_path = transfer.get_path()
    filename = os.path.basename(remote_path)
    local_path = os.path.join("/data", filename)

    client = Client(transfer.get_bookmark())
    client.download(remote_path, local_path, callback=self.progress)
    client.close()

    transfer.complete()
    self.queue.complete(transfer)

    self.current_transfer = None
    print "transferred {}".format(transfer.to_json())

  def progress(self, bytes, total_bytes):
    print "transfering {0:.0f} ({1} bytes) {2}".format((bytes / total_bytes) * 100, total_bytes, self.current_transfer.path)
    self.current_transfer.progress = (bytes / total_bytes)
