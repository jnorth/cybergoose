import uuid
from Client import Client

class Transfer:
  def __init__(self, bookmark=None, path=None):
    self.id = unicode(str(uuid.uuid4()), "utf-8")
    self.bookmark = bookmark
    self.path = path
    self.progress = 0.0
    self.completed = False
    self.failed = False
    self.transferred = 0
    self.size = 0

  def get_bookmark(self):
    return self.bookmark

  def get_path(self):
    return self.path

  def get_progress(self):
    return self.progress

  def complete(self, failed=False):
    self.progress = 1.0
    self.completed = True
    self.failed = failed

  def to_json(self):
    return {
      "id": str(self.id),
      "bookmark": self.bookmark.name,
      "host": self.bookmark.host,
      "path": self.path,
      "progress": self.progress,
      "completed": self.completed,
      "failed": self.failed,
      "size": self.size,
      "transferred": self.transferred,
    }
