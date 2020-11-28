#!/bin/bash

cd $cd "$(dirname "$0")"
cd common
npm $1 run build
cd ../client
npm $1 run build
cd ../server
npm start
