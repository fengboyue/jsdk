#!/bin/bash
source ./_version.sh
echo '开始生成API文档'
sudo typedoc --mode file --out "../api/" "../source/" --tsconfig jsdk.json --readme "../README.md" --name "JSDK $VER API" --excludePrivate --hideGenerator --ignoreCompilerErrors --disableSources
echo '文档生成完毕'
