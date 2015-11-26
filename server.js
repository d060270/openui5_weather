var express = require("express");
var http = require("http");
var fs = require("fs");
var path = require("path");

var Randomizer = require("./randomizer.js");
var randomizer = new Randomizer();

//check for debug switch:
DEBUG = process.argv.indexOf("debug") >= 0;
if(DEBUG){
	SERVICE_URL = "http://localhost:3000/test/request.json?api={API}";
}else{
	SERVICE_URL = "http://api.wunderground.com/api/{API}/{options}/conditions/forecast/q/Germany/Wiesloch.json";
}
TESTDATA_URL = "http://localhost:3000/test/request.json";

API = "19420d53f811294e";
DATA = {};
LOGS = __dirname + "/log";
HISTORY = __dirname + "/history";
DATA_DIR = __dirname + "/data";
SETTINGS_FILE = DATA_DIR + "/settings.json";

var app = express();

var router = express.Router();

console.log("Sending Requests to \"" + buildRequestURI() + "\"");

//create routes for retrieval of stored data
router.get("/service", function(req, res, next){
	res.send(DATA);
});
router.get("/service/settings", function(req, res, next){
	res.send(readSettings());
});
router.post("/service/settings", function(req, res, next){
	// writeSettings({
	// 	city: req.body.city
	// });
	res.end();
});
router.get("/service/test", function(req, response, next){
	http.get(TESTDATA_URL, function(res){

		//set encoding and read data from body
		res.setEncoding('utf8');
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			try{
				DATA = JSON.parse(data);
				response.send(DATA);
			}catch(e){
				console.error("Error", e);
				log(e);
			}
		});

	}).on("error", function(e){
		var d = new Date().toUTCString();
		
		console.error("[" + d + "] " + e.code + ": ", e);
		log(e.code + ": " + e.hostname);
	});
});

//add router to app as middleware for data requests
app.use(router);
//add static webapp-Folder to app as middleware
app.use("/", express.static(__dirname + "/webapp"));

var server = app.listen(3000, function(){
	var port = server.address().port;

	var msg = "[" + (new Date().toUTCString()) + "] Fetching weather data from Service...";
	console.log(msg);
	log(msg);
	getWeatherData();
	console.log('Server listening on port %s', port);
});


function getWeatherData(options){
	var reqURI = buildRequestURI(options || {});
	http.get(reqURI, function(res){

		//set encoding and read data from body
		res.setEncoding('utf8');
		var data = "";
		res.on('data', function (chunk) {
			data += chunk;
		});
		res.on('end', function () {
			console.log("Received all data.");
			try{
				randomizer = new Randomizer();
				DATA = JSON.parse(data, DEBUG ? randomizer.randomize : function(k, v) { return v; });
				/*log("\n" +
					JSON.stringify(DATA) +
					"\n---------------------------------------\n\n",
					"history.log"
				);*/
			}catch(e){
				console.error("Error", e);
				log(e);
			}
		});

	}).on("error", function(e){
		var d = new Date().toUTCString();
		
		console.error("[" + d + "] " + e.code + ": ", e);
		log(e.code + ": " + e.hostname);
	});
}

function buildRequestURI(options){
	var sOptions = "lang:DL";
	var uri = SERVICE_URL.replace("{API}", API).replace("{options}", sOptions);

	return uri;
}

function log(msg, file){
	if(!fs.existsSync(LOGS)){
		fs.mkdirSync(LOGS);
	}
	file = file || "server.log";

	var d = new Date().toUTCString();
	fs.appendFileSync(LOGS + path.sep + file, "[" + d + "] " + msg + "\n");
}

function readSettings(){
	if(!fs.existsSync(SETTINGS_FILE)){
		return {};
	}
	return fs.readFileSync(SETTINGS_FILE, { encoding: "utf-8" });
}

function writeSettings(o){
	fs.writeFileSync(SETTINGS_FILE, JSON.stringify(o));
}

//set an interval to update weather data from the web service and store it
var intv = 1000 * 60 * 30; //update every 30 minutes
setInterval(function(){
	var msg = "[" + (new Date().toUTCString()) + "] Fetching weather data from Service...";
	console.log(msg);
	log(msg);
	getWeatherData();
}, DEBUG ? 2000 : intv);