#!/bin/sh

echo "*** Build NextJS ***"
call npm run build

echo
echo "*** Compile & Save docker image ***"
echo
call docker build -q -t ink-md-editor:latest .
call docker save -o ink-md-editor.tar ink-md-editor:latest

echo
echo "*** Copy to share dir ***"
echo
mkdir share
rm ink-md-editor.tar.gz
gzip ink-md-editor.tar
mv ink-md-editor.tar.gz share
cp readme_share.md share/README.md

echo
echo "*** Final Check ***"
echo
call docker images
ls -a share
