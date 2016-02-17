from Queue import Queue
from Client import Client
from Worker import Worker

class Application:
  def __init__(self, db):
    self.queue = Queue()

    worker = Worker(self.queue)
    worker.start()
    self.workers = [worker]

    self.client = None

    self.db = db
    self.bookmarks = self.db.load_bookmarks()

  def get_bookmarks(self):
    return self.bookmarks

  def get_connection(self):
    return self.client

  def connect(self, bookmark_id):
    if self.client:
      if self.client.get_bookmark().id == bookmark_id:
        return self.client
      else:
        self.client.close()

    for bookmark in self.bookmarks:
      if bookmark.id == bookmark_id:
        self.client = Client(bookmark)
        return self.client

    return False

  def add_bookmark(self, bookmark):
    for b in self.bookmarks:
      if b.id == bookmark.id:
        return False

    self.bookmarks.append(bookmark)
    self.db.save_bookmarks(self.bookmarks)
    return True

  def remove_bookmark(self, id):
    self.bookmarks = [b for b in self.bookmarks if b.id != id]
    self.db.save_bookmarks(self.bookmarks)
    return True

  def enqueueTransfer(self, transfer):
    self.queue.put(transfer)

  def queued(self):
    return [item for item in self.queue.queue]

  def stop_workers(self):
    for worker in self.workers:
      worker.stop()
