import os
import errno
import time
import uuid
import threading
import sys
import shutil
import hashlib
from math import ceil
from .Client import Client

class Worker(threading.Thread):
  def __init__(self, queue, p=4):
    super().__init__(name="Worker")

    self.id = uuid.uuid4()
    self.queue = queue
    self.p = p

    self.sleep_period = 1.0
    self.stop_event = threading.Event()

  def get_current_transfer(self):
    return self.current_transfer

  def run(self):
    print("starting worker {0}".format(self.id))

    while not self.stop_event.isSet():
      transfer = self.queue.claim()

      if transfer:
        self.process(transfer)

      self.stop_event.wait(self.sleep_period)

  def stop(self, timeout=None):
    print("stopping worker {0}".format(self.id))
    self.stop_event.set()
    threading.Thread.join(self, timeout)

  def init_transfer(self, transfer=None):
    self.current_transfer = transfer

  def process(self, transfer):
    print("transfer:start {}".format(transfer.to_json()))

    # Get file info
    root_client = Client(transfer.get_bookmark())
    remote_path = transfer.get_remote_path()
    filesize = root_client.filesize(remote_path)
    seekable = root_client.seekable(remote_path)
    root_client.close()

    # Get parts
    p = self.p if seekable else 1
    parts = self.split_filesize(filesize, parts=p)
    print("transfer:start:parts {}".format(parts))

    # Create download threads
    create_client = lambda part: lambda: self.process_part(transfer, part, len(parts))
    clients = [threading.Thread(target=create_client(part)) for part in parts]

    failed = False
    self.init_transfer(transfer)

    try:
      # Download file
      for client in clients: client.start()
      for client in clients: client.join()
      self.join_parts(transfer, parts)
      # TODO: only join parts if transfer completed

      # Verify file
      # remote_hash = root_client.hash_file(remote_path)
      # local_hash = self.hash_file(local_path)
      # transfer.verified = remote_hash != "" and local_hash == remote_hash
      # print("transfer:checkhash {} {}".format(remote_hash, local_hash))

    except Exception as e:
      print("transfer:failed {}".format(e))
      failed = True

    self.init_transfer()
    transfer.complete(failed=failed)
    print("transfer:complete {}".format(transfer.to_json()))

  def process_part(self, transfer, part, index, tries=3):
    # Build paths
    remote_path = transfer.get_remote_path()
    local_path = self.get_part_path(transfer, part)
    print("transfer:thread id:{}\n  {}".format(self.id, local_path))

    # Create local directories if needed
    local_dir = os.path.dirname(local_path)
    os.makedirs(local_dir, exist_ok=True)

    # Start transfer
    client = Client(transfer.get_bookmark())

    while True:
      try:
        client.download_file(remote_path, local_path, part=part, callback=self.progress)
        break
      except Exception as e:
        print("transfer:thread:error tries:{} {}".format(tries, e))
        tries -= 1
        if tries == 0: raise e

  def get_part_path(self, transfer, part=None):
    local_file = transfer.get_path()
    if part and part["total"] > 1: local_file = "{}.cg{}".format(local_file, part["index"])
    local_path = os.path.join("/data", local_file)
    return local_path

  def join_parts(self, transfer, parts):
    if len(parts) == 1: return

    path = self.get_part_path(transfer)
    print("transfer:join {}".format(path))

    # Open local file
    with open(path, "wb") as file:
      for part in parts:
        part_path = self.get_part_path(transfer, part)

        # Append each part
        with open(part_path, "rb") as part_file:
          shutil.copyfileobj(part_file, file)

    # Delete part files
    for part in parts:
      part_path = self.get_part_path(transfer, part)
      os.remove(part_path)

  def hash_file(self, local_path):
    BUF_SIZE = 65536 # 64kb

    sha1 = hashlib.sha1()

    with open(local_path, "rb") as f:
      while True:
        data = f.read(BUF_SIZE)
        if not data:
          break
        sha1.update(data)

    return sha1.hexdigest()

  def progress(self, part, bytes, total_bytes):
    self.current_transfer.report_progress(part["index"], bytes, total_bytes)
    if self.current_transfer.canceled: return True

  def split_filesize(self, filesize, parts=1, min_part_size=52428800):
    """
      Partition a length of bytes into N number of ranges.
    """
    ranges = []
    if (filesize < 1): return ranges

    index = 0
    offset = 0
    range_size = max(min_part_size, int(ceil(filesize / parts)))

    while True:
      if offset >= filesize: break
      length = min(range_size, filesize - offset)
      ranges.append({
        "offset": offset,
        "length": length,
        "index": index
      })
      index += 1
      offset += length

    for r in ranges:
      r["total"] = len(ranges)

    return ranges
