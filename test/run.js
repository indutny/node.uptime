var uptime = require('../lib/node.uptime');

uptime(59841, '127.0.0.1', {
  interval: 500
}).on('ping', function(timings) {
  console.log(timings);
});
