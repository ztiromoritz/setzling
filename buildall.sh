#!/bin/bash

cd $cd "$(dirname "$0")"
cd common
npm run build
cd ../client
npm run build
cd ../server
npm start
