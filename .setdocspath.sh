#!/bin/sh
mkdir -p docs/$1;
echo "{\"source\":\"src\", \"destination\":\"docs/$1\"}" > esdoc.json;
