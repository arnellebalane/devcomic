var fs = require('fs');
var path = require('path');
var feed = require('feed-read');


var comicsSources = null;


function getComics(sources, callback) {
    if (sources.length) {
        var source = sources.shift();
        feed(source.link, function feedCb(error, articles) {
            if (error) {
                throw error;
            }
            var comics = [[source.name, articles]];
            if (sources.length) {
                return getComics(sources, function getComicsCb(moreComics) {
                    comics = comics.concat(moreComics);
                    callback(comics);
                });
            }
            return callback(comics);
        });
    }
}


function devcomic(callback) {
    if (!comicsSources) {
        var sourcesPath = path.join(__dirname, 'sources.json');
        comicsSources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    }
    getComics(comicsSources.slice(), function getComicsCb(comics) {
        comics = comics.reduce(function reduceCb(results, comic) {
            results[comic[0]] = comic[1];
            return results;
        }, {});

        if (typeof callback === 'function') {
            return callback(comics);
        }
        throw new Error('devcomic callback must be a function.');
    });
}


module.exports = devcomic;
