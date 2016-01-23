import uuid

class Bookmark:
  def __init__(self, id=None, name="Untitled", host=None, port=22, username=None, password=None, path="."):
    self.id = id if id else uuid.uuid4()
    self.name = name
    self.host = host
    self.port = int(port)
    self.username = username
    self.password = password
    self.path = path

  def encode(self, include_password=False):
    return {
      "id": str(self.id),
      "name": self.name,
      "host": self.host,
      "port": self.port,
      "username": self.username,
      "password": self.password if include_password else None,
      "path": self.path,
    }

  @classmethod
  def decode(cls, dict):
    bookmark = cls()
    if "id" in dict: bookmark.id = dict["id"]
    if "name" in dict: bookmark.name = dict["name"]
    if "host" in dict: bookmark.host = dict["host"]
    if "port" in dict: bookmark.port = int(dict["port"])
    if "username" in dict: bookmark.username = dict["username"]
    if "password" in dict: bookmark.password = dict["password"]
    if "path" in dict: bookmark.path = dict["path"]
    return bookmark
