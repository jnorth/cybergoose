from Queue import Queue
from Worker import Worker

# TODO: use deque?
# https://docs.python.org/2/library/collections.html#collections.deque

class TransferManager:
  def __init__(self):
    self.queue = Queue()
    self.active = []
    self.completed = []

    worker = Worker(self)
    worker.start()
    self.workers = [worker]

  def enqueue(self, transfer):
    self.queue.put(transfer)

  def all(self):
    return self.active + [item for item in self.queue.queue] + self.completed

  def next(self):
    if self.queue.empty():
      return None

    transfer = self.queue.get()
    self.queue.task_done()
    return transfer

  def activate(self, transfer):
    self.active.append(transfer)

  def complete(self, transfer):
    if transfer in self.active: self.active.remove(transfer)
    self.completed.insert(0, transfer)

  def cancel(self, transfer_id):
    canceled_item = None

    for item in self.all():
      if item.id == transfer_id:
        item.canceled = True
        canceled_item = item

    if canceled_item:
      self.complete(canceled_item)

  def stop_workers(self):
    for worker in self.workers:
      worker.stop()
