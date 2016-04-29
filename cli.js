#!/usr/bin/env node
var meow = require('meow');
var ora = require('ora');
var chalk = require('chalk');
var openImage = require('open-image');
var devcomic = require('./');


var cli = meow([
    'Usage:',
    '  $ devcomic [sources]',
    '  $ devcomic [options] [sources]',
    '',
    'Options:',
    '  --all, -a              Display all results.',
    '  --preview, -p          Preview comics images.'
    '',
    'By default (without options), it displays one result from all sources.',
    '',
    'Examples:',
    '  $ devcomic',
    '  $ devcomic --all',
    '  $ devcomic --all commitstrip hacktoons',
    '  $ devcomic -pa'
], {
    'alias': {
        'a': 'all',
        'p': 'preview'
    },
    'boolean': ['all']
});

var options = {
    'all': cli.flags.all === true,
    'preview': cli.flags.preview === true,
    'sources': cli.input.length ? cli.input : null
};


var spinner = ora('Loading');
spinner.spinner = {
    'interval': 80,
    'frames': [
        '  ⠋',
        '  ⠙',
        '  ⠹',
        '  ⠸',
        '  ⠼',
        '  ⠴',
        '  ⠦',
        '  ⠧',
        '  ⠇',
        '  ⠏'
    ]
};

var openImageSpinner = ora('Opening images');
openImageSpinner.spinner = spinner.spinner;


function openImages(images) {
    openImageSpinner.start();

    var image = images.shift();
    openImageSpinner.text = 'Opening ' + image;

    return openImage(image).then(function thenCb() {
        if (images.length) {
            return openImages(images);
        }
        openImageSpinner.stop();
        return null;
    });
}


spinner.start();

devcomic.on('source', function onCb(source) {
    spinner.text = 'Getting comics from ' + source.name;
});

devcomic.on('error', function onCb(message) {
    spinner.stop();
    console.log('\n  ' + chalk.red.dim(message));
    spinner.start();
});

devcomic(function devcomicCb(comics) {
    spinner.stop();

    var title = chalk.green.bold;
    var link = chalk.dim;

    var output = [];
    var images = [];
    Object.keys(comics).forEach(function forEachComicsCb(comicSource) {
        output.push('');
        output.push('  ' + comicSource + ':');

        var comicData = comics[comicSource] instanceof Array
            ? comics[comicSource] : [comics[comicSource]];
        comicData.forEach(function forEachComicDataCb(comic) {
            output.push('    ' + title(comic.title.trim())
                + ' (' + link(comic.link.trim()) + ')');
            images.push(comic.image);
        });
    });
    output.push('');

    console.log(output.join('\n'));

    if (options.preview) {
        openImages(images);
    }
}, options);
