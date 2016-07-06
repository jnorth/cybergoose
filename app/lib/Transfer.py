import os
import uuid
from .Client import Client

class Transfer:
  def __init__(self, bookmark=None, base_path=None, path=None):
    self.id = str(uuid.uuid4())
    self.bookmark = bookmark
    self.base_path = base_path
    self.path = path
    self.progress = 0.0
    self.completed = False
    self.failed = False
    self.canceled = False
    self.verified = False
    self.transferred = 0
    self.size = 0
    self.rate = 0
    self.hash = ""

  def is_ready(self):
    if self.completed: return False
    if self.failed: return False
    if self.canceled: return False
    return True

  def get_bookmark(self):
    return self.bookmark

  def get_remote_path(self):
    return self.path

  def get_path(self):
    base = os.path.dirname(self.base_path)
    return os.path.relpath(self.path, base)

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
      "base": self.base_path,
      "path": self.path,
      "progress": self.progress,
      "completed": self.completed,
      "failed": self.failed,
      "canceled": self.canceled,
      "verified": self.verified,
      "transferred": self.transferred,
      "size": self.size,
      "rate": self.rate,
    }
