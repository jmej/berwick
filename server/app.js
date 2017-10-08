var fs = require('fs');
var osc = require('node-osc');
var express = require('express');
var app = express();

var SAVESTATE = 'state.json';
var CREDS = 'creds.json';

var args = process.argv.slice(2);
if(!args[0]){
	return usage();
}

var muteState = {muted: 0, hours: 0, mins: 0, secs: 0}; //object to hold mutestate info from pd
var currentlyPlaying = {liveInput: 0, file: ""};
var vol = 50;
var hostport = args[0].split(/:/);
console.log("Opening OSC client to " + hostport[0] + " on port " + hostport[1]);
var client = new osc.Client(hostport[0], hostport[1]);
var oscServer = new osc.Server(3333, 'localhost');
oscServer.on("message", function (msg, rinfo) {
      console.log("Message from Pd:");
      console.log(msg);
      if (msg[0] == '/muted'){
      	muteState.muted = msg[1];
      }
      if (msg[0] == '/mute-seconds-left'){
      	muteState.secs = msg[1];
      }
      if (msg[0] == '/mute-minutes-left'){
      	muteState.mins = msg[1];
      }
      if (msg[0] == '/mute-hours-left'){
      	muteState.hours = msg[1];
      }
      if (msg[0] == '/live'){
      	currentlyPlaying.liveInput = msg[1];
      }
      if (msg[0] == '/file'){
      	currentlyPlaying.file = msg[1];
      }
      if (msg[0] == '/vol'){
      	vol = msg[1];
      }
});

var state = loadPersistedValues();
var creds = JSON.parse(fs.readFileSync(CREDS));

var auth = require('./auth').auth(creds);

var bodyParser = require('body-parser')
app.use(bodyParser.text())

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/static', auth, express.static(__dirname + '/static', {
	index: false
}));

app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.get('/', auth, function(req, res){
	var values = loadPersistedValues();
	res.render('index', values);
});

app.get('/mute-state', auth, function(req, res){
	res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(muteState) );
    res.end('\n');
});

app.get('/currently_playing', auth, function(req, res){
	res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(currentlyPlaying) );
    res.end('\n');
});

app.get('/vol', auth, function(req, res){
	res.writeHead(200, {'content-type': 'text/json' });
    res.write( JSON.stringify(vol) );
    res.end('\n');
});

app.post('/vol', auth, function(req, res){
	console.log("Changing volume: to " + req.body);
	client.send('/vol', parseInt(req.body), function(){
	});
	state[req.params] = req.body;
	saveState(state);
	res.set('Conent-Type', 'text/plain');
	res.send('ok');
});

app.post('/mute', auth, function(req, res){
    console.log("Changing muting to " + req.body);
    client.send('/mute', parseInt(req.body), function(){
    });
    state[req.params] = req.body;
    saveState(state);
    res.set('Conent-Type', 'text/plain');
    res.send('ok');
});

app.post('/override', auth, function(req, res){
    console.log("Changing override to " + req.body);
    client.send('/override', parseInt(req.body), function(){
    });
    state[req.params] = req.body;
    saveState(state);
    res.set('Conent-Type', 'text/plain');
    res.send('ok');
});

app.listen(8080);
console.log("Server listening on port 8080");

//probably don't need the next two functions anymore but don't want to yank from production
function loadPersistedValues(){
	if(fs.existsSync(SAVESTATE)){
		return JSON.parse(fs.readFileSync(SAVESTATE));
	}
	return { zone1: 100, zone2: 100, zone3: 100 };
}

function saveState(state){
	fs.writeFileSync(SAVESTATE, JSON.stringify(state));
}

function usage(){
	console.log("Usage: node app.js <host>:<port>");
	console.log("  where <host>:<port> is the OSC target.");
}
