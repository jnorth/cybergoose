import json
import dpath

from Bookmark import Bookmark

class Database:
  def __init__(self, path):
    self.path = path
    self.load()

  def load(self):
    try:
      with open(self.path) as file:
        self.db = json.load(file)
    except (IOError, ValueError) as e:
      self.db = {}
      print e

  def save(self):
    with open(self.path, 'w') as file:
      json.dump(self.db, file, indent=2)

  def get(self, path, default=None):
    try:
      return dpath.util.get(self.db, path)
    except KeyError:
      return default

  def set(self, path, value):
    try:
      dpath.util.get(self.db, path)
      dpath.util.set(self.db, path, value)
    except KeyError:
      dpath.util.new(self.db, path, value)

  def load_bookmarks(self):
    encoded = self.get("bookmarks", default=[])
    bookmarks = [Bookmark.decode(dict) for dict in encoded]
    return bookmarks

  def save_bookmarks(self, bookmarks):
    encoded = [bookmark.encode(include_password=True) for bookmark in bookmarks]
    self.set("bookmarks", encoded)
    self.save()
