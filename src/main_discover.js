// to enable es2015 features
'use strict';

console.log('[main_discover] create discover')
let Discover = require('./discover/discover')
let discover = new Discover()

console.log(discover.state)
discover.state = 'poweredOn'
