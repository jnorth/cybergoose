import os
import paramiko

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
    self.sftp = paramiko.SFTPClient.from_transport(self.transport)
    self.sftp.chdir(self.bookmark.path)

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

  def download(self, remote_path, local_path, callback=None):
    print "client:download {} {}".format(self.bookmark.host, remote_path)
    self.open()
    self.sftp.get(remote_path, local_path, callback=callback)
