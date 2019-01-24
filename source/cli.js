#!/usr/bin/env node
import '@babel/polyfill';
import ora from 'ora';
import meow from 'meow';
import chalk from 'chalk';
import devComic from '.';

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

const sources = cli.input;

const spinner = ora(chalk.cyan('Fetching comics'));

(async () => {
    spinner.start();

    try {
        const response = await devComic({sources});
        spinner.stop();

        console.log(`\n  ${chalk.dim('Latest comics:')}\n`);
        response.forEach(({source, image}) => {
            console.log(`  ${chalk.yellow(source)}\t${chalk.green(image)}`);
        });
    } catch (error) {
        spinner.stop();

        console.log(chalk.red(error.message));
    }
})();
