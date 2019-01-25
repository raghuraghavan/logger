//const dir = require('./config/directory.js');
const browserify = require('browserify');
const babelify = require('babelify');
const chalk = require('chalk');
const fs = require('fs');
const uglify = require('uglify-js');



const startTime = Date.now()

const writeFile = (fileName, code) => {
    fs.writeFile(fileName, code, _err => {
        if (!_err) {
            console.log(chalk.magenta.bold(' Packaging done -- file location & name :: '
                + chalk.blue.underline.bold(fileName)
                + '  in '
                + chalk.magenta.bold(`${((Date.now() - startTime) / 1000).toFixed(2)} seconds]`)))
                + '. '
        }
        else { console.log(chalk.red.bold('[package failed to build] : ') + _err) }
    })
}

try {
    const originalFile = './lib/logger.js'
    const folderName = 'dist';
    const filename = 'clientside-Logger.js';
    const filename_with_minification = 'clientside-Logger.min.js';
    if (!fs.existsSync(folderName)) {
        fs.mkdir(folderName, () => {
            console.log(chalk.green.bold(` Distrubtion Folder created : ${folderName} `));
        });
    } else {
        console.log(chalk.blue.bold(`[ Folder exist : ${folderName} ]`));
    }
    browserify(originalFile)
        .transform(babelify, { presets: ["@babel/preset-env"] })
        .bundle((err, result) => {
            if (!err) {
                try {
                    const filewithfolderName = `./${folderName}/${filename}`;
                    const minifyfilewithfolderName = `./${folderName}/${filename_with_minification}`;
                    let code2File = result.toString('utf8');
                    writeFile(filewithfolderName, code2File);
                    writeFile(minifyfilewithfolderName, uglify.minify(code2File).code);
                } catch (_error) {
                    console.log(chalk.red.bold('[package failed to build] : ') + _error);
                }
            }
        });
} catch (err) {
    console.log(chalk.magenta.bold('[package failed to build] : ') + err);
};
