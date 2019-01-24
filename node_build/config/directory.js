const path = require('path')
const join = path.join
const root = join(path.resolve(__dirname), '../..')

const directory = {
    root: root,
    dist: {
        root: join(root, 'dist'),
        'browserLogger-min': join(root, 'dist/browserLogger-min.js'),
        'browserLogger': join(root, 'dist/browserLogger.js')
    },
    node_modules: {
        root: join(root, 'node_modules')
    },
    lib: {
        root: join(root, 'lib'),
        browserLogger: join(root, 'lib/logger.js')
    }
}

module.exports = directory