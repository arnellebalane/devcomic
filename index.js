var fs = require('fs');
var path = require('path');
var feed = require('feed-read');
var ee = require('event-emitter');


var comicsSources = null;
var emitter = ee({});


function getComics(sources, callback) {
    if (sources.length) {
        var source = sources.shift();
        emitter.emit('source', source);

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


function devcomic(callback, options) {
    if (!comicsSources) {
        var sourcesPath = path.join(__dirname, 'sources.json');
        comicsSources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    }
    options = options || {};

    var sources = comicsSources;
    if (options.sources instanceof Array) {
        sources = sources.filter(function filterCb(source) {
            var sourceRegex = new RegExp('^' + source.name + '$', 'gi');
            for (var i = 0; i < options.sources.length; i++) {
                if (sourceRegex.test(options.sources[i])) {
                    options.sources.splice(i, 1);
                    return true;
                }
            }
            return false;
        });

        if (sources.length === 0) {
            emitter.emit('error', 'Given sources are not available, going to '
                + 'use all available sources.');
            sources = comicsSources;
        } else if (options.sources.length > 0) {
            emitter.emit('error', 'The following comics sources are not '
                + 'available: ' + options.sources.join(' '));
        }
    }

    getComics(sources, function getComicsCb(comics) {
        comics = comics.reduce(function reduceCb(object, comic) {
            object[comic[0]] = comic[1];
            return object;
        }, {});

        if (!options.all) {
            Object.keys(comics)
                .forEach(function forEachCb(comicSource) {
                    comics[comicSource] = comics[comicSource][0];
                });
        }

        if (typeof callback === 'function') {
            return callback(comics);
        }
        throw new Error('devcomic callback must be a function.');
    });
}


devcomic.on = emitter.on.bind(emitter);


module.exports = devcomic;
