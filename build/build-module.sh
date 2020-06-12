#!/bin/bash
name=$1
echo "开始编译${name}"

if [ "${name}" = "jsdk" ]; then  
tsc -d --target es6 -p ${name}.json
./_comments.sh ../dist/jsdk.d.ts
else  
tsc --target es6 -p ${name}.json
fi 
./_comments.sh ${name}.js
./_sourcemap.sh ${name}.js

echo "开始压缩${name}"
uglifyjs ../dist/${name}.js --warn --ecma 6 -o ../dist/${name}.min.js
./_comments.sh ${name}.min.js
echo "${name}构建完毕"