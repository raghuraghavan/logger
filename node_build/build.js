const dir = require('./config/directory.js');
const browserify = require('browserify');
const babelify = require('babelify');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const uglify = require('uglify-js');

const babelOptions = {
    'compact': false,
    presets: [
        [
            '@babel/preset-env',
            {
                'useBuiltIns': 'entry'
            }
        ]
    ],
    plugins: [
        'dynamic-import-node',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-json-strings',
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true
            }
        ],
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-pipeline-operator',
        [
            {
                'proposal': 'minimal'
            }
        ],
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-function-bind'
    ]
}

const startTime = Date.now()

const writeFile = (fileName, code) => {
    fs.writeFile(fileName, code, _err => {
        if (!_err) {
            console.log(chalk.green.bold('[package build @] : '
                + fileName
                + 'in '
                + chalk.cyan.bold(`[${((Date.now() - startTime) / 1000).toFixed(2)} seconds]`))) + '.'
        }
        else { console.log(chalk.red.bold('[package failed to build] : ') + _err) }
    })
}

const loggerVersion = JSON.parse(fs.readFileSync(path.join(dir.root, '/package.json'), 'utf8')).version

fs.mkdir(dir.dist.root, () => {
    browserify(dir.lib['browserLogger'], {
        standalone: 'browserLogger'
    }).transform(babelify.configure(babelOptions)).bundle((error, result) => {
        if (!error) {
            const code = result.toString('utf8').replace('logger=f()', match => match + '.default');
            writeFile(dir.dist['browserLogger-min'], uglify.minify(code).code);
            writeFile(dir.dist['browserLogger'], code);
        } else {
            console.log(chalk.red.bold('[package failed to build]:') + error);
        }
    })
});