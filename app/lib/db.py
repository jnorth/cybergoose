import json
import dpath

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

    # dpath.util.new(self.db, "favs", [])

  def save(self):
    with open(self.path, 'w') as file:
      json.dump(self.db, file)

  def get(self, path):
    try:
      return dpath.util.get(self.db, path)
    except KeyError:
      return None

  def set(self, path, value):
    dpath.util.set(self.db, path, value)

  def get_favs(self):
    return dpath.util.get(self.db, "favs")
