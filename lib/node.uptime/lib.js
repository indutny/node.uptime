// Merge two object recursively
var merge = exports.merge = function(a, b) {
  var c = {};
  if (a) for (var i in a) c[i] = a[i];
  if (b) for (var i in b) c[i] = typeof c[i] === 'object' ?
                                    merge(c[i], b[i]) : b[i];
  return c;                                  
};

// Default options
exports.options = {
  interval: 5000,
  url: '/',
  method: 'GET',
  headers: {
    'Connection': 'keep-alive'
  }
};
