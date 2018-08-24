const path = require('path')
const join = path.join
const root = join(path.resolve(__dirname),'../..')

const directory = {
    root:root,
    dist : {
        root : join(root, 'dist'),
        'logger-min': join(root,'dist/logger-min.js'),
        'logger' : join(root,'dist/logger.js')
    },
    node_modules: {root : join(root,'node_modules')},
    lib : {root : join (root, 'lib'), logger : join(root,'lib/logger.js')}
}

module.exports = directory