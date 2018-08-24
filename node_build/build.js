const browserify = require('browserify')
const babelify = require('babelify')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const uglify = require('uglify-js')

const dir = require('./config/directory.js')

const babelOptions = {
    presets : [['es2015',{modules:false}],'stage-0'], plugins : [
        'transform-object-assign', 'dynamic-import-node', 'transform-es2015-modules-commonjs'
    ]
}

const startTime = Date.now()

const writeFile = (fileName, code) => {
    fs.writeFile(fileName, code,_err => {
        if(!_err) console.log(chalk.green.bold('[package build @] : ' + fileName + 'in ' + chalk.cyan.bold(`[${((Date.now()-startTime)/1000).toFixed(2)} seconds]`)))+'.' 
        else console.log(chalk.red.bold('[package failed to build] : ') + _err)
    })
}

const loggerVersion = JSON.parse(fs.readFileSync(path.join(dir.root, '/package.json'),utf8)).version

