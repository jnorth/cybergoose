import os
import uuid
import time
from .Client import Client

class TransferPart:
  def __init__(self):
    self.progress = 0.0
    self.size = 0
    self.transferred = 0
    self.rate = 0
    self.start_time = time.time()

  def report_progress(self, bytes, total_bytes):
    percent = bytes / total_bytes

    bps = bytes / (time.time() - self.start_time)
    self.rate += (bps - self.rate) / 5;

    self.progress = percent
    self.transferred = bytes
    self.size = total_bytes
    self.rate = self.rate

class Transfer:
  def __init__(self, bookmark=None, base_path=None, path=None):
    self.id = str(uuid.uuid4())
    self.bookmark = bookmark
    self.base_path = base_path
    self.path = path
    self.hash = ""
    self.parts = []

    self.reset()

  def report_progress(self, part_index, bytes, total_bytes):
    while len(self.parts) < part_index + 1:
      self.parts.append(TransferPart())

    self.parts[part_index].report_progress(bytes, total_bytes)

  def is_ready(self):
    if self.claimed: return False
    if self.completed: return False
    if self.failed: return False
    if self.canceled: return False
    return True

  def reset(self):
    self.claimed = False
    self.completed = False
    self.failed = False
    self.canceled = False
    self.verified = False
    self.parts = []

  def get_bookmark(self):
    return self.bookmark

  def get_remote_path(self):
    return self.path

  def get_path(self):
    base = os.path.dirname(self.base_path)
    return os.path.relpath(self.path, base)

  def get_parts_progress(self):
    return [vars(part) for part in self.parts]

  def complete(self, failed=False):
    self.completed = True
    self.failed = failed

  def cancel(self):
    self.canceled = True

  def to_json(self):
    return {
      "id": str(self.id),
      "bookmark": self.bookmark.name,
      "host": self.bookmark.host,
      "base": self.base_path,
      "path": self.path,
      "completed": self.completed,
      "failed": self.failed,
      "canceled": self.canceled,
      "verified": self.verified,
      "progress": self.get_parts_progress(),
    }
