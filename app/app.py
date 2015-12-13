from bottle import Bottle, request, static_file

from lib.Database import Database
from lib.Bookmark import Bookmark
from lib.Application import Application


# Create application
app = Application(Database("/data/db.json"))


# Routes
web = Bottle()

@web.route("/")
def web_index():
  return static_file("index.html", root="./assets/templates")

@web.route("/assets/:filename#.*#")
def web_asset(filename):
  return static_file(filename, root="./assets")

@web.route("/bookmarks", method="GET")
def web_bookmarks():
  bookmarks = [bookmark.encode() for bookmark in app.get_bookmarks()]
  return { "success":True, "bookmarks":bookmarks }

@web.route("/bookmarks", method="POST")
def web_add_bookmark():
  bookmark = Bookmark.decode(request.forms.decode())
  app.add_bookmark(bookmark)
  return { "success":True }

@web.route("/bookmarks", method="DELETE")
def web_remove_bookmark():
  id = request.forms.get("id")
  app.remove_bookmark(id)
  return { "success":True }

@web.route("/listing", method="POST")
def web_listing():
  path = request.forms.get("path")
  if path is None:
    return { "success":False, "error":"No path provided." }

  bookmark = app.get_current_bookmark()
  if bookmark is None:
    return { "success":False, "error":"No active connections." }

  return { "success":False, "error":"Not implemented yet." }

@web.route("/downloads", method="GET")
def web_queue():
  return { "success":True, "queue":worker.queued() }

@web.route("/downloads", method="POST")
def web_download():
  path = request.forms.get("path")
  if path is None:
    return { "success":False, "error":"No path provided." }

  bookmark = app.get_current_bookmark()
  if bookmark is None:
    return { "success":False, "error":"No active connection." }

  transfer = Transfer(bookmark=bookmark, path=path)
  app.enqueueTransfer(transfer)
  return { "success":True }


# Run application
web.run(host="0.0.0.0", port=8080, debug=True)
app.stop_workers()
