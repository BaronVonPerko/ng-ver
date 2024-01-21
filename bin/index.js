#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import {table} from "table";
import fs from 'fs';

const data = [
    ['Version', 'Status', 'Released', 'Active Ends', 'LTS Ends'],
    ['^17.0.0', chalk.green('Active'), '2023-11-08', '2024-05-08', '2025-05-15'],
    ['^16.0.0', chalk.yellow('LTS'), '2023-05-03', '2023-11-08', '2024-11-08'],
    ['^15.0.0', chalk.yellow('LTS'), '2022-11-18', '2023-05-03', '2024-05-18'],
    ['^14.0.0', chalk.red('EOL'), '2022-06-02', '2022-11-18', '2023-11-18',]
];

const config = {
    columns: {
        1: {width: 20, alignment: 'center'}
    }
}

function printData() {
    console.log(
        table(data, config)
    );
}

function printWelcomeBanner() {
    console.log(
        boxen(
            chalk.red('Angular Version EOL Checker'),
            {padding: 1, margin: 1, borderStyle: 'round', borderColor: 'red'}
        )
    );
}

function printNoProject() {
    console.log(chalk.bgRed('No project detected.'));
}

function printNotAngularProject() {
    console.log(chalk.bgRed('This is not an Angular project.'));
}

printWelcomeBanner();

const packageFile = fs.readFileSync('./package.json');

if(!packageFile) {
    printNoProject();
    printData();
}
if (packageFile) {
    const packageJson = JSON.parse(packageFile);
    if (!packageJson) {
        printNoProject();
        printData();
    } else {
        printData();

        if (Object.keys(packageJson.dependencies).includes('@angular/core')) {
            const majVersion = packageJson.dependencies['@angular/core'].split('.')[0].replace('^', '').replace('~', '');
            console.log(
                chalk.white('This project is using',
                    chalk.inverse(`Angular version ${majVersion}`),
                    'which is currently',
                    majVersion === '17' ? 'in ' + chalk.green('ACTIVE') + ' support.' :
                    majVersion === '16' || majVersion === '15' ? 'in ' + chalk.yellow('LTS') + ' support.' :
                    majVersion === '17' || majVersion === '16' || majVersion === '15' ? 'support.' : chalk.red('EOL') + '.',
            ));
        } else {
            printNotAngularProject();
        }
    }
}




