var express = require('express')
  , app = express()
  //, gzippo = require('gzippo')
  , stylus = require('stylus')
  , nib = require('nib')
  , utils = require('./app/utils/utils');

// pass in arguments
var argv = []
  , opts = {}
  , options;
  
for (var arg in process.argv) {
    if (arg.substr(0, 2) === '--') {
        var parts = arg.split('=');
        opts[parts[0].substr(2).replace('-', '_')] = parts[1] || true;
    } else {
        argv.push(arg);
    }
}

// merge options from siteConf with passed in arguments
options = utils.mergeOptions(utils.getConfig(), opts);

// stylus compile
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .set('compress', !options.debug)
        .use(nib())
        .import('nib');
}

// express
app.configure(function() {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(stylus.middleware({
        src: __dirname + '/app/assets', 
        dest: __dirname + '/public',
        compile: compile })
        );
    app.use(express['static'](__dirname + '/public')); 
    
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/app/views');
});

// run NODE_ENV=development node server.js
app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    //app.use(express['static'](__dirname + '/public')); 
});
    
// run NODE_ENV=production node server.js
app.configure('production', function() {
    app.use(express.errorHandler());
    //app.use(gzippo.staticGzip(__dirname + '/public', {maxAge: 31557600000})); 
});

// routes
require('./app/routes').actions(app, options);

// start host
var port = options.port || 3000;
console.log('\nStarting server on port ' + port);

if (!module.parent) {
    app.listen(port);
}