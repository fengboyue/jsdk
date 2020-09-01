#!/bin/bash
source ./_version.sh

sed -i '' "1i\ 
/**
1i\ 
 * JSDK $VER 
1i\ 
 * https://github.com/fengboyue/jsdk/
1i\ 
 * (c) 2007-2020 Frank.Feng<boyue.feng@foxmail.com>
1i\ 
 * MIT license
1i\ 
 */
" $1