from bottle import Bottle, request, static_file

from lib.Database import Database
from lib.Bookmark import Bookmark
from lib.Application import Application
from lib.Transfer import Transfer


# Create application
app = Application(Database("/data/db.json"))


# Response helpers
def web_error(message):
  return { "success":False, "error":message }


# Routes
web = Bottle()

@web.route("/")
def web_index():
  return static_file("index.html", root="./assets/templates")

@web.route('/assets/<filename:re:.*\.svg>')
def web_asset_svg(filename):
  return static_file(filename, root='./assets', mimetype='image/svg+xml')

@web.route("/assets/<filename:path>")
def web_asset(filename):
  return static_file(filename, root="./assets")

@web.route("/bookmarks", method="GET")
def web_bookmarks():
  bookmarks = [bookmark.encode() for bookmark in app.get_bookmarks()]
  return { "success":True, "bookmarks":bookmarks }

@web.route("/bookmarks", method="POST")
def web_add_bookmark():
  bookmark = Bookmark.decode(request.forms.decode())
  status = app.add_bookmark(bookmark)
  return { "success":status }

@web.route("/bookmarks", method="DELETE")
def web_remove_bookmark():
  id = request.forms.get("id")
  status = app.remove_bookmark(id)
  return { "success":status }

@web.route("/connect", method="POST")
def web_connect():
  bookmark_id = request.forms.get("bookmark_id")
  if bookmark_id is None:
    return web_error("No bookmark provided.")

  connection = app.connect(bookmark_id)
  if connection == False:
    return web_error("Invalid bookmark.")

  return { "success":True }

@web.route("/listing", method="POST")
def web_listing():
  path = request.forms.get("path")
  if path is None:
    return web_error("No path provided.")

  bookmark_id = request.forms.get("bookmark_id")
  if bookmark_id is None:
    return web_error("No bookmark id provided.")

  connection = app.connect(bookmark_id)
  if connection is None:
    return web_error("Invalid bookmark.")

  listing = connection.list_dir(path)
  connection.close()
  response = [resource.to_json() for resource in listing[1]]

  return { "success":True, "path":listing[0], "listing":response }

@web.route("/downloads", method="GET")
def web_queue():
  queue = [item.to_json() for item in app.queued()]
  return { "success":True, "queue":queue }

@web.route("/downloads", method="POST")
def web_download():
  path = request.forms.get("path")
  if path is None:
    return web_error("No path provided.")

  bookmark_id = request.forms.get("bookmark_id")
  if bookmark_id is None:
    return web_error("No bookmark id provided.")

  bookmark = app.get_bookmark_by_id(bookmark_id)
  if bookmark is None:
    return web_error("No bookmark found.")

  transfer = Transfer(bookmark=bookmark, path=path)
  app.enqueueTransfer(transfer)
  return { "success":True }

@web.route("/downloads", method="DELETE")
def web_download_cancel():
  transfer_id = request.forms.get("transfer_id")
  if transfer_id is None:
      return web_error("No transfer provided.")

  app.cancelTransfer(transfer_id)
  return { "success":True }


# Run application
web.run(host="0.0.0.0", port=8080, debug=True)
app.stop()
