from Queue import Queue

class Application:
  def __init__(self, db):
    self.db = db
    self.workers = []
    self.queue = Queue()
    self.bookmarks = self.db.load_bookmarks()
    self.current_bookmark = None

  def get_bookmarks(self):
    return self.bookmarks

  def get_current_bookmark(self):
    return self.current_bookmark

  def add_bookmark(self, bookmark):
    for b in self.bookmarks:
      if b.id == bookmark.id:
        return False

    self.bookmarks.append(bookmark)
    self.db.save_bookmarks(self.bookmarks)

  def remove_bookmark(self, id):
    self.bookmarks = [b for b in self.bookmarks if b.id != id]
    self.db.save_bookmarks(self.bookmarks)

  def enqueueTransfer(self, transfer):
    self.queue.put(transfer)

  def queued(self):
    return [item for item in self.queue.queue]

  def stop_workers(self):
    for worker in self.workers:
      worker.stop()
