#!/bin/bash
;
if [ "$1" == 'set' ]; then
index=$(("$2"))
control=$(amixer -D equal contents | sed -e '/^  ;/d' | sed '/^  : values=/d' | sort -V | sed "${index}q;d")
control=$(amixer -D equal contents | sed -e '/^  ;/d' | sed "s/.*name='\(.*\)'.*/\1/" | sed "/^  : values=/d" | sort -V | sed "${index}q;d" )
echo "$control"
amixer -D equal get "$control"
else
 amixer -D equal contents | sed -e '/^  ;/d' | sed "s/.*name='\(.*\)'.*/\1/" | sed "s/  : values=//" | sed 's/\n/f/'
fi
