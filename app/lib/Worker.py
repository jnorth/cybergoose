import time
import uuid
import threading

class Worker(threading.Thread):
  def __init__(self, queue):
    threading.Thread.__init__(self, name="TransferWorker")

    self.id = uuid.uuid4()
    self.queue = queue
    self.running = False

    self.sleep_period = 1.0
    self.stop_event = threading.Event()

  def run(self):
    print "starting worker {0}".format(self.id)
    self.running = True

    while not self.stop_event.isSet():
      if not self.queue.empty():
        transfer = self.queue.get()
        self.transfer(transfer)
        self.queue.task_done()

      self.stop_event.wait(self.sleep_period)

  def stop(self, timeout=None):
    print "stopping worker {0}".format(self.id)
    self.stop_event.set()
    threading.Thread.join(self, timeout)

  def process(self, transfer):
    print "transfering", transfer
    # self.server.transfer(item)
    time.sleep(1)
    transfer.progress = 10.0
    time.sleep(1)
    transfer.progress = 20.0
    time.sleep(1)
    transfer.progress = 30.0
    time.sleep(1)
    transfer.progress = 40.0
    time.sleep(1)
    transfer.progress = 50.0
    time.sleep(1)
    transfer.progress = 60.0
    time.sleep(1)
    transfer.progress = 70.0
    time.sleep(1)
    transfer.progress = 80.0
    time.sleep(1)
    transfer.progress = 90.0
    time.sleep(1)
    transfer.progress = 100.0
    print "transferred", transfer
