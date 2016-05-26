// to enable es2015 features
'use strict';

console.log('[main_discover] create discover')
let Discover = require('./discover/discover')
let discover = new Discover()

console.log('[main_discover] power state', discover.state)

if(discover.state === 'poweredOff'){
    console.log('[main_discover] set power to poweredOn')
    discover.state = 'poweredOn'
}
