import os
import paramiko

from Resource import Resource

class Client:
  def __init__(self):
    self.is_open = False
    self.transport = None
    self.sftp = None

  def open(self, host=None, port=22, username=None, password=None, path="."):
    if self.is_open:
      return

    self.is_open = True
    self.transport = paramiko.Transport((host, port))
    self.transport.connect(username=username, password=password)
    self.sftp = paramiko.SFTPClient.from_transport(self.transport)
    self.sftp.chdir(path)

  def close(self):
    self.sftp.close()
    self.transport.close()
    self.is_open = False

  def list_dir(self, path="."):
    self.open()
    base_path = os.path.normpath(os.path.join(self.sftp.getcwd(), path))
    listing = self.sftp.listdir_attr(base_path)
    return [Resource.from_attributes(base_path, attributes) for attributes in listing]
