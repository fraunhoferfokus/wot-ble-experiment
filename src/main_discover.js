// to enable es2015 features
'use strict';

console.log('[main_discover] create discover object')
let Discover = require('./discover/discover')
let discover = new Discover()

console.log('[main_discover] current power state', discover.state)

if(discover.state === 'poweredOff'){
    console.log('[main_discover] set power to poweredOn')
    discover.state = 'poweredOn'
}
