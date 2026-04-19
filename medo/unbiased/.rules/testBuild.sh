#!/bin/bash
2
3VITE_TEMP="node_modules/.vite-temp"
4if [ -L "$VITE_TEMP" ]; then
5    rm "$VITE_TEMP"
6    mkdir -p "$VITE_TEMP"
7elif [ ! -e "$VITE_TEMP" ]; then
8    mkdir -p "$VITE_TEMP"
9fi
10
11OUTPUT=$(npx vite build --minify false --logLevel error --outDir /workspace/.dist 2>&1)
12EXIT_CODE=$?
13
14if [ $EXIT_CODE -ne 0 ]; then
15    echo "$OUTPUT"
16fi
17
18exit $EXIT_CODE