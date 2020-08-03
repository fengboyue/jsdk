#!/bin/bash
sed -i '' "1i\ 
//# sourceURL=$1
" ../dist/$1
