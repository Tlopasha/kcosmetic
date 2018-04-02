# ltv
LTV Website and Project Management System

## Usage
Install dependencies
```bash
yarn
```

For Development
```bash
yarn dev
```

Build web app scripts and styles:
```bash
yarn build
```

For Production
```bash
yarn start
```

## Docker
Building the images for the first time
```bash
docker-compose build
```

Start the images
```
docker-compose up
```

## Directory Structure

## Bundled server-side
If you want to bundle your NodeJS server-side code run webpack on server code      with `yarn build && yarn build:server` command. It if was success, run the         server: `yarn start:bundle`

 If you want to export bundled version copy these folders & files to the new place:

 ```txt
 - server
   - locales
   - public
   - views
   - bundle.js
 - package.json
 - config.js (optional)
 ```


## Features


## Author
Nhut Vo <nhut@ltv.vn>

