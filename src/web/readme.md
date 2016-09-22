# Web Controller for the Raspberry Pi

# Usage
2. npm install
3. node app
4. open in browser 'http://your.IP.Address:9090'

# Note
While running the server, the following error could appear:

```sh
$ Error when trying to open pin 13 gpio-admin: could not flush data to /sys/class/gpio/export: Device or resource busy
```

This Error occures when the application tries to open a pin which is already open. This error won't affect the application
in any way.
