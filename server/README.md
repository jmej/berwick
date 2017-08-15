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

# How it works

Each time a slider is dragged, there is some client-side debouncing, and then an ajax POST request is sent to the express server on one of 3 routes:

* /vol/zone1
* /vol/zone2
* /vol/zone3

The POST body is text/plain and contains a single numeric value (ranged 0-100).

The server then translates this call into an OSC message like:

* `/zone1/<n>`
* `/zone2/<n>`
* `/zone3/<n>`

It is expected that the Pd side of things will ultimately use something like:

`[routeOSC /zone1 /zone2 /zone3]`

to control the 3 zone volumes. 

# Persistence

A single `state.json` file will keep track of the volume levels in case of server or browser restart. 
Each time a slider value is changed (after debouncing), the `state.json` is overwritten with all 3 zone values.

The behavior of the persistence mechanism with simultaneous/concurrent users is likely nondeterministic.
