from queue import Queue
from .Worker import Worker

class TransferManager:
  def __init__(self):
    self.queue = []

    worker = Worker(self)
    worker.start()
    self.workers = [worker]

  def enqueue(self, transfer):
    self.queue.append(transfer)

  def all(self):
    return [item for item in self.queue]

  def claim(self):
    for transfer in self.queue:
      if transfer.is_ready():
        transfer.claimed = True
        return transfer

  def cancel(self, transfer_id):
    for transfer in self.queue:
      if transfer.id == transfer_id:
        transfer.cancel()

  def retry(self, transfer_id):
    for transfer in self.all():
      if transfer.id == transfer_id:
        transfer.reset()

  def stop_workers(self):
    for worker in self.workers:
      worker.stop()
