#!/bin/bash
name='tests'
echo "开始编译${name}"
tsc --target es6 -p ${name}.json
./_comments.sh ../tests/${name}.js
./_sourcemap.sh ../tests/${name}.js

echo "开始压缩${name}"
uglifyjs ../tests/${name}.js --warn --ecma 6 -o ../tests/${name}.min.js
./_comments.sh ../tests/${name}.min.js
echo "${name}构建完毕"