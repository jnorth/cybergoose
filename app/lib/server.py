import os
import paramiko

from resource import Resource

class Server:
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

  # def transfer(self, path):
  #   uri = "{0}:{1}".format(self.server, self.quote_path(path))
  #   call = ["sshpass", "-p", self.password, "scp", "-r", "-oStrictHostKeyChecking=no", uri, "/data"]
  #   print call
  #   return self.call(call)

  # # Private

  # def run_command(self, params):
  #   call = ["sshpass", "-p", self.password, "ssh", "-T", "-o StrictHostKeyChecking=no", self.server]
  #   call.extend(params)
  #   return self.call(call)

  # def call(self, call):
  #   try:
  #     result = subprocess.check_output(call)
  #     return [True, result]
  #   except subprocess.CalledProcessError as e:
  #     return [False, str(e)]

  # # Prep a string for use on the command line
  # def quote_path(self, path):
  #   return "'" + path.replace("'", "'\\''") + "'"

  # # Parse directory listing into item dicts
  # def parse_listing(self, prefix, raw):
  #   items = filter(None, raw.split("\n"))
  #   listing = []

  #   for item in items:
  #     name = item.strip("/")
  #     type = "directory" if item.endswith("/") else "file"
  #     listing.append({
  #       "type": type,
  #       "name": name,
  #       "raw":  prefix + item
  #     })

  #   return listing




# # Prep a string for use on the command line
# def quote_path(path):
#   return "'" + path.replace("'", "'\\''") + "'"

# # Parse directory listing into item dicts
# def parse_listing(prefix, raw):
#   items = filter(None, raw.split("\n"))
#   listing = []

#   for item in items:
#     name = item.strip("/")
#     type = "directory" if item.endswith("/") else "file"
#     listing.append({
#       "type": type,
#       "name": name,
#       "raw":  prefix + item
#     })

#   return listing

# # Run a command on an SSH server
# def run_command(host, username, password, commands):
#   server = "{0}@{1}".format(username, host)
#   call = ["sshpass", "-p", password, "ssh", "-T", "-o StrictHostKeyChecking=no", server]
#   call.extend(commands)

#   try:
#     result = subprocess.check_output(call)
#     return [True, result]
#   except subprocess.CalledProcessError as e:
#     return [False, str(e)]

# # Get the directory listing on an SSH server
# def list_folder(host, username, password, folder):
#   result = run_command(host, username, password, ["ls", "-Ap", quote_path(folder)])
#   return parse_listing(folder, result[1]) if result[0] else []

# def remote_download(host, username, password, path):
#   server = "{0}@{1}:{2}".format(username, host, path)
#   call = ["sshpass", "-p", password, "scp", "-r", quote_path(server), "/data"]

#   try:
#     result = subprocess.check_output(call)
#     return [True, result]
#   except subprocess.CalledProcessError as e:
#     return [False, str(e)]
