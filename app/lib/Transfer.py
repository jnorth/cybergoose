class Transfer:
  def __init__(self, bookmark=bookmark, path=path):
    self.bookmark = bookmark
    self.path = path
    self.progress = 0.0

  def to_json(self):
    return {
      "host": self.bookmark.host,
      "path": self.path,
      "progress": self.progress,
    }
