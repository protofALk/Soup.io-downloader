# What is Soup.IO Downloader

A node.js programm to download all your images from your Soup.IO RSS feed to a local harddrive. Optionally you can also save some metadata in a textfile for each image (like the original source of the image). 
## Download 

1.  App for OSX [here](https://github.com/protofALk/Soup.io-downloader/blob/master/soupiodownloaderPackage/SoupDownloader.app.zip)
2.  for node version just download the soudownloader.js above

## Get your rss first

To get your own RSS file go to your Soup, login and under "options" then under "privacy" click on export RSS. It will take between a while and a LONG time depending on how big your Soup is - but you will be rewarded with a really nice RSS feed that stores the pathes to your images and the orinigal source links and not much else. 

## How to run

### The Prepackaged Way 
(use this if you don´t have node installed and just want a "click and go" solution and you are on OSX)


You can get the a prepackaged App for OSX [here](https://github.com/protofALk/Soup.io-downloader/blob/master/soupiodownloaderPackage/SoupDownloader.app.zip).
Just unpack -> launch with double click to start. 

Then: 

1.  choose your downloaded RSS file
2.  choose the folder you want to save the images in
3.  if you want a metaInfo text file for ever image you can do that here
4.  leave the concurrent download number alone if you don´t want to break the interwebs 
	(so if Soup feels fast on the day and you are on a fast connection you might go higher, if the connection hangs too long quit restart do 1-4 again and set a lower number here)


### The Native Node Way 

command shell if you have node installed (download just the soupdownloader.js in the main directory): 

The programm takes two arguments 

1.  if you want the metaInfo textfile
2.  how many concurrent downloads you want 
1.  the path to the rss file 
2.  the path were the picture go


Example:

node soupdownloader true 2 /path/tomy/soup-date-rssfile.rss path/tomy/pictures/

if the second directory does not exist it will be created

# License
[GNU GENERAL PUBLIC LICENSE v3](http://www.gnu.org/licenses/gpl.html)

## Brought to you by
[fALk Gärtner aka protofALk](https://github.com/protofalk) and maybe [others](https://github.com/prototypen/protoo/graphs/contributors)