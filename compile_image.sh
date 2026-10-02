#!/bin/sh

echo "*** Build NextJS ***"
npm run build

echo
echo "*** Compile & Save docker image ***"
echo
docker build -q -t ink-md-editor:latest .
docker save -o ink-md-editor.tar ink-md-editor:latest

echo
echo "*** Copy to share dir ***"
echo
mkdir share
rm ink-md-editor.tar.gz
gzip ink-md-editor.tar
mv ink-md-editor.tar.gz share
cp README.md share/README.md
sed -i '' '/^npm install$/,/^npm run dev$/c\
gunzip ink-md-editor.tar.gz\
docker load -i ink-md-editor.tar\
docker compose up -d
' share/README.md

echo
echo "*** Final Check ***"
echo
docker images
ls -a share
