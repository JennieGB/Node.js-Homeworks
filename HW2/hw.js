const program = require('commander');

const fs = require('fs');
const path = require('path');

const index = require('./index.js');

program
    .version(index.VERSION)
    .usage('<cmd> [arguments] [options]')
    .command('init', 'Run CLI initialization')
    .command('add', 'Add homework assignment to calendar')
    //.command('list', 'List homework assignments for a given day')
    //.command('rem', 'Remove a homework assignment from calendar')
    .parse(process.argv);
    