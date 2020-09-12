#!/bin/bash
echo '开始构建'
./build-module.sh jsdk
./build-module.sh jscore
./build-module.sh jslang
./build-module.sh jsds
./build-module.sh jsugar
./build-module.sh jsmath
./build-module.sh js2d
./build-module.sh jsmedia
./build-module.sh jsui
./build-module.sh jsan
./build-module.sh jsmvc
./build-module.sh jsfx
./build-module.sh jsvp
./build-module.sh jsunit
./build-tests.sh 
./build-examples.sh 
echo '构建完毕'