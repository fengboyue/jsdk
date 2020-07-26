#!/bin/bash
echo '开始生成API文档'
sudo typedoc --mode file --out "../api/" "../source/" --tsconfig jsdk.json --readme "../README.md" --name "JSDK 2.3.1 API" --excludePrivate --hideGenerator --ignoreCompilerErrors --disableSources
echo '文档生成完毕'
