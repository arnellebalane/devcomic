#!/usr/bin/env node
import '@babel/polyfill';
import ora from 'ora';
import meow from 'meow';
import devComic from '.';

const cli = meow(`
    Usage:
      $ devcomic [source ...]

    Sources:
      commitstrip
      hacktoon

    Examples:
      $ devcomic
      $ devcomic commitstrip
      $ devcomic commitstrip hacktoon
`);

const sources = cli.input;

const spinner = ora('Fetching comics');

(async () => {
    const response = await devComic({sources});
    console.log(response);
})();
