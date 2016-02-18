import os
import time
import uuid
import threading
from Client import Client

def progress(bytes, total_bytes):
  print "transfering {} ({} of {})".format(bytes / total_bytes, bytes, total_bytes)

class Worker(threading.Thread):
  def __init__(self, queue):
    threading.Thread.__init__(self, name="TransferWorker")

    self.id = uuid.uuid4()
    self.queue = queue

    self.sleep_period = 1.0
    self.stop_event = threading.Event()

  def run(self):
    print "starting worker {0}".format(self.id)

    while not self.stop_event.isSet():
      if not self.queue.empty():
        transfer = self.queue.get()
        self.process(transfer)
        self.queue.task_done()

      self.stop_event.wait(self.sleep_period)

  def stop(self, timeout=None):
    print "stopping worker {0}".format(self.id)
    self.stop_event.set()
    threading.Thread.join(self, timeout)

  def process(self, transfer):
    print "transfering", transfer

    remote_path = transfer.get_path()
    filename = os.path.basename(remote_path)
    local_path = os.path.join("/data", filename)

    client = Client(transfer.get_bookmark())
    client.download(remote_path, local_path, callback=progress)
    client.close()

    print "transferred", transfer
