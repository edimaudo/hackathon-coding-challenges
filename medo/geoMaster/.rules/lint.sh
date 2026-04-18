1#!/bin/bash
2
3# Run tsgo, biome lint, tailwindcss in parallel
4npx tsgo -p tsconfig.check.json &
5pid_tsgo=$!
6
7npx biome lint &
8pid_biome=$!
9
10npx tailwindcss -i ./src/index.css -o /dev/null 2>&1 &
11pid_tw=$!
12
13# Wait and collect exit codes
14fail=0
15
16wait $pid_tsgo || fail=1
17wait $pid_biome || fail=1
18wait $pid_tw || fail=1
19
20if [ $fail -ne 0 ]; then
21  exit 1
22fi
23
24# All lint passed, run build
25.rules/testBuild.sh