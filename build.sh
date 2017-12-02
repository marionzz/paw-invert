#!/bin/bash -ex
DIST='../dist/dev.zip'
rm -rfv **/.DS_Stor*
cd src
rm -f "$DIST"
zip -r "$DIST" *
