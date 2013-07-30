var util = require('util'),
    http = require('http'),
    _ = require('underscore');
    
 function prettyFn (e) {
    return util.inspect(e).replace(/\n/g, '');
};
    
 var HttpService = function () {
    this.config = {};
    this.intervals = {};
};

HttpService.prototype.init = function (callback) {
    //db.init();
    this.listen = _.bind(this.listen, this);
    callback();
};

HttpService.prototype.start = function (config) {
    var self = this;
    this.config = config;

    console.log('Starting HTTP server');

    this.init(function () {
        var server = http.createServer(function (req, res) {
            self.handleRequest(req, res);
        });
        self.server = server;
        server.listen(config.port, config.host, self.listen);
        server.on('close', self.onClose);
    });
};

HttpService.prototype.stop = function () {
    if (this.server) this.server.close();
};

HttpService.prototype.listen = function (e) {
    if (e) {
        console.log('HTTP Server listen error: %s', prettyFn(e));
        process.exit();
        return;
    }
    console.log('HTTP Server listening on ' + (this.config.host + ':' + this.config.port));
};

HttpService.prototype.onClose = function () {
    console.log('HTTP Server stopped');
};


HttpService.prototype.handleRequest = function (req, res) {
    var self = this;

    try {
        var message = unescape(req.url);
        res.end(message);
    } catch (e) {
        console.log('Catch exception for GET req: %s', prettyFn(e));
        res.end();
    }
};

var httpServer = new HttpService();
httpServer.start({host:process.env.IP, port:process.env.POR});