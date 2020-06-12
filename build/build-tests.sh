#!/bin/bash
name='tests'
echo "开始编译${name}"
tsc --target es6 -p ${name}.json

sed -i '' "1 i\ 
//@ sourceURL=${name}.js
" ../tests/${name}.js

echo "${name}构建完毕"