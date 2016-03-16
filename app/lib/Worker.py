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

  def init_transfer(self, transfer=None):
    self.current_transfer = transfer
    self.rate = 0
    self.start_time = 0 if transfer is None else time.time()

  def process(self, transfer):
    print "transfering {}".format(transfer.to_json())

    remote_path = transfer.get_path()
    filename = os.path.basename(remote_path)
    local_path = os.path.join("/data", filename)

    self.init_transfer(transfer)
    client = Client(transfer.get_bookmark())
    client.download(remote_path, local_path, callback=self.progress)
    client.close()
    self.init_transfer()

    transfer.complete()
    self.queue.complete(transfer)

    print "transferred {}".format(transfer.to_json())

  def progress(self, bytes, total_bytes):
    percent = bytes / total_bytes

    bps = bytes / (time.time() - self.start_time)
    self.rate += (bps - self.rate) / 5;

    self.current_transfer.progress = percent
    self.current_transfer.transferred = bytes
    self.current_transfer.size = total_bytes
    self.current_transfer.rate = self.size(self.rate)

    print "transfer {0} {1:.0f}% of {2} {3}/s".format(
      os.path.basename(self.current_transfer.path),
      percent * 100,
      self.size(total_bytes),
      self.size(self.rate),
    )

  def size(self, num, suffix="B"):
    for unit in ['','K','M','G','T','P','E','Z']:
      if abs(num) < 1024.0:
        return "%3.1f %s%s" % (num, unit, suffix)
      num /= 1024.0
    return "%.1f %s%s" % (num, 'Y', suffix)
