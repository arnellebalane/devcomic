#!/usr/bin/env node
import '@babel/polyfill';
import meow from 'meow';
import chalk from 'chalk';
import Listr from 'listr';
import openImage from 'open-image';
import devComic from '.';
import sourcesConfig from './sources.json';

/* eslint-disable max-len */
const cli = meow(`
    ${chalk.dim.underline('Usage:')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.dim('[')}${chalk.yellow('options')} ${chalk.dim(']')} ${chalk.dim('[')}${chalk.yellow('source')} ${chalk.dim('...]')}

    ${chalk.dim.underline('Sources:')}
      ${chalk.yellow('commitstrip')}
      ${chalk.yellow('xkcd')}
      ${chalk.yellow('hacktoon')}

    ${chalk.dim.underline('Options:')}
      ${chalk.yellow('-p, --preview')}\t${chalk.dim('Opens a preview of the comic image')}

    ${chalk.dim.underline('Examples:')}
      ${chalk.dim('$')} ${chalk.green('devcomic')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.yellow('-p')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.yellow('commitstrip')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.yellow('commitstrip xkcd')}
`, {
    flags: {
        preview: {
            type: 'boolean',
            alias: 'p'
        }
    }
});
/* eslint-enable max-len */

const sources = cli.input.length > 0
    ? cli.input
    : Object.keys(sourcesConfig);

const shouldPreview = cli.flags.preview;

(async () => {
    try {
        const tasks = new Listr(sources.map(source => ({
            title: `${chalk.dim('Fetching latest comic from')} ${chalk.yellow(source)}`,

            task: async (context, task) => {
                const [comic] = await devComic({sources: [source]});
                task.title = `${chalk.yellow(source)}\t${chalk.green(comic.image)}`;
                context[source] = comic.image;
            }
        })), {
            concurrent: true,
            exitOnError: false
        });

        const results = await tasks.run();

        if (shouldPreview) {
            Object.values(results).map(openImage);
        }
    } catch (error) {
        /*
         * This catch block is intentionally left empty, since the error is already
         * being displayed under the Listr task.
         */
    }
})();
