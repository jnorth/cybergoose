from Client import Client
from TransferManager import TransferManager

class Application:
  def __init__(self, db):
    self.queue = TransferManager()

    self.client = None

    self.db = db
    self.bookmarks = self.db.load_bookmarks()

  def get_bookmarks(self):
    return self.bookmarks

  def get_bookmark_by_id(self, id):
    for bookmark in self.bookmarks:
      if bookmark.id == id:
        return bookmark
    return None

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
    self.queue.enqueue(transfer)

  def cancelTransfer(self, transfer_id):
    self.queue.cancel(transfer_id)

  def queued(self):
    return self.queue.all()

  def stop(self):
    self.queue.stop_workers()
