#!/usr/bin/env node
import '@babel/polyfill';
import meow from 'meow';
import chalk from 'chalk';
import Listr from 'listr';
import devComic from '.';
import sourcesConfig from './sources.json';

const cli = meow(`
    ${chalk.dim.underline('Usage:')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.dim('[')}${chalk.yellow('source')} ${chalk.dim('...]')}

    ${chalk.dim.underline('Sources:')}
      ${chalk.yellow('commitstrip')}
      ${chalk.yellow('hacktoon')}

    ${chalk.dim.underline('Examples:')}
      ${chalk.dim('$')} ${chalk.green('devcomic')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.yellow('commitstrip')}
      ${chalk.dim('$')} ${chalk.green('devcomic')} ${chalk.yellow('commitstrip hacktoon')}
`);

const sources = cli.input.length > 0
    ? cli.input
    : Object.keys(sourcesConfig);

(async () => {
    try {
        const tasks = new Listr(sources.map(source => ({
            title: `${chalk.dim('Fetching latest comic from')} ${chalk.yellow(source)}`,

            task: async (context, task) => {
                const [comic] = await devComic({sources: [source]});
                task.title = `${chalk.yellow(source)}\t${chalk.green(comic.image)}`;
            }
        })), {
            concurrent: true,
            exitOnError: false
        });

        await tasks.run();
    } catch (error) {
        /*
         * This catch block is intentionally left empty, since the error is already
         * being displayed under the Listr task.
         */
    }
})();
