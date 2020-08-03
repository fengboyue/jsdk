#!/bin/bash
name='tests'
echo "开始编译${name}"
tsc --target es6 -p ${name}.json
./_comments.sh ${name}.js
./_sourcemap.sh ${name}.js

echo "开始压缩${name}"
uglifyjs ../dist/${name}.js --warn --ecma 6 -o ../dist/${name}.min.js
./_comments.sh ${name}.min.js
echo "${name}构建完毕"