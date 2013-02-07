
var fs = require('fs'),
	lazy = require('lazy'),
	async = require ('async'),
	http = require('http');

var count = 0,
	souppiccounter = 0,
	stream = fs.createReadStream('./soup_falk_2013-01-03.rss'),
	options = {},
	lastTitle = '',
	metaData = true;

var parralelDLs = 2; // how many pictures will be downloaded in parralel - adjust to soup speed of the day and you connection speed
var path = './soupImages/'; 

// first we check if path exists if it does not we create it - this is synchronous as without a path there is no saving a picture
if (!fs.existsSync(path)) {
	console.log('Creating Directory: ' + path);
	fs.mkdirSync(path);
};


function cleverMetadataGenerator(souplineOBJ){
	console.log(souplineOBJ);
	var sourceArray = new Array(),
		mainURLArray = new Array(),
		originalName = '',
		mainURLName = '',
		stringedsouplineOBJ = JSON.stringify(souplineOBJ).replace(new RegExp(',','g'),"\n").replace(new RegExp('\n','g'),"\n\n").replace(new RegExp('["{}]','g'),"").replace(new RegExp('(?!:\/\/):','g'),":  ");

		if ("source" in souplineOBJ && souplineOBJ.source != null){
			if(souplineOBJ.source.charAt(souplineOBJ.source.toString().length-1 ) == "/") {
  				souplineOBJ.source = souplineOBJ.source.slice(0, -1);
		}
		var sourceArray = souplineOBJ.source.split('/');
		var mainURLArray = sourceArray[2].split('.')
		var mainURLName = mainURLArray[mainURLArray.length-2];
		var regex = new RegExp('%..','gi');
		var originalName = sourceArray[sourceArray.length-1].split('.')[0].replace(regex,'');
		console.log(originalName);
		console.log(mainURLName + '-' + originalName);
		console.log(stringedsouplineOBJ);
		return {
			filename: mainURLName + '-' + originalName,
			stringedSoup: stringedsouplineOBJ
		};
	} else {
		return  {
			filename: '',
			stringedSoup: stringedsouplineOBJ
		}
	};
};

// take apart the rsscode line 
// if there is a <soup:attributes> tag 
// and inside that (JSON object) a url field
// start the downloading madness 
// pass down the callback from the queue

function downloader(task, callback){
 	var soupline = task.line.toString("utf8").match("<soup:attributes>(.*?)</soup:attributes>");
 	var title =  task.line.toString("utf8").match("<title>(.*?)</title>");
 	if (title != null){
 		lastTitle = title[1];
 	}
 	if (soupline != null) {
 		var souplineOBJ = JSON.parse(soupline[1]);
 			if (lastTitle){
 				souplineOBJ.title = lastTitle;
 			}
	   		if ("url" in souplineOBJ){
	   			souppiccounter++
	   			var metadata = cleverMetadataGenerator(souplineOBJ);

	   			var souplineURLArray = souplineOBJ.url.split("/");
	   			// console.log(souplineOBJ.url.split("/"));
	   			options = {
	   				host: souplineURLArray[2],
	   				port: 80,
	   				path: '/' + souplineURLArray[3] + '/' + souplineURLArray[4] + '/' + souplineURLArray[5]
	   			};
	   			var fileext = souplineURLArray[5].split('.')[souplineURLArray[5].split('.').length-1]
	   			console.log(fileext);
				var request = http.get(options, function(res){
	   				var imagedata = '';
	    			res.setEncoding('binary');

	    			res.on('data', function(chunk){
	        			imagedata += chunk;
	    			});

	    			res.on('end', function(){
	    				//console.log("respnsoe ends", res.socket.parser._header)
	    				//console.log(imagedata.toString())
	    				//write the file 
	    				var fullpath = path + '/' + metadata.filename + '_' +  souplineURLArray[5].split('.')[0];
	    				console.log(new Buffer(imagedata).toString('utf16le',1,1000));
	        			fs.writeFile(fullpath + '.' + fileext, imagedata, 'binary', function(err){
	            			if (err) throw err;
	            			if (writeMeta = true) {
	            			//write MetaData Text File
		            			fs.writeFile(fullpath + '.txt', metadata.stringedSoup, 'utf8', function(err){
		            				if (err) console.log(err.message);
		            				console.log('File ' + fullpath + ' and Metadata saved.');
		            				callback();
	            				});
	            			} else {
	            				console.log('File ' + fullpath + ' saved.');
	            				callback();
	            			};
	        			});
	   				 });
				});		
			} else {
  				callback();
  			};
  	} else {
  		callback();
  	};
};




// initialize the process and download queue 

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