#!/usr/bin/env node
var meow = require('meow');
var ora = require('ora');
var chalk = require('chalk');
var devcomic = require('.');


var cli = meow([
    'Usage:',
    '  $ devcomic [sources]',
    '  $ devcomic [options] [sources]',
    '',
    'Options:',
    '  --all, -a                          Display all results.',
    '',
    'By default (without options), it displays one result from all sources.',
    '',
    'Examples:',
    '  $ devcomic',
    '  $ devcomic --all',
    '  $ devcomic --all commitstrip hacktoons'
], {
    'alias': {
        'a': 'all'
    },
    'boolean': ['all']
});

var options = {
    'all': cli.flags.all === true,
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


spinner.start();

devcomic.on('source', function onCb(source) {
    spinner.text = 'Getting comics from ' + source.name;
});

devcomic(function devcomicCb(comics) {
    spinner.stop();

    var title = chalk.green.bold;
    var link = chalk.dim;

    var output = [];
    Object.keys(comics).forEach(function forEachComicsCb(comicSource) {
        output.push('');
        output.push('  ' + comicSource + ':');

        var comicData = comics[comicSource] instanceof Array
            ? comics[comicSource] : [comics[comicSource]];
        comicData.forEach(function forEachComicDataCb(comic) {
            output.push('    ' + title(comic.title.trim())
                + ' (' + link(comic.link.trim()) + ')');
        });
    });
    output.push('');

    console.log(output.join('\n'));
}, options);
