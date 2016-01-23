from Client import Client

class Transfer:
  def __init__(self, bookmark=None, path=None):
    self.bookmark = bookmark
    self.path = path
    self.progress = 0.0

  def get_bookmark(self):
    return self.bookmark

  def get_path(self):
    return self.path

  def to_json(self):
    return {
      "host": self.bookmark.host,
      "path": self.path,
      "progress": self.progress,
    }
