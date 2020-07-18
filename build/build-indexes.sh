#!/bin/bash
echo '开始生成目录'
host="http://localhost:8000/jsdk"
root="../examples"
rm -f ${root}/index.html
curl -o ${root}/index.html ${host}/examples/

function read_dir(){
for file in `ls $1` #注意此处这是两个反引号，表示运行系统命令
do
 if [ -d $1"/"$file ] #注意此处之间一定要加上空格，否则会报错
 then
 path=$1"/"$file
 dir=${path#*/}
 echo ${host}/${dir}/
 rm -f $path/index.html
 curl -o $path/index.html ${host}/${dir}/
 read_dir $1"/"$file
 fi
done
} 
#读取根目录
read_dir $root
echo '目录生成完毕'