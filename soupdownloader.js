
var fs = require('fs'),
	lazy = require('lazy'),
	async = require ('async');

var count = 0,
	countsearch = 0,
	stream = fs.createReadStream('./soup_falk_2013-01-03.rss'),
	linechunks = [];

var parralelDLs = 2; // how many pictures will be downloaded in parralel - adjust to soup speed of the day and you connection speed



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



var q = async.queue(function (task, callback) {
    console.log('hello ' + task.id);
   	downloader(task, callback);
}, parralelDLs);

function test(line){
	count++;
	q.push({id: count.toString(), line: line}, function(err){
		if (err) console.log("ERROR in Queue: ", err.message);
	});
};

q.empty = function(){
	console.log("NEW BATCH");
	stream.resume();
};



// stream.setEncoding('utf8');
// stream.addListener('data', function (line) {
//     // pause stream
//     stream.pause();
//     // make async API call...
//     test(line, function(message) {
//         // then resume to process next line
//         console.log(message);
//         stream.resume();
//     });
// })


// async.forEachSeries(new lazy(stream).lines, function(callback){
// 	console.log("linefinder");
// 	callback ("done");
// }, function(err){ if (err) throw err;});

new lazy(stream)
    .lines
    .forEach(function(line){
    	stream.pause();
    	// at this point  we already have lots of entries 
    	// so we would likely pause the stream until we get through all these 
		// lets call the function that brings us to the one by one line appoach
        test(line.toString());
    }
);





// input.on('data', function(line) {
// 	count++;
// 	//console.log(line.toString("utf8").match("<soup:attributes>(.*?)</soup:attributes>"));
// 	var soupline = line.toString("utf8").match("<soup:attributes>(.*?)</soup:attributes>");
// 	if (soupline != null) {
// 		var souplineOBJ = JSON.parse(soupline[1]);
//   		//console.log(souplineOBJ);
//   		if ("url" in souplineOBJ){
// 			console.log(souplineOBJ.url);
//   			//test(souplineOBJ.url, function(message){
//   			//});
//   		}
//   		countsearch++;

//   }
// });

// input.on('end', function(){
// 	console.log("Count: " + count.toString(), "countsearch: " + countsearch.toString());
// })