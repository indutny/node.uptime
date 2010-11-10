var lib = require('./lib'),
    http = require('http');
    
module.exports = function(port, host, _options) {
  // Merge default options
  var options = lib.merge(lib.options, _options),
      emitter = options.emitter = new (process.EventEmitter);
      
  // Start pinging
  emitter.on('start', function() {
    if (!options._timer) {
      ping();
    }
  });
  
  // On 'stop' message - clearTimeout
  emitter.on('stop', function() {
    clearTimeout(options._timer);
    options._timer = null;
  });
  
  // If debug - log each ping
  if (options.debug) {
    emitter.on('ping', function(timings) {
      console.log(timings);
    });
  };
  
  function ping() {
    var timings = {
      start: +new Date
    };
    
    var client = http.createClient(port, host),
        request = client.request(options.method, options.url, options.headers);   
    
    // Handle errors
    var onerror = function() {
      timings.error = +new Date - timings.start;
      emitter.emit('ping', timings);
      setTimeout(ping, options.interval);
    };
    client.on('error', onerror);
    
    // On response - calculate timings
    var onresponse = function(response) {    
      
      timings.connected = +new Date - timings.start;
      response.on('end', function() {
        timings.disconnected = +new Date - timings.start;
        emitter.emit('ping', timings);
        setTimeout(ping, options.interval);
        
        client.destroy();
      });
    };    
    request.on('response', onresponse); 
    
    // Remove handlers
    var onclose = function() {
      client.removeListener('error', onerror);
      client.removeListener('close', onclose);
      request.removeListener('response', onresponse);      
    }
    client.on('close', onclose);

    // Send request
    request.end();
    
  };
  
  // Autostart
  emitter.emit('start');
  
  return options.emitter;
};
