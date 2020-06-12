#!/bin/bash
echo '开始构建'
./build-module.sh jsdk
./build-module.sh system
./build-module.sh jsui
./build-module.sh jsfx
./build-module.sh jsvp
./build-module.sh jsunit
./build-tests.sh 
./build-examples.sh 
echo '构建完毕'

