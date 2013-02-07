# What is Soup.IO Downloader

A node.js programm to download all Pictures from a Soup.IO RSS feed and puts the original source into the metadata of the picture. 


## Get your rss first

To get your own RSS file go to your Soup, login and under "options" export RSS. It will take between a while and a LONG time depending on how big your Soup is - but you will be rewarded with a really nice RSS feed that stores the pathes to your images and the orinigal source links (and a whole bunch of other stuff that I am not including)

## How to run
at the moment everything is hardcoded as it will be packaged - change code in the beginning to run with your rss file

soon: 

The programm takes two arguments 
1.) the path to the rss file 
2.) the path were the picture go

if I am having a lot of fun I will add a web interface for that - for the moment thats how its run

node soupdownloader /path/tomy/soup-date-rssfile.rss path/tomy/pictures/

if the second directory does not exist it will be created

# License
[GNU GENERAL PUBLIC LICENSE v3](http://www.gnu.org/licenses/gpl.html)

## Brought to you by
[fALk Gärtner aka protofALk](https://github.com/protofalk) and maybe [others](https://github.com/prototypen/protoo/graphs/contributors)