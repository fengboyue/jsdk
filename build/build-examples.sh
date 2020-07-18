#!/bin/bash
name='examples'
echo "开始编译${name}"
tsc --target es6 -p ${name}.json
echo "${name}构建完毕"