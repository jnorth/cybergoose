import os
import paramiko
from math import ceil

from Resource import Resource

class Client:
  def __init__(self, bookmark):
    self.bookmark = bookmark
    self.transport = None
    self.sftp = None

  def get_bookmark(self):
    return self.bookmark

  def is_open(self):
    return self.transport and self.transport.is_active()

  def open(self):
    if self.is_open():
      return

    print "client:open {}".format(self.bookmark.host)
    self.transport = paramiko.Transport((self.bookmark.host, self.bookmark.port))
    self.transport.connect(username=self.bookmark.username, password=self.bookmark.password)
    self.transport.window_size = 5 * 1024 * 1024
    self.sftp = paramiko.SFTPClient.from_transport(self.transport)
    self.sftp.chdir(".")

  def close(self):
    print "client:close {}".format(self.bookmark.host)
    if self.sftp: self.sftp.close()
    if self.transport: self.transport.close()

  def list_dir(self, path="."):
    print "client:list_dir {} {}".format(self.bookmark.host, path)
    self.open()
    base_path = os.path.normpath(os.path.join(self.sftp.getcwd(), path))
    listing = self.sftp.listdir_attr(base_path)
    return [base_path, [Resource.from_attributes(base_path, attributes) for attributes in listing]]

  def download(self, remote_path, local_path, callback=None, buffer=32768, prefetch=50):
    print "client:download {} {}".format(self.bookmark.host, remote_path)
    self.open()

    # Open local file
    with open(local_path, "wb") as local_file:

      # Open remote file
      with self.sftp.open(remote_path, "rb") as remote_file:
        total_bytes = remote_file.stat().st_size
        transferred_bytes = 0
        active = True

        while active:
          chunks = self.next_chunks(total_bytes, transferred_bytes, buffer, prefetch)
          if len(chunks) < 1: break

          for data in remote_file.readv(chunks):
            local_file.write(data)
            transferred_bytes += len(data)

            if callback is not None:
              should_stop = callback(transferred_bytes, total_bytes)
              if should_stop: active = False

            if len(data) == 0:
              break

  def next_chunks(self, total_bytes, offset, chunk_size, chunk_count):
    chunks_remaining = int(ceil(float(total_bytes - offset) / chunk_size))
    num = min(chunk_count, chunks_remaining)
    return [(offset + (chunk_size * i), chunk_size) for i in xrange(num)]
