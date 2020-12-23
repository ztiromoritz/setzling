# setzling


## Development


### common
``` 
cd common; npm i 
```
Build it once
```
npm build
```
Or if you want to change it during development
```
npm watch
```

### server
```
cd server; npm i
```

Start the server
```
npm start
```

### client
```
cd client; npm i
npm run build:vendor  // Once and only if you changed the depenencies. 
                      // See webpack.vendor.confg.js

npm run build:webpack // To rebuild the src (not including vendor dependencies)

npm run watch         // For F5 development
```
