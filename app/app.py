import json
import os
import sys
import subprocess
from bottle import route, run, Bottle, request, static_file

from Queue import Queue
from threading import Thread

from lib.server import Server
from lib.db import Database
from lib.transfers import TransferWorker


db = Database("/data/db.json")
server = Server()
# server.open(...)
worker = TransferWorker(server)


class Bookmark:
  def __init__(self, host=None, port=None, username=None, password=None, path="."):
    self.host = host
    self.port = port
    self.username = username
    self.password = password
    self.path = path


class Transfer:
  def __init__(self, bookmark, path):
    self.bookmark = bookmark
    self.path = path

  def to_json(self):
    return {
      "host": self.bookmark.host,
      "path": self.path,
    }


class Application:
  def __init__(self):
    self.bookmarks = []
    self.workers = []
    self.queue = Queue()

    self.current_bookmark = None

# Web App


app = Bottle()

@app.route("/")
def web_index():
  return static_file("index.html", root="./assets/templates")

@app.route("/assets/:filename#.*#")
def web_asset(filename):
  return static_file(filename, root="./assets")

@app.route("/listing", method="POST")
def web_listing():
  path = request.forms.get("path", "private/rtorrent/data/")
  listing = [resource.to_json() for resource in server.list_dir(path)]
  return { "success":True, "listing":listing }

@app.route("/queue", method="GET")
def web_queue():
  return { "success":True, "queue":worker.queued() }

@app.route("/download", method="POST")
def web_download():
  path = request.forms.get("path")

  if path is None:
    return { "success":False, "error":"No path provided." }

  worker.add(path)
  return { "success":True, "queue":worker.queued() }


worker.start()
app.run(host="0.0.0.0", port=8080, debug=True)
worker.stop()
