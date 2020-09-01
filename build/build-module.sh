#!/bin/bash
name=$1
echo "开始编译${name}"

if [ "${name}" = "jsdk" ]; then  
tsc -d --target es6 -p ${name}.json
./_comments.sh ../dist/jsdk.d.ts

#重要文件内设定版本号
source ./_version.sh
sed -i '' "1c\ 
//JSDK $VER
" ../dist/jsdk-config.js

sed -i '' "3c\ 
\  \"version\": \"$VER\",
" ../package.json

else  
tsc --target es6 -p ${name}.json
fi 

#添加注释
./_comments.sh ../dist/${name}.js
./_sourcemap.sh ../dist/${name}.js

echo "开始压缩${name}"
uglifyjs ../dist/${name}.js --warn --ecma 6 -o ../dist/${name}.min.js
./_comments.sh ../dist/${name}.min.js
echo "${name}构建完毕"