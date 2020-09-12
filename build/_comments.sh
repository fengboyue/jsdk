#!/bin/bash
source ./_version.sh

sed -i '' "1i\ 
//JSDK $VER MIT
" $1