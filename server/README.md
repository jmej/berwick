A simple server to control volume of the Berwick Audio System

# Usage

```
$ node app.js localhost:9009
```
where `localhost:9009` is the target for OSC messages.

# Requirements

creds.json - A credentials file that looks like this:

```
{ "name": "someuser", "pass": "supersekret" }
```

Must be in the app directory.
If the file is changed, the server must be restarted.

Sets up an OSC listener hardcoded to port 3333 and web server hardcoded to port 8080

starting with forever is recommended

forever start app.js localhost:9009
forever stopall

