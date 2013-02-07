
var fs = require('fs'),
	lazy = require('lazy'),
	async = require ('async');

var count = 0,
	countsearch = 0,
	stream = fs.createReadStream('./soup_falk_2013-01-03.rss');

var parralelDLs = 2; // how many pictures will be downloaded in parralel - adjust to soup speed of the day and you connection speed


// take apart the rsscode line 
// if there is a <soup:attributes> tag 
// and inside that (JSON object) a url field
// start the downloading madness 
// pass down the callback from the queue

function downloader(task, callback){
 	var soupline = task.line.toString("utf8").match("<soup:attributes>(.*?)</soup:attributes>");
 	if (soupline != null) {
 		var souplineOBJ = JSON.parse(soupline[1]);
	   		if ("url" in souplineOBJ){
				setTimeout(function(){
					console.log('LINE: ' + souplineOBJ.url);
					callback();
				}, 1000);  			
			} else {
  				callback();
  			};
  	} else {
  		callback();
  	};
};

// initialize the process and download queue 
// 
var q = async.queue(function (task, callback) {
    console.log('hello ' + task.id);
   	downloader(task, callback);
}, parralelDLs);

//push a new line into the queue to be processed 
function processRssLine(line){
	count++;
	q.push({id: count.toString(), line: line}, function(err){
		if (err) console.log("ERROR in Queue: ", err.message);
	});
};

// if the queue gets empty resume the filestream 
q.empty = function(){
	console.log("NEW BATCH");
	stream.resume();
};

// read in the file in chunks process asynchronous as much as possible 
// pause after each chunk cause downloading needs to catch up 

new lazy(stream)
    .lines
    .forEach(function(line){
    	stream.pause();
        processRssLine(line.toString());
    }
);