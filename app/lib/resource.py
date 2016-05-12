import os
import stat

class Resource:
  @classmethod
  def from_attributes(cls, path, attributes):
    return cls(path=path, name=attributes.filename, bytes=attributes.st_size, mode=attributes.st_mode)

  def __init__(self, path=None, name=None, bytes=None, mode=None):
    self.path = path
    self.name = name
    self.bytes = bytes
    self.mode = mode

    if self.path and self.name:
      self.path = os.path.join(path, name)

  def is_directory(self):
    return stat.S_ISDIR(self.mode)

  def is_link(self):
    return stat.S_ISLNK(self.mode)

  def size(self, suffix="B"):
    num = self.bytes
    for unit in ['','K','M','G','T','P','E','Z']:
      if abs(num) < 1024.0:
        return "%3.1f %s%s" % (num, unit, suffix)
      num /= 1024.0
    return "%.1f %s%s" % (num, 'Y', suffix)

  def to_json(self):
    return {
      "path": self.path,
      "name": self.name,
      "bytes": self.bytes,
      "size": self.size(),
      "is_directory": self.is_directory(),
      "is_link": self.is_link(),
    }

  def __repr__(self):
    return "{0} {1}".format(self.size(), self.name)
