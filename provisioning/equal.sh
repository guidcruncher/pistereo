#!/bin/bash

if [ "$1" == 'set' ]; then
index=$(("$2"))
control=$(amixer -D equal contents | sed -e '/^  ;/d' | sed '/^  : values=/d' | sort -V | sed "${index}q;d" )
echo "$control"
else
  amixer -D equal contents | sed -e '/^  ;/d' | sed 's/  : values=\(.*\)/\1, /'
fi
