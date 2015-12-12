import time
import threading
from Queue import Queue
from server import Server

class TransferWorker(threading.Thread):
  def __init__(self, server):
    threading.Thread.__init__(self, name="TransferWorker")

    self.server = server
    self.queue = Queue()
    self.running = False

    self.sleep_period = 1.0
    self.stop_event = threading.Event()

  def run(self):
    print "worker thread running"
    self.running = True

    while not self.stop_event.isSet():
      # if not self.queue.empty():
      #   item = self.queue.get()
      #   self.transfer(item)
      #   self.queue.task_done()

      self.stop_event.wait(self.sleep_period)

  def stop(self, timeout=None):
    self.stop_event.set()
    threading.Thread.join(self, timeout)

  def queued(self):
    return [item for item in self.queue.queue]

  def add(self, item):
    print "adding item", item
    self.queue.put(item)

  def transfer(self, item):
    print "transfering item", item
    self.server.transfer(item)
    time.sleep(2)
    print "transferred item", item
