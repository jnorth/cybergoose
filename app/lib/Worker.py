import os
import errno
import time
import uuid
import threading
import sys
import hashlib
from .Client import Client

class Worker(threading.Thread):
  def __init__(self, queue):
    threading.Thread.__init__(self, name="TransferWorker")

    self.id = uuid.uuid4()
    self.queue = queue

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
    self.rate = 0
    self.start_time = 0 if transfer is None else time.time()

  def process(self, transfer):
    print("transfering {}".format(transfer.to_json()))

    remote_path = transfer.get_remote_path()
    local_path = os.path.join("/data", transfer.get_path())

    # Create local directories if needed
    local_dir = os.path.dirname(local_path)
    os.makedirs(local_dir, exist_ok=True)

    self.init_transfer(transfer)
    client = Client(transfer.get_bookmark())
    failed = False

    try:
      # Download file
      client.download_file(remote_path, local_path, callback=self.progress)

      # Verify file
      remote_hash = client.hash_file(remote_path)
      local_hash = self.hash_file(local_path)
      transfer.verified = remote_hash != "" and local_hash == remote_hash
      print("transfer:checkhash {} {}".format(remote_hash, local_hash))

    except Exception as e:
      print("transfer:failed {}".format(e))
      failed = True

    client.close()
    self.init_transfer()

    transfer.complete(failed=failed)

    print("transferred {}".format(transfer.to_json()))

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

  def progress(self, bytes, total_bytes):
    percent = bytes / total_bytes

    bps = bytes / (time.time() - self.start_time)
    self.rate += (bps - self.rate) / 5;

    self.current_transfer.progress = percent
    self.current_transfer.transferred = bytes
    self.current_transfer.size = total_bytes
    self.current_transfer.rate = self.rate

    if self.current_transfer.canceled:
      return True
